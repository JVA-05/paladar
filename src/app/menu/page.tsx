'use client'

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo
} from 'react'
import { Categoria } from '@/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import MenuCategorySection from '@/app/components/menu/MenuCategorySection'
import FilterButton from '@/app/components/ui/FilterButton'
import FilterBar from '@/app/components/ui/FilterBar'
import Loader from '@/app/components/ui/Loader'
import ErrorMessage from '@/app/components/ui/ErrorMessage'

const MemoizedMenuCategorySection = React.memo(MenuCategorySection)

export default function MenuPage() {
  // 1) Persistencia
  const [storedCats, setStoredCats] = useLocalStorage<Categoria[]>(
    'menu-categorias',
    []
  )

  // 2) Estado
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)
  const [activeFilters, setActiveFilters] = useState<string[]>(['all'])

  // 3) Efecto de carga/ almacenamiento
  useEffect(() => {
    if (storedCats.length > 0) {
      setCategorias(storedCats)
      setLoading(false)
      return
    }
    fetch('/menu.json')
      .then(res => {
        if (!res.ok) throw new Error(res.statusText)
        return res.json() as Promise<Categoria[]>
      })
      .then(data => {
        setCategorias(data)
        setStoredCats(data)
      })
      .catch(e => setError((e as Error).message))
      .finally(() => setLoading(false))
  }, [storedCats, setStoredCats])

  // 4) Callbacks y memos: ¡antes de cualquier return!
  const toggleFilter = useCallback((id: string) => {
    setActiveFilters(prev => {
      if (id === 'all') return ['all']
      const next = prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev.filter(x => x !== 'all'), id]
      return next.length ? next : ['all']
    })
  }, [])

  const mainCategories = useMemo(() => [
    { id: 'all', name: 'Mostrar todo' },
    ...categorias.map(c => ({ id: c.id.toString(), name: c.nombre }))
  ], [categorias])

  const visibles = useMemo(
    () =>
      categorias.filter(
        c =>
          activeFilters.includes('all') ||
          activeFilters.includes(c.id.toString())
      ),
    [categorias, activeFilters]
  )

  // 5) Returns condicionales (tras los Hooks)
  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} />

  // 6) Render final
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
        {visibles.map(categoria => (
          <MemoizedMenuCategorySection
            key={categoria.id}
            categoria={categoria}
          />
        ))}
      </main>
    </>
  )
}
