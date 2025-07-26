// src/app/menu/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { Categoria } from '@/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import MenuCategorySection from '@/app/components/menu/MenuCategorySection'
import FilterButton from '@/app/components/ui/FilterButton'
import FilterBar from '@/app/components/ui/FilterBar'
import Loader from '@/app/components/ui/Loader'
import ErrorMessage from '@/app/components/ui/ErrorMessage'

export const dynamic = 'force-static'
const MemoizedMenuCategorySection = React.memo(MenuCategorySection)

export default function MenuPage() {
  // 1) Leemos o arrancamos vacío
  const [storedCats, setStoredCats] = useLocalStorage<Categoria[]>('menu-categorias', [])
  const [categorias, setCategorias] = useState<Categoria[]>(storedCats)
  const [loading, setLoading] = useState(storedCats.length === 0)
  const [error, setError] = useState<string | null>(null)

  // 2) Efecto: si no hay nada en localStorage, fetch + persistencia
  useEffect(() => {
    if (storedCats.length > 0) {
      setLoading(false)
      return
    }

    ;(async () => {
      try {
        const res = await fetch('/menu.json')
        if (!res.ok) throw new Error(res.statusText)
        const data: Categoria[] = await res.json()
        setCategorias(data)
        setStoredCats(data)
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // 3) Filtros principales (igual que antes)
  const [activeFilters, setActiveFilters] = useState<string[]>(['all'])
  const toggleFilter = (id: string) =>
    setActiveFilters(prev => {
      if (id === 'all') return ['all']
      const next = prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev.filter(x => x !== 'all'), id]
      return next.length ? next : ['all']
    })

  if (loading) return <Loader />
  if (error)   return <ErrorMessage message={error} />

  const mainCategories = [
    { id: 'all', name: 'Mostrar todo' },
    ...categorias.map(c => ({ id: c.id.toString(), name: c.nombre }))
  ]

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
        {categorias
          .filter(
            c =>
              activeFilters.includes('all') ||
              activeFilters.includes(c.id.toString())
          )
          .map(categoria => (
            <MemoizedMenuCategorySection
              key={categoria.id}
              categoria={categoria}
            />
          ))}
      </main>
    </>
  )
}
