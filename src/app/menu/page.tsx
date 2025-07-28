'use client';

import React, { useState, useEffect } from 'react';
import { Categoria } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useIsClient } from '@/hooks/useIsClient';
import MenuCategorySection from '@/app/components/menu/MenuCategorySection';
import FilterBar from '@/app/components/ui/FilterBar';
import FilterButton from '@/app/components/ui/FilterButton';
import Loader from '@/app/components/ui/Loader';
import ErrorMessage from '@/app/components/ui/ErrorMessage';

export default function MenuPage() {
  const isClient = useIsClient();
  const [storedCats, setStoredCats] = useLocalStorage<Categoria[]>(
    'menu-categorias',
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Solo al montar
  useEffect(() => {
    if (storedCats.length > 0) {
      setLoading(false);
      return;
    }
    fetch('/menu.json')
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json() as Promise<Categoria[]>;
      })
      .then(data => setStoredCats(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []); // <- dependencia vacía

  if (!isClient || loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  const buttons = [
    { id: 'all', name: 'Mostrar todo' },
    ...storedCats.map(c => ({ id: c.id.toString(), name: c.nombre })),
  ];

  return (
    <>
      <FilterBar top="top-16" zIndex={50}>
        {buttons.map(btn => (
          <FilterButton
            key={btn.id}
            label={btn.name}
            isActive={btn.id === 'all'}
            onClick={() => {
              /* opcional: scroll a sección */
            }}
          />
        ))}
      </FilterBar>

      <main className="pt-16 pb-16 space-y-16">
        {storedCats.map(categoria => (
          <MenuCategorySection
            key={categoria.id}
            categoria={categoria}
          />
        ))}
      </main>
    </>
  );
}
