'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import type { Plato } from '@/types';
import { useImageLoad } from '@/context/ImageLoadContext';

function MenuListItem({ plato }: { plato: Plato }) {
  const src = plato.imagen || '/img/comida/ensalada.jpg';

  const { isLoaded, markLoaded } = useImageLoad();
  const [loaded, setLoaded] = useState(() => isLoaded(src));

  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '100px',
  });

  const shouldLoad = inView || loaded;

  return (
    <div ref={ref} className="flex items-center bg-white rounded-lg shadow p-3">
      <div className="relative w-20 h-20 flex-shrink-0">
        {shouldLoad && (
          <Image
            src={src}
            alt={plato.nombre}
            fill
            sizes="80px"
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
        {!loaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
      </div>
      <div className="ml-4 flex-1">
        <h4 className="text-base font-semibold text-amber-900">{plato.nombre}</h4>
        <p className="text-sm text-gray-600 line-clamp-2">{plato.descripcion}</p>
        <span className="mt-1 block text-sm font-bold text-amber-800">
          ${plato.precio.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export default React.memo(MenuListItem);
