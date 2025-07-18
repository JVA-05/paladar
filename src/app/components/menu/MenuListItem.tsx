'use client';

import { Plato } from '@/types';

export default function MenuListItem({ plato }: { plato: Plato }) {
  return (
    <div className="flex items-center bg-white rounded-lg shadow p-3">
      <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden">
        <img
          src={plato.imagen || '/images/default-food.jpg'}
          alt={plato.nombre}
          className="w-full h-full object-cover"
          loading="eager"            // fuerza descarga inmediata
          decoding="async"           // acelera el pintado
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              '/images/default-food.jpg';
          }}
        />
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
