// src/app/menu/page.tsx
'use client'

import { useEffect, useState } from 'react'
import type { Categoria } from '@/types'
import Loader from '@/app/components/ui/Loader'
import ErrorMessage from '@/app/components/ui/ErrorMessage'
import MenuClient from '@/app/components/menu/MenuClient'

export default function MenuPageClient() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/menu')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar menú')
        return res.json()
      })
      .then(data => setCategorias(Array.isArray(data) ? data : data.categorias))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} />

  return <MenuClient initialData={categorias} />
}
