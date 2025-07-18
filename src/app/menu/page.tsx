// src/app/menu/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Categoria } from '@/types';
import MenuCategorySection from '@/app/components/menu/MenuCategorySection';
import FilterButton from '@/app/components/ui/FilterButton';
import Loader from '@/app/components/ui/Loader';
import ErrorMessage from '@/app/components/ui/ErrorMessage';

// Componente memoizado
const MemoizedMenuCategorySection = React.memo(MenuCategorySection);

export default function MenuPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>(['all']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setCategorias(Array.isArray(data) ? data : data.categorias || []);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleFilter = (id: string) =>
    setActiveFilters(prev => {
      if (id === 'all') return ['all'];
      const next = prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev.filter(x => x !== 'all'), id];
      return next.length ? next : ['all'];
    });

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  const mainCategories = [
    { id: 'all', name: 'Mostrar todo' },
    ...categorias.map(c => ({ id: c.id.toString(), name: c.nombre })),
  ];

  return (
    <>
      {/* filtros globales fijos (bajo navbar h-16) */}
      <div className="
        fixed top-16 left-0 w-full h-16
        bg-amber-50 border-b border-gray-200 z-40
      ">
        <div className="
          container mx-auto h-full
          px-4 sm:px-6 lg:px-8
          flex items-center gap-3
          overflow-x-auto whitespace-nowrap
        ">
          {mainCategories.map(cat => (
            <FilterButton
              key={cat.id}
              label={cat.name}
              isActive={activeFilters.includes(cat.id)}
              onClick={() => toggleFilter(cat.id)}
            />
          ))}
        </div>
      </div>

      {/* contenido: margen top = navbar(4rem) + filtros(4rem) */}
      <main className="mt-[8rem] pb-16">
        {categorias
          .filter(c =>
            activeFilters.includes('all') ||
            activeFilters.includes(c.id.toString())
          )
          .map(categoria => (
            <MemoizedMenuCategorySection
              key={categoria.id}
              categoria={categoria}
            />
          ))}
      </main>
    </>
  );
}