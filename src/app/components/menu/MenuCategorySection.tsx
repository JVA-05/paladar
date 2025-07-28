'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Categoria, Plato, Subcategoria } from '@/types';
import MenuCard from './MenuCard';
import MenuListItem from './MenuListItem';
import VirtualizedMenu from './VirtualizedMenu';
import FilterButton from '@/app/components/ui/FilterButton';
import { useIsClient } from '@/hooks/useIsClient';

interface Props {  
  categoria: Categoria;
}

export default function MenuCategorySection({ categoria }: Props) {
  const isClient = useIsClient();
  const subs: Subcategoria[] = categoria.subcategorias ?? [];
  const directos: Plato[] = categoria.platos ?? [];

  // Persistencia en localStorage
  const [activeSubFilters, setActiveSubFilters] = useState<number[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isClient) return;
    const key = `subFilters_${categoria.id}`;
    const stored = localStorage.getItem(key);
    setActiveSubFilters(
      stored 
        ? JSON.parse(stored) 
        : subs.map(s => s.id)
    );
    setIsInitialized(true);
  }, [categoria.id, subs, isClient]);

  const toggleSub = useCallback((id: number) => {
    setActiveSubFilters(prev => {
      const next = prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id];
      if (isClient) {
        localStorage.setItem(
          `subFilters_${categoria.id}`,
          JSON.stringify(next)
        );
      }
      return next;
    });
  }, [categoria.id, isClient]);

  const filteredSubs = useMemo(() => {
    if (activeSubFilters.length === 0) return subs;
    return subs.filter(s => activeSubFilters.includes(s.id));
  }, [subs, activeSubFilters]);

  const isCompleta = subs.length === 0 && directos.length > 0;

  // Platos planos para móvil
  const directosPlatos = directos;
  const filteredPlatos = useMemo(
    () => filteredSubs.flatMap(s => s.platos ?? []),
    [filteredSubs]
  );

  if (!isInitialized) return null;

  return (
    <section className="mb-16">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-900">
          {categoria.nombre}
        </h2>
      </header>

      {isCompleta ? (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* MÓVIL: virtualizado */}
          <div className="md:hidden">
            <VirtualizedMenu platos={directosPlatos} itemSize={100} />
          </div>

          {/* DESKTOP: grid de cards */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {directosPlatos.map(plato => (
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
          <div className="md:hidden sticky top-28 z-30 bg-amber-50 border-b border-gray-200 py-3 mb-4">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto whitespace-nowrap">
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

          {/* contenidos */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* MÓVIL: virtualizado */}
            <div className="md:hidden">
              <VirtualizedMenu platos={filteredPlatos} itemSize={100} />
            </div>

            {/* DESKTOP: cards */}
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlatos.map(plato => (
                <MenuCard key={plato.id} plato={plato} />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
