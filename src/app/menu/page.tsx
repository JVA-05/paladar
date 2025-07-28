'use client';

import React, { useState ,useEffect, useCallback, useMemo } from 'react';
import { Categoria } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import MenuCategorySection from '@/app/components/menu/MenuCategorySection';
import FilterButton from '@/app/components/ui/FilterButton';
import FilterBar from '@/app/components/ui/FilterBar';
import Loader from '@/app/components/ui/Loader';
import ErrorMessage from '@/app/components/ui/ErrorMessage';

export default function MenuPage() {
  const [storedCats, setStoredCats] = useLocalStorage<Categoria[]>('menu-categorias', []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(['all']);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (storedCats.length > 0) {
      setLoading(false);
      setIsMounted(true);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch('/menu.json');
        if (!response.ok) throw new Error(response.statusText);
        const data: Categoria[] = await response.json();
        setStoredCats(data);
        setIsMounted(true);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setStoredCats, storedCats.length]);

  const toggleFilter = useCallback((id: string) => {
    setActiveFilters(prev => {
      if (id === 'all') return ['all'];
      const newFilters = prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev.filter(x => x !== 'all'), id];
      return newFilters.length ? newFilters : ['all'];
    });
  }, []);

  const mainCategories = useMemo(() => [
    { id: 'all', name: 'Mostrar todo' },
    ...storedCats.map(c => ({ id: c.id.toString(), name: c.nombre }))
  ], [storedCats]);

  const visibleCategories = useMemo(() => {
    return storedCats.filter(c => 
      activeFilters.includes('all') || 
      activeFilters.includes(c.id.toString())
    );
  }, [storedCats, activeFilters]);

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

      <main className="pt-16 pb-16">
        {/* Render persistente: todo se mantiene en DOM */}
        <div className={isMounted ? 'block' : 'hidden'}>
          {visibleCategories.map(categoria => (
            <MenuCategorySection
              key={categoria.id}
              categoria={categoria}
            />
          ))}
        </div>
      </main>
    </>
  );
}