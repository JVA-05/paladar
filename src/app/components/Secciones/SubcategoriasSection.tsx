// src/app/components/Secciones/SubcategoriasSection.tsx
'use client'

import React, { useEffect, useState } from 'react'
import ModalCrearSubcategoria from '@/app/components/Modal/ModalCrearSubcategoria'
import ModalEditarSubcategoria from '@/app/components/Modal/ModalEditarSubcategoria'
import { apiFetch } from '@/lib/apiClient'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface Plato {
  id: number
  nombre: string
}

interface Subcategoria {
  id: number
  nombre: string
  categoriaId: number
  categoriaNombre: string
  platos: Plato[]
}

interface Categoria {
  id: number
  nombre: string
}

export default function SubcategoriasSection() {
  // Restaurar y guardar scroll
  const [scrollPos, setScrollPos] = useLocalStorage<{ x: number; y: number }>(
    'subcatsScroll',
    { x: 0, y: 0 }
  )
  useEffect(() => {
    window.scrollTo(scrollPos.x, scrollPos.y)
    const onScroll = () => {
      setScrollPos({ x: window.scrollX, y: window.scrollY })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([])
  const [categorias, setCategorias]       = useState<Categoria[]>([])
  const [creando, setCreando]             = useState(false)
  const [editando, setEditando]           = useState<Subcategoria | null>(null)

  // filtros persistidos
  const [filterName, setFilterName] = useLocalStorage<string>(
    'subcatsFilterName',
    ''
  )
  const [filterCatId, setFilterCatId] = useLocalStorage<number | ''>(
    'subcatsFilterCatId',
    ''
  )

  // carga inicial
  useEffect(() => {
    async function loadData() {
      try {
        const resSubs = await apiFetch('/api/admin/subcategorias')
        setSubcategorias(resSubs.subcategorias || [])

        const resCats = await apiFetch('/api/admin/categorias')
        setCategorias(resCats.categorias || [])
      } catch (err) {
        console.error('Error cargando datos:', err)
        alert('Error al cargar subcategorías o categorías.')
      }
    }
    loadData()
  }, [])

  const obtenerSubcategorias = async () => {
    try {
      const res = await apiFetch('/api/admin/subcategorias')
      setSubcategorias(res.subcategorias || [])
    } catch (err) {
      console.error('Error recargando subcategorías:', err)
      alert('Error al recargar subcategorías.')
    }
  }

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Eliminar esta subcategoría?')) return
    try {
      await apiFetch(`/api/admin/subcategorias/${id}`, { method: 'DELETE' })
      await obtenerSubcategorias()
    } catch (err) {
      console.error('Error eliminando subcategoría:', err)
      alert('No se pudo eliminar la subcategoría.')
    }
  }

  const filtered = subcategorias.filter(s => {
    const matchName = s.nombre.toLowerCase().includes(filterName.toLowerCase())
    const matchCat  = filterCatId === '' ? true : s.categoriaId === filterCatId
    return matchName && matchCat
  })

  return (
    <div>
      <h2 className="text-3xl font-bold text-black mb-6">
        Subcategorías
      </h2>

      {/* filtros */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar subcategoría..."
          value={filterName}
          onChange={e => setFilterName(e.target.value)}
          className="
            px-4 py-2 border border-gray-300 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-400
          "
        />
        <select
          value={filterCatId}
          onChange={e =>
            setFilterCatId(e.target.value === '' ? '' : Number(e.target.value))
          }
          className="
            px-4 py-2 border border-gray-300 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-400
          "
        >
          <option value="">Todas las categorías</option>
          {categorias.map(c => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* botón crear */}
      <button
        onClick={() => setCreando(true)}
        className="
          mb-6 w-48 whitespace-nowrap px-5 py-2
          bg-gradient-to-r from-violet-400 to-violet-600
          hover:from-violet-500 hover:to-violet-700
          text-white font-medium rounded-full
          shadow-lg hover:shadow-2xl
          transform hover:scale-105 active:scale-95
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-4 focus:ring-violet-500/50
          border-2 border-violet-700
        "
      >
        + Crear Subcategoría
      </button>

      {creando && (
        <ModalCrearSubcategoria
          onClose={() => setCreando(false)}
          onSaved={() => {
            setCreando(false)
            obtenerSubcategorias()
          }}
        />
      )}

      {/* listado */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {filtered.map(sub => (
          <li
            key={sub.id}
            className="
              relative z-0 hover:z-10 overflow-visible
              p-6 bg-white dark:bg-gray-800
              rounded-lg shadow-sm hover:shadow-lg
              transform hover:-translate-y-1 hover:scale-105 active:scale-100
              transition-all duration-300
              flex flex-col justify-between h-full
            "
          >
            <div>
              <h3 className="text-xl font-semibold text-white">
                {sub.nombre}
              </h3>
              <p className="text-sm text-gray-500">
                Categoría: {sub.categoriaNombre}
              </p>
            </div>

            <div className="mt-4 mb-6">
              <button className="relative group px-3 py-1 bg-blue-500 text-white rounded-md">
                {sub.platos.length} platos
                <div className="absolute left-0 mt-2 w-40 bg-gray-800 text-white p-2 rounded-md shadow-lg z-50 hidden group-hover:block">
                  {sub.platos.length > 0 ? (
                    sub.platos.map(p => (
                      <div key={p.id} className="text-sm">
                        {p.nombre}
                      </div>
                    ))
                  ) : (
                    <div className="italic">Sin platos</div>
                  )}
                </div>
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditando(sub)}
                className="
                  flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700
                  text-white font-medium rounded-md
                  shadow-sm hover:shadow-lg
                  transform hover:scale-105 active:scale-95
                  transition-all duration-200 ease-in-out
                "
              >
                Editar
              </button>
              <button
                onClick={() => handleEliminar(sub.id)}
                className="
                  flex-1 px-3 py-2 bg-red-600 hover:bg-red-700
                  text-white font-medium rounded-md
                  shadow-sm hover:shadow-lg
                  transform hover:scale-105 active:scale-95
                  transition-all duration-200 ease-in-out
                "
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editando && (
        <ModalEditarSubcategoria
          subcategoria={editando}
          onClose={() => setEditando(null)}
          onSaved={() => {
            setEditando(null)
            obtenerSubcategorias()
          }}
        />
      )}
    </div>
  )
}
