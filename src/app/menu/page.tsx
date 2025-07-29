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

  // 4) Callbacks y memos
  const toggleFilter = useCallback((id: string) => {
    setActiveFilters(prev => {
      if (id === 'all') return ['all']
      const next = prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev.filter(x => x !== 'all'), id]
      return next.length ? next : ['all']
    })
  }, [])

  // CORRECCIÓN: Definir mainCategories ANTES de usarlo
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

  // 5) Returns condicionales
  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="pt-16">
      {/* Encabezado con título centrado */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-amber-800">
          Nuestro Menú
        </h1>
      </div>
      
      {/* Contenedor para filtros fijos */}
      <div className="sticky top-16 z-[900] bg-amber-50">
        {/* Filtro de categorías - Misma estructura que subcategorías */}
        <div className="border-b border-amber-200">
          <FilterBar top="top-16" zIndex={900} className="border-t-0">
            <div className="w-full overflow-x-auto scrollbar-custom">
              <div className="flex min-w-max px-2 py-3 justify-center">
                <div className="flex">
                  {mainCategories.map(cat => (
                    <FilterButton
                      key={cat.id}
                      label={cat.name}
                      isActive={activeFilters.includes(cat.id)}
                      onClick={() => toggleFilter(cat.id)}
                      className="mx-1 flex-shrink-0"
                    />
                  ))}
                </div>
              </div>
            </div>
          </FilterBar>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="pb-16">
        {visibles.map(categoria => (
          <MemoizedMenuCategorySection
            key={categoria.id}
            categoria={categoria}
          />
        ))}
      </div>
    </div>
  )
}