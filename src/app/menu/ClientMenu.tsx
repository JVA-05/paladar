// src/app/menu/ClientMenu.tsx
'use client';

import React, { useEffect, useState, memo } from 'react';
import { Categoria } from '@/types';
import { apiFetch } from '@/lib/apiClient';
import FilterBar from '@/app/components/ui/FilterBar';
import FilterButton from '@/app/components/ui/FilterButton';
import MenuCategorySection from '@/app/components/menu/MenuCategorySection';

const MemoSection = memo(MenuCategorySection);

export default function ClientMenu() {
  const [categorias, setCategorias] = useState<Categoria[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(['all']);

  // Función para cargar datos
  const loadMenu = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/menu');
      setCategorias(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Primer fetch
    loadMenu();

    // Refrescar cada 60 s
    const interval = setInterval(loadMenu, 60_000);
    return () => clearInterval(interval);
  }, []);

  const toggleFilter = (id: string) =>
    setActiveFilters(prev => {
      if (id === 'all') return ['all'];
      const next = prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev.filter(x => x !== 'all'), id];
      return next.length ? next : ['all'];
    });

  if (loading) return <div className="p-4 text-center">Cargando menú…</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!categorias) return null;

  const mainCategories = [
    { id: 'all', name: 'Mostrar todo' },
    ...categorias.map(c => ({ id: String(c.id), name: c.nombre })),
  ];

  const filtered = categorias.filter(
    c => activeFilters.includes('all') || activeFilters.includes(String(c.id))
  );

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

      <main className="pt-[8rem] pb-16">
        {filtered.map(categoria => (
          <MemoSection key={categoria.id} categoria={categoria} />
        ))}
      </main>
    </>
  );
}
