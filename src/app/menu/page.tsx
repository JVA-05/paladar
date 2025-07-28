'use client';

import React, { useState, useEffect } from 'react';
import { Categoria } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import MenuCategorySection from '@/app/components/menu/MenuCategorySection';
import FilterButton from '@/app/components/ui/FilterButton';
import FilterBar from '@/app/components/ui/FilterBar';
import Loader from '@/app/components/ui/Loader';
import ErrorMessage from '@/app/components/ui/ErrorMessage';

export default function MenuPage() {
  const [storedCats, setStoredCats] = useLocalStorage<Categoria[]>(
    'menu-categorias',
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [storedCats, setStoredCats]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <FilterBar top="top-16" zIndex={50}>
        {/* Opcional: botones solo marcan con estilo, no ocultan nada */}
        {[
          { id: 'all', name: 'Mostrar todo' },
          ...storedCats.map(c => ({
            id: c.id.toString(),
            name: c.nombre,
          })),
        ].map(btn => (
          <FilterButton
            key={btn.id}
            label={btn.name}
            isActive={btn.id === 'all'}
            onClick={() => {
              /* podrías hacer scroll a la sección si quieres */
            }}
          />
        ))}
      </FilterBar>

      <main className="pt-16 pb-16 space-y-16">
        {/* Montamos TODO sin hidden */}
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
