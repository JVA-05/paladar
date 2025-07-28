// src/app/components/menu/MenuCategorySection.tsx
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Categoria, Plato, Subcategoria } from '@/types';
import MenuCard from './MenuCard';
import MenuListItem from './MenuListItem';
import FilterButton from '@/app/components/ui/FilterButton';
import { useIsClient } from '@/hooks/useIsClient';

interface Props {  
  categoria: Categoria;
}

export default function MenuCategorySection({ categoria }: Props) {
  const isClient = useIsClient();
  const subs: Subcategoria[] = categoria.subcategorias ?? [];
  const directos: Plato[] = categoria.platos ?? [];
  
  // Estado para los filtros - inicializar con todos los IDs activos
  const [activeSubFilters, setActiveSubFilters] = useState<number[]>(subs.map(s => s.id));
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Inicializar desde localStorage
  useEffect(() => {
    if (isClient) {
      const storedFilters = localStorage.getItem(`subFilters_${categoria.id}`);
      
      if (storedFilters) {
        setActiveSubFilters(JSON.parse(storedFilters));
      }
      
      // Marcar como inicializado
      setIsInitialized(true);
    }
  }, [categoria.id, isClient]);

  const toggleSub = (id: number) => {
    setActiveSubFilters(prev => {
      const newFilters = prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id];
      
      // Guardar en localStorage solo en cliente
      if (isClient) {
        localStorage.setItem(`subFilters_${categoria.id}`, JSON.stringify(newFilters));
      }
      
      return newFilters;
    });
  };

  // Memoizar subcategorías filtradas
  const filteredSubs = useMemo(() => {
    // Mostrar todas si no hay filtros activos
    if (activeSubFilters.length === 0) return subs;
    
    // Filtrar basado en los filtros activos
    return subs.filter(s => activeSubFilters.includes(s.id));
  }, [subs, activeSubFilters]);

  const isCompleta = subs.length === 0 && directos.length > 0;

  // Memoizar elementos JSX para evitar recreación
  const directosMobileItems = useMemo(() => 
    directos.map(plato => <MenuListItem key={plato.id} plato={plato} />), 
    [directos]
  );

  const directosDesktopItems = useMemo(() => 
    directos.map(plato => <MenuCard key={plato.id} plato={plato} />), 
    [directos]
  );

  const filteredMobileItems = useMemo(() => 
    filteredSubs.flatMap(sub => 
      sub.platos?.map(p => <MenuListItem key={p.id} plato={p} />) ?? []
    ), 
    [filteredSubs]
  );

  const filteredDesktopItems = useMemo(() => 
    filteredSubs.flatMap(sub => 
      sub.platos?.map(p => <MenuCard key={p.id} plato={p} />) ?? []
    ), 
    [filteredSubs]
  );

  // No renderizar hasta inicializar
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
          {/* Móvil: lista vertical */}
          <div className="md:hidden space-y-4">
            {directosMobileItems}
          </div>
          {/* Desktop: grid de cards */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {directosDesktopItems}
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

          {/* subcategorías */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* móvil: lista completa */}
            <div className="md:hidden space-y-4">
              {filteredMobileItems}
            </div>
            
            {/* desktop: cards */}
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDesktopItems}
            </div>
          </div>
        </>
      )}
    </section>
  );
}