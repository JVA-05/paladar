'use client';

import React, { useMemo } from 'react';
import { Categoria, Plato, Subcategoria } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import MenuCard from './MenuCard';
import MenuListItem from './MenuListItem';
import FilterButton from '@/app/components/ui/FilterButton';

interface Props {
  categoria: Categoria;
}

export default function MenuCategorySection({ categoria }: Props) {
  const subs: Subcategoria[] = categoria.subcategorias ?? [];
  const directos: Plato[] = categoria.platos ?? [];

  const [activeSubFilters, setActiveSubFilters] = useLocalStorage<number[]>(
    `subFilters_${categoria.id}`,
    subs.map(s => s.id)
  );

  const toggleSub = (id: number) => {
    setActiveSubFilters(prev => {
      const next = prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id];
      return next.length ? next : subs.map(s => s.id);
    });
  };

  const filteredSubs = useMemo(() => {
    if (activeSubFilters.length === 0) return subs;
    return subs.filter(s => activeSubFilters.includes(s.id));
  }, [subs, activeSubFilters]);

  const isCompleta = subs.length === 0 && directos.length > 0;

  const directosMobile = directos.map(p => (
    <MenuListItem key={p.id} plato={p} />
  ));
  const directosDesktop = directos.map(p => (
    <MenuCard key={p.id} plato={p} />
  ));

  const subMobile = filteredSubs.flatMap(s =>
    s.platos?.map(p => <MenuListItem key={p.id} plato={p} />) ?? []
  );
  const subDesktop = filteredSubs.flatMap(s =>
    s.platos?.map(p => <MenuCard key={p.id} plato={p} />) ?? []
  );

  return (
    <section id={`cat-${categoria.id}`} className="mb-16">
      <header className="container mx-auto px-4 mb-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-900">
          {categoria.nombre}
        </h2>
      </header>

      {isCompleta ? (
        <div className="container mx-auto px-4">
          <div className="md:hidden space-y-4">{directosMobile}</div>
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {directosDesktop}
          </div>
        </div>
      ) : (
        <>
          {/* filtros desktop */}
          <div className="hidden md:block bg-amber-50 border-b py-3 mb-6">
            <div className="container mx-auto px-4 overflow-x-auto whitespace-nowrap">
              <FilterButton
                label="Mostrar todo"
                isActive={activeSubFilters.length === 0}
                onClick={() => setActiveSubFilters([])}
              />
              {subs.map(sub => (
                <FilterButton
                  key={sub.id}
                  label={sub.nombre}
                  isActive={activeSubFilters.includes(sub.id)}
                  onClick={() => toggleSub(sub.id)}
                />
              ))}
            </div>
          </div>

          {/* filtros móvil */}
          <div className="md:hidden sticky top-28 z-30 bg-amber-50 border-b py-3 mb-4">
            <div className="container mx-auto px-4 overflow-x-auto whitespace-nowrap">
              <FilterButton
                label="Mostrar todo"
                isActive={activeSubFilters.length === 0}
                onClick={() => setActiveSubFilters([])}
              />
              {subs.map(sub => (
                <FilterButton
                  key={sub.id}
                  label={sub.nombre}
                  isActive={activeSubFilters.includes(sub.id)}
                  onClick={() => toggleSub(sub.id)}
                />
              ))}
            </div>
          </div>

          {/* listado */}
          <div className="container mx-auto px-4 space-y-8">
            <div className="md:hidden space-y-4">{subMobile}</div>
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {subDesktop}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
