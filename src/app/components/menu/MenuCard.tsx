'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import type { Plato } from '@/types';
import { passthroughLoader } from '@/app/utils/cloudinaryLoader';
import { useImageLoad } from '@/context/ImageLoadContext';

function MenuCard({ plato }: { plato: Plato }) {
  const src =
    plato.imagen?.startsWith('https://')
      ? plato.imagen
      : '/img/comida/ensalada.jpg';

  const { isLoaded, markLoaded } = useImageLoad();

  // Si ya la marcamos cargada, iniciamos con loaded = true
  const [loaded, setLoaded] = useState(() => isLoaded(src));

  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px',
  });

  const shouldLoad = inView || loaded;

  return (
    <article ref={ref} className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow p-4">
      <div className="relative w-full h-48">
        {shouldLoad && (
          <Image
            loader={passthroughLoader}
            src={src}
            alt={plato.nombre}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            loading="eager"
            className={`object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoadingComplete={() => {
              setLoaded(true);
              markLoaded(src);
            }}
            onError={() => {
              markLoaded(src);
              setLoaded(true);
            }}
          />
        )}
        {!loaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
      </div>
      <div className="mt-2">
        <h3 className="text-lg font-bold text-amber-900">{plato.nombre}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{plato.descripcion}</p>
        <span className="text-lg font-bold text-amber-800">
          ${plato.precio.toFixed(2)}
        </span>
      </div>
    </article>
  );
}

export default React.memo(MenuCard);
