'use client';
import Image from 'next/image';
import { Plato } from '@/types';
import { useState } from 'react';

export default function MenuListItem({
  plato
}: {
  plato: Plato;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageSrc = plato.imagen || '/img/comida/ensalada.jpg';

  return (
    <div className="flex items-center bg-white rounded-lg shadow p-3 z-0">
      <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
        <Image
          src={imageSrc}
          alt={plato.nombre}
          fill
          className={`object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="80px"
          onLoadingComplete={() => setImageLoaded(true)}
          onError={e => {
            (e.target as HTMLImageElement).src =
              '/img/comida/ensalada.jpg';
            setImageLoaded(true);
          }}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
      </div>
      <div className="ml-4 flex-1">
        <h4 className="text-base font-semibold text-amber-900">
          {plato.nombre}
        </h4>
        <div className="max-h-12 overflow-y-auto pr-1">
        <p className="text-sm text-gray-600">
        {plato.descripcion}
        </p>
</div>

        <span className="mt-1 block text-sm font-bold text-amber-800">
          ${plato.precio.toFixed(2)}
        </span>
      </div>
    </div>
  );
}