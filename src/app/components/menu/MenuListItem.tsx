'use client';

import Image from 'next/image';
import type { Plato } from '@/types';
import { useState } from 'react';

export default function MenuListItem({ plato }: { plato: Plato }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const src = plato.imagen || '/img/comida/ensalada.jpg';

  return (
    <div className="flex items-center bg-white rounded-lg shadow p-3">
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src={src}
          alt={plato.nombre}
          fill
          loading="lazy"
          sizes="80px"
          className={`object-cover transition-opacity duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoadingComplete={() => setImageLoaded(true)}
          onError={e => {
            (e.target as HTMLImageElement).src =
              '/img/comida/ensalada.jpg';
            setImageLoaded(true);
          }}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
      </div>
      <div className="ml-4 flex-1">
        <h4 className="text-base font-semibold text-amber-900">
          {plato.nombre}
        </h4>
        <p className="text-sm text-gray-600 line-clamp-2">
          {plato.descripcion}
        </p>
        <span className="mt-1 block text-sm font-bold text-amber-800">
          ${plato.precio.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
