'use client'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Categoria } from '@/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import MenuCategorySection from '@/app/components/menu/MenuCategorySection'
import FilterButton from '@/app/components/ui/FilterButton'
import FilterBar from '@/app/components/ui/FilterBar'
import Loader from '@/app/components/ui/Loader'
import ErrorMessage from '@/app/components/ui/ErrorMessage'

const MemoizedMenuCategorySection = React.memo(MenuCategorySection)

export default function MenuPage() {
  //const [storedCats, setStoredCats] = useLocalStorage<Categoria[]>('menu-categorias', [])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilters, setActiveFilters] = useState<string[]>(['all'])

  useEffect(() => {
    // URL base del dashboard (no del frontend)
    const base = 'https://la-trocha-dashboard.onrender.com' // o ponlo en NEXT_PUBLIC_DASHBOARD_API_URL
    const controller = new AbortController()
  
    const fetchMenu = () => {
      const url = `${base}/api/menu` // 👈 aquí ya no usamos menu.json
      
      console.log('📡 Solicitando menú desde:', url)
  
      fetch(url, { cache: 'no-store', signal: controller.signal })
        .then(res => {
          if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
          return res.json() as Promise<Categoria[]>
        })
        .then(data => {
          console.log('📦 Datos recibidos del fetch:', data)
          setCategorias(data)
          setError(null)
        })
        .catch(e => {
          console.error('Error cargando menú:', e)
          setError((e as Error).message)
        })
        .finally(() => setLoading(false))
    }
  
    fetchMenu()
    const intervalId = setInterval(fetchMenu, 60000)
  
    return () => {
      clearInterval(intervalId)
      controller.abort()
    }
  }, [])
  
  
  

  const toggleFilter = useCallback((id: string) => {
    setActiveFilters(prev => {
      if (id === 'all') return ['all']
      const next = prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev.filter(x => x !== 'all'), id]
      return next.length ? next : ['all']
    })
  }, [])

  const mainCategories = useMemo(
    () => [
      { id: 'all', name: 'Mostrar todo' },
      ...categorias.map(c => ({ id: c.id.toString(), name: c.nombre }))
    ],
    [categorias]
  )

  const visibles = useMemo(
    () =>
      categorias.filter(
        c =>
          activeFilters.includes('all') ||
          activeFilters.includes(c.id.toString())
      ),
    [categorias, activeFilters]
  )

  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} />
 
  return (
    <div className="pt-16">
      <div className="text-center py-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-900">
          Nuestro Menú
        </h1>
      </div>

      <div className="sticky top-16 z-[900] bg-amber-50">
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
