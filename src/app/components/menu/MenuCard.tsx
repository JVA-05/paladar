// src/app/components/menu/MenuCard.tsx
'use client';

import Image from 'next/image';
import { Plato } from '@/types';

export default function MenuCard({ plato }: { plato: Plato }) {
  return (
    <article className="
      flex flex-col bg-white rounded-xl shadow-lg overflow-hidden
      hover:shadow-xl transition-shadow duration-300
      p-2 sm:p-4
    ">
      {/* Imagen: 16:9 en móvil, 4:3 en desktop */}
      <div className="relative w-full aspect-video md:aspect-[4/3]">
        <Image
          src={plato.imagen || '/images/default-food.jpg'}
          alt={plato.nombre}
          fill
          className="object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/default-food.jpg';
          }}
          unoptimized
        />
      </div>

      {/* Contenido */}
      <div className="mt-2 sm:mt-4 flex flex-col">
        <h3 className="text-sm sm:text-lg font-bold text-amber-900 mb-1 sm:mb-2">
          {plato.nombre}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-3 line-clamp-2">
          {plato.descripcion}
        </p>
        <span className="text-sm sm:text-lg font-bold text-amber-800">
          ${plato.precio.toFixed(2)}
        </span>
      </div>
    </article>
  );
}
