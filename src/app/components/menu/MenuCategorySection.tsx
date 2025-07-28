'use client';

import React, {
  useMemo,
  useState,
  useEffect,
  useCallback
} from 'react';
import { Categoria, Plato, Subcategoria } from '@/types';
import MenuCard from './MenuCard';
import MenuListItem from './MenuListItem';
import FilterButton from '@/app/components/ui/FilterButton';
import { useIsClient } from '@/hooks/useIsClient';

interface Props {
  categoria: Categoria;
}

function _MenuCategorySection({ categoria }: Props) {
  const isClient = useIsClient();
  const subs: Subcategoria[] = categoria.subcategorias ?? [];
  const directos: Plato[] = categoria.platos ?? [];

  // Estado de subfiltros
  const [activeSubFilters, setActiveSubFilters] = useState<number[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Leer localStorage al montar
  useEffect(() => {
    if (!isClient) return;
    const key = `subFilters_${categoria.id}`;
    const stored = localStorage.getItem(key);
    setActiveSubFilters(
      stored ? JSON.parse(stored) : subs.map(s => s.id)
    );
    setInitialized(true);
  }, [categoria.id, subs, isClient]);

  const toggleSub = useCallback(
    (id: number) => {
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
    },
    [categoria.id, isClient]
  );

  const filteredSubs = useMemo(() => {
    if (activeSubFilters.length === 0) return subs;
    return subs.filter(s => activeSubFilters.includes(s.id));
  }, [subs, activeSubFilters]);

  const isCompleta = subs.length === 0 && directos.length > 0;

  const directosPlatos = directos;
  const filteredPlatos = useMemo(
    () => filteredSubs.flatMap(s => s.platos ?? []),
    [filteredSubs]
  );

  if (!initialized) return null;

  return (
    <section className="mb-16">
      <header>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-900 mb-4">
          {categoria.nombre}
        </h2>
      </header>

      {isCompleta ? (
        /* PLATOS SIN SUBCATEGORÍAS */
        <>
          {/* MÓVIL: lista normal */}
          <div className="md:hidden space-y-4 mb-8">
            {directosPlatos.map(plato => (
              <MenuListItem key={plato.id} plato={plato} />
            ))}
          </div>

          {/* DESKTOP: grid de cards */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {directosPlatos.map(plato => (
              <MenuCard key={plato.id} plato={plato} />
            ))}
          </div>
        </>
      ) : (
        /* PLATOS CON SUBCATEGORÍAS */
        <>
          {/* Filtros Desktop */}
          <div className="hidden md:block bg-amber-50 border-b border-gray-200 py-3 mb-6">
            <div className="overflow-x-auto whitespace-nowrap">
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

          {/* Filtros Móvil */}
          <div className="md:hidden sticky top-28 z-30 bg-amber-50 border-b border-gray-200 py-3 mb-4">
            <div className="overflow-x-auto whitespace-nowrap">
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

          {/* Contenido */}
          <div className="space-y-8">
            {/* MÓVIL: lista normal */}
            <div className="md:hidden space-y-4">
              {filteredPlatos.map(plato => (
                <MenuListItem key={plato.id} plato={plato} />
              ))}
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

export default React.memo(
  _MenuCategorySection,
  (prev, next) => prev.categoria.id === next.categoria.id
);
