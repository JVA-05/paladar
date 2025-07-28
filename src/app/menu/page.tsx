'use client';

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Categoria } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import MenuCategorySection from '@/app/components/menu/MenuCategorySection';
import FilterButton from '@/app/components/ui/FilterButton';
import FilterBar from '@/app/components/ui/FilterBar';
import Loader from '@/app/components/ui/Loader';
import ErrorMessage from '@/app/components/ui/ErrorMessage';

// Mantener componentes renderizados incluso cuando no están visibles
const PersistentCategorySection = ({ categoria }: { categoria: Categoria }) => {
  return (
    <div style={{ display: 'contents' }}>
      <MenuCategorySection categoria={categoria} />
    </div>
  );
};

export default function MenuPage() {
  const [storedCats, setStoredCats] = useLocalStorage<Categoria[]>('menu-categorias', []);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(['all']);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cargar datos
  useEffect(() => {
    if (storedCats.length > 0) {
      setCategorias(storedCats);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch('/menu.json');
        if (!response.ok) throw new Error(response.statusText);
        const data: Categoria[] = await response.json();
        setCategorias(data);
        setStoredCats(data);
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
    
    // Scroll suave al cambiar categoría
    setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, []);

  const mainCategories = useMemo(() => [
    { id: 'all', name: 'Mostrar todo' },
    ...categorias.map(c => ({ id: c.id.toString(), name: c.nombre }))
  ], [categorias]);

  const visibleCategories = useMemo(() => {
    return categorias.filter(c => 
      activeFilters.includes('all') || 
      activeFilters.includes(c.id.toString())
    );
  }, [categorias, activeFilters]);

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

      <main ref={containerRef} className="pt-16 pb-16">
        {/* Renderizar TODAS las categorías pero controlar visibilidad */}
        {categorias.map(categoria => (
          <div 
            key={categoria.id}
            className={visibleCategories.some(v => v.id === categoria.id) ? 'block' : 'hidden'}
          >
            <PersistentCategorySection categoria={categoria} />
          </div>
        ))}
      </main>
    </>
  );
}