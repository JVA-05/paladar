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

  const [activeSubFilters, setActiveSubFilters] = useState<number[]>([]);
  const [initialized, setInitialized] = useState(false);

  const storageKey = `subFilters_${categoria.id}`;
  const EXPIRACION_MS = 1000 * 60 * 60 * 24; // 24 horas

  // Leer localStorage al montar con expiración
  useEffect(() => {
    if (!isClient) return;

    const stored = localStorage.getItem(storageKey);

    if (stored) {
      try {
        const { data, timestamp } = JSON.parse(stored);

        // Si ya pasó el tiempo de expiración, limpiar
        if (Date.now() - timestamp > EXPIRACION_MS) {
          localStorage.removeItem(storageKey);
          setActiveSubFilters([]);
        } else {
          setActiveSubFilters(Array.isArray(data) ? data : []);
        }
      } catch {
        // Si el formato no es válido, limpiar
        localStorage.removeItem(storageKey);
        setActiveSubFilters([]);
      }
    } else {
      setActiveSubFilters([]);
    }

    setInitialized(true);
  }, [categoria.id, isClient, storageKey]);

  // Guardar en localStorage con timestamp cada vez que cambie
  useEffect(() => {
    if (!isClient) return;

    const payload = {
      data: activeSubFilters,
      timestamp: Date.now()
    };

    localStorage.setItem(storageKey, JSON.stringify(payload));
  }, [activeSubFilters, isClient, storageKey]);

  const toggleSub = useCallback(
    (id: number) => {
      setActiveSubFilters(prev =>
        prev.includes(id)
          ? prev.filter(x => x !== id)
          : [...prev, id]
      );
    },
    []
  );

  const filteredSubs = useMemo(() => {
    if (activeSubFilters.length === 0) return subs;
    return subs.filter(s => activeSubFilters.includes(s.id));
  }, [subs, activeSubFilters]);

  const isCompleta = subs.length === 0 && directos.length > 0;

  const filteredPlatos = useMemo(
    () => filteredSubs.flatMap(s => s.platos ?? []),
    [filteredSubs]
  );

  if (!initialized) return null;

  return (
    <section className="mb-16">
      <header className="text-center mt-10 mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-900">
          {categoria.nombre}
        </h2>
      </header>

      {isCompleta ? (
        <>
          <div className="md:hidden space-y-4 mb-8">
            {directos.map(plato => (
              <MenuListItem key={plato.id} plato={plato} />
            ))}
          </div>
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {directos.map(plato => (
              <MenuCard key={plato.id} plato={plato} />
            ))}
          </div>
        </>
      ) : (
        <>
          <div
            className="sticky top-[120px] z-[800] bg-amber-50 min-h-[56px] border-b border-amber-200"
            style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
          >
            <div className="w-full overflow-x-auto scrollbar-custom">
              <div className="flex min-w-max px-2 py-3 justify-center">
                <div className="flex">
                  <FilterButton
                    label="Mostrar todo"
                    isActive={activeSubFilters.length === 0}
                    onClick={() => setActiveSubFilters([])}
                    className="mx-1 flex-shrink-0"
                  />
                  {subs.map(sub => (
                    <FilterButton
                      key={sub.id}
                      label={sub.nombre}
                      isActive={activeSubFilters.includes(sub.id)}
                      onClick={() => toggleSub(sub.id)}
                      className="mx-1 flex-shrink-0"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 mt-4">
            <div className="md:hidden space-y-4">
              {filteredPlatos.map(plato => (
                <MenuListItem key={plato.id} plato={plato} />
              ))}
            </div>
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
