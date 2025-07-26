// src/app/components/menu/MenuCategorySection.tsx
'use client';

import React, { useMemo } from 'react';
import { Categoria, Plato, Subcategoria } from '@/types';
import MenuCard from './MenuCard';
import MenuListItem from './MenuListItem';
import FilterButton from '@/app/components/ui/FilterButton';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Props {
  categoria: Categoria;
}

export default function MenuCategorySection({ categoria }: Props) {
  const subs: Subcategoria[] = categoria.subcategorias ?? [];
  const directos: Plato[] = categoria.platos ?? [];
  
  // Estado persistente para los filtros de subcategorías
  const [activeSubFilters, setActiveSubFilters] = useLocalStorage<number[]>(
    `subFilters_${categoria.id}`,
    []
  );
  
  const toggleSub = (id: number) => {
    setActiveSubFilters(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Memoizar subcategorías filtradas
  const filteredSubs = useMemo(() => 
    subs.filter(s => !activeSubFilters.length || activeSubFilters.includes(s.id)),
    [subs, activeSubFilters]
  );

  const isCompleta = subs.length === 0 && directos.length > 0;

  // Crear lista plana de platos para virtualización
  const mobileListItems = useMemo(() => {
    return filteredSubs.flatMap(sub => 
      sub.platos?.map(p => ({ ...p, subcategoryName: sub.nombre })) ?? []
    );
  }, [filteredSubs]);

  return (
    <section className="mb-16">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-900">
          {categoria.nombre}
        </h2>
      </header>

      {isCompleta ? (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Móvil: lista vertical */}
          <div className="md:hidden space-y-4">
            {directos.map(plato => (
              <MenuListItem key={plato.id} plato={plato} />
            ))}
          </div>
          {/* Desktop: grid de cards */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {directos.map(plato => (
              <MenuCard key={plato.id} plato={plato} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* filtros desktop */}
          <div className="hidden md:block bg-amber-50 border-b border-gray-200 py-3 mb-6">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto whitespace-nowrap">
              <FilterButton
                label="Mostrar todo"
                isActive={!activeSubFilters.length}
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
          <div className="md:hidden sticky top-28 z-30 bg-amber-50 border-b border-gray-200 py-3 mb-4">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto whitespace-nowrap">
              <FilterButton
                label="Mostrar todo"
                isActive={!activeSubFilters.length}
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

          {/* subcategorías */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* móvil: lista virtualizada */}
            {/* móvil: lista completa sin scrollbar */}
<div className="md:hidden space-y-4 px-4 sm:px-6 lg:px-8">
  {filteredSubs.flatMap(sub =>
    sub.platos?.map(p => (
      <MenuListItem key={p.id} plato={p} />
    )) ?? []
  )}
</div>

            
            {/* desktop: cards */}
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSubs.flatMap(sub =>
                sub.platos?.map(p => (
                  <MenuCard key={p.id} plato={p} />
                )) ?? []
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}