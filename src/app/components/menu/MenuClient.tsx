'use client'

import { useState } from 'react'
import type { Categoria } from '@/types'
import MenuCategorySection from '@/app/components/menu/MenuCategorySection'
import FilterButton from '@/app/components/ui/FilterButton'

export default function MenuClient({ initialData }: { initialData: Categoria[] }) {
  const [categorias] = useState(initialData)
  const [activeFilters, setActiveFilters] = useState<string[]>(['all'])

  const toggleFilter = (id: string) =>
    setActiveFilters(prev => {
      if (id === 'all') return ['all']
      const next = prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev.filter(x => x !== 'all'), id]
      return next.length ? next : ['all']
    })

  const mainCategories = [
    { id: 'all', name: 'Mostrar todo' },
    ...categorias.map(c => ({ id: c.id.toString(), name: c.nombre })),
  ]

  return (
    <>
      {/* filtros fijos */}
      <div className="fixed top-16 left-0 w-full h-16 bg-amber-50 border-b border-gray-200 z-40">
        <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center gap-3 overflow-x-auto whitespace-nowrap">
          {mainCategories.map(cat => (
            <FilterButton
              key={cat.id}
              label={cat.name}
              isActive={activeFilters.includes(cat.id)}
              onClick={() => toggleFilter(cat.id)}
            />
          ))}
        </div>
      </div>

      {/* contenido (todo el menú ya viene en initialData) */}
      <main className="mt-[8rem] pb-16">
        {categorias
          .filter(c =>
            activeFilters.includes('all') ||
            activeFilters.includes(c.id.toString())
          )
          .map(c => (
            <MenuCategorySection key={c.id} categoria={c} />
          ))}
      </main>
    </>
  )
}
