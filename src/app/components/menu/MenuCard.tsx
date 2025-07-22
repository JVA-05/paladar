// src/app/components/menu/MenuCard.client.tsx
'use client';

import Image from 'next/image';
import type { Plato } from '@/types';
import { passthroughLoader } from '@/app/utils/cloudinaryLoader';

export default function MenuCard({ plato }: { plato: Plato }) {
  const src = plato.imagen?.startsWith('https://')
    ? plato.imagen
    : '/img/comida/ensalada.jpg';

  return (
    // z-0 para que quede detrás de los filtros
    <article className="relative z-0 flex flex-col bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow p-4">
      <div className="relative w-full aspect-video md:aspect-[4/3]">
        <Image
          loader={passthroughLoader}
          src={src}
          alt={plato.nombre}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          priority={false}
        />
      </div>
      <div className="mt-2">
        <h3 className="text-lg font-bold text-amber-900">{plato.nombre}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {plato.descripcion}
        </p>
        <span className="text-lg font-bold text-amber-800">
          ${plato.precio.toFixed(2)}
        </span>
      </div>
    </article>
  );
}
