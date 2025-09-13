'use client';
import Image from 'next/image';
import type { Plato } from '@/types';
import { passthroughLoader } from '@/app/utils/cloudinaryLoader';
import { useState } from 'react';

export default function MenuCard({ plato }: { plato: Plato }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Determina si hay URL válida
  const hasImage = Boolean(plato.imagen && plato.imagen.startsWith('https://'));

  return (
    <article className="relative flex flex-col bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow p-4">
      <div className="relative w-full h-48 overflow-hidden bg-gray-200 flex items-center justify-center">
        {hasImage ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-300 animate-pulse" />
            )}
            <Image
              loader={passthroughLoader}
              src={plato.imagen!}
              alt={plato.nombre}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              priority
              loading="eager"
              className={`object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoadingComplete={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />
          </>
        ) : (
          <span className="text-gray-500 font-medium">
            No Image
          </span>
        )}
      </div>

      <div className="mt-2">
        <h3 className="text-lg font-bold text-amber-900">
          {plato.nombre}
        </h3>
        <p className="text-sm text-gray-600 max-h-16 overflow-y-auto pr-1">
          {plato.descripcion}
        </p>
        <span className="text-lg font-bold text-amber-800">
          ${plato.precio.toFixed(2)}
        </span>
      </div>
    </article>
  );
}
