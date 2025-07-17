import { headers } from 'next/headers'
import MenuClient from '@/app/components/menu/MenuClient'
import type { Categoria } from '@/types'

// Fuerza SSR dinámico: no se prerenderiza en build
export const dynamic = 'force-dynamic'

export default async function MenuPage() {
  // 1. Obtén host y protocolo de los headers
  const hdr = headers()
  const host = hdr.get('x-forwarded-host') || hdr.get('host') || 'localhost:3000'
  const proto = hdr.get('x-forwarded-proto') || 'http'
  const baseUrl = `${proto}://${host}`

  // 2. Llama a tu API con URL absoluta en runtime
  const res = await fetch(`${baseUrl}/api/menu`, {
    cache: 'no-store'   // siempre fresco, cada petición fetchea datos
  })
  if (!res.ok) {
    // si algo falla, lanza y que tu Error Boundary lo capture
    throw new Error('Error al cargar el menú')
  }

  // 3. Parseo y envío al Client Component
  const categorias: Categoria[] = await res.json()
  return <MenuClient initialData={categorias} />
}
