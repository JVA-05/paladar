// hooks/useInfinitePlatos.ts
import { useState, useCallback, useEffect } from 'react'

export interface Plato {
  id: number
  nombre: string
  descripcion?: string
  precio: number
  imagen?: string
  subcategoriaId?: number
  categoriaId?: number
}

export function useInfinitePlatos(initialTake = 5) {
  const [platos, setPlatos] = useState<Plato[]>([])
  const [page,   setPage]   = useState(1)
  const [total,  setTotal]  = useState(0)
  const [loading, setLoading] = useState(false)

  const loadMore = useCallback(async () => {
    if (loading) return
    if (total && platos.length >= total) return

    setLoading(true)
    try {
      const res  = await fetch(
        `/api/admin/platos/stream?page=${page}&take=${initialTake}`
      )
      if (!res.ok) throw new Error(`${res.status}`)

      const json = await res.json() as {
        platos: Plato[]
        total: number
        page: number
        take: number
      }

      setPlatos(prev => [...prev, ...json.platos])
      setTotal(json.total)
      setPage(p => p + 1)

    } catch (err) {
      console.error('Error cargando más platos', err)
    } finally {
      setLoading(false)
    }
  }, [page, total, loading, initialTake, platos.length])

  // Carga la primera página al montar
  useEffect(() => {
    if (platos.length === 0) loadMore()
  }, [loadMore, platos.length])

  return {
    platos,
    isLoading: loading,
    isReachingEnd: total > 0 && platos.length >= total,
    loadMore,
  }
}
