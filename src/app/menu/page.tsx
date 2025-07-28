'use client';

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef
} from 'react';
import { Categoria } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import CategoryWrapper from '@/app/components/menu/CategoryWrapper';
import FilterButton from '@/app/components/ui/FilterButton';
import FilterBar from '@/app/components/ui/FilterBar';
import Loader from '@/app/components/ui/Loader';
import ErrorMessage from '@/app/components/ui/ErrorMessage';

export default function MenuPage() {
  // 1) Inicializamos desde localStorage
  const [storedCats, setStoredCats] = useLocalStorage<Categoria[]>(
    'menu-categorias',
    []
  );
  // 2) Estado local: arranca con lo del storage (si existe)
  const [categorias, setCategorias] = useState<Categoria[]>(storedCats);
  const [loading, setLoading] = useState<boolean>(storedCats.length === 0);
  const [error, setError] = useState<string | null>(null);

  const [activeFilters, setActiveFilters] = useState<string[]>(['all']);
  const containerRef = useRef<HTMLElement>(null);

  // 3) Efecto *sin deps* para que corra **solo al montar**
  useEffect(() => {
    // Si ya había datos, no fetcheamos
    if (storedCats.length > 0) {
      setLoading(false);
      return;
    }

    // Si no, solicitamos /menu.json **UNA VEZ**
    async function fetchData() {
      try {
        const res = await fetch('/menu.json');
        if (!res.ok) throw new Error(res.statusText);
        const data: Categoria[] = await res.json();

        setCategorias(data);
        setStoredCats(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []); // ← vacío para que nunca se vuelva a ejecutar

  const toggleFilter = useCallback((id: string) => {
    setActiveFilters(prev => {
      if (id === 'all') return ['all'];
      const next = prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev.filter(x => x !== 'all'), id];
      return next.length ? next : ['all'];
    });
    containerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const mainCategories = useMemo(() => {
    return [
      { id: 'all', name: 'Mostrar todo' },
      ...categorias.map(c => ({ id: c.id.toString(), name: c.nombre }))
    ];
  }, [categorias]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <FilterBar top="top-16" zIndex={50}>
        {mainCategories.map(cat => (
          <FilterButton
            key={cat.id}
            label={cat.name}
            isActive={activeFilters.includes(cat.id)}
            onClick={() => toggleFilter(cat.id)}
          />
        ))}
      </FilterBar>

      <main
        ref={containerRef}
        className="pt-16 pb-16 container mx-auto px-4 sm:px-6 lg:px-8"
      >
        {categorias.map(c => {
          const isVisible =
            activeFilters.includes('all') ||
            activeFilters.includes(c.id.toString());

          return (
            <CategoryWrapper
              key={c.id}
              categoria={c}
              isVisible={isVisible}
            />
          );
        })}
      </main>
    </>
  );
}
