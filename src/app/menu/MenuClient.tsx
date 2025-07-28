// app/menu/MenuClient.tsx
'use client';

import React, { useState } from 'react';
import { Categoria } from '@/types';
import FilterBar from '@/app/components/ui/FilterBar';
import FilterButton from '@/app/components/ui/FilterButton';
import MenuCategorySection from '@/app/components/menu/MenuCategorySection';

export default function MenuClient({ categorias }: { categorias: Categoria[] }) {
  const [filtros, setFiltros] = useState<string[]>(['all']);

  const mainCats = [
    { id: 'all', nombre: 'Mostrar todo' },
    ...categorias.map(c => ({ id: c.id.toString(), nombre: c.nombre }))
  ];

  const toggle = (id: string) => {
    setFiltros(prev =>
      id === 'all'
        ? ['all']
        : prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev.filter(x => x !== 'all'), id]
    );
  };

  return (
    <>
      <FilterBar top="top-16" zIndex={50}>
        {mainCats.map(c => (
          <FilterButton
            key={c.id}
            label={c.nombre}
            isActive={filtros.includes(c.id)}
            onClick={() => toggle(c.id)}
          />
        ))}
      </FilterBar>

      <main className="pt-16 pb-16 space-y-16">
        {categorias.map(c => {
          const visible =
            filtros.includes('all') || filtros.includes(c.id.toString());
          return (
            <div key={c.id} className={visible ? 'block' : 'hidden'}>
              <MenuCategorySection categoria={c} />
            </div>
          );
        })}
      </main>
    </>
  );
}
