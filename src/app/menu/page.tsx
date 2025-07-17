import MenuClient from '@/app/components/menu/MenuClient'
import type { Categoria } from '@/types'

export const revalidate = 60  // ISR: revalida cada 60s

export default async function MenuPage() {
  // 1. Construcción de la URL base (fallback a localhost)
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    `http://localhost:${process.env.PORT ?? 3000}`

  // 2. Hacemos fetch con URL absoluta
  const res = await fetch(new URL('/api/menu', baseUrl).toString(), {
    next: { revalidate }
  })

  // 3. Manejo de error
  if (!res.ok) {
    throw new Error('Error al cargar el menú')
  }

  // 4. Parseamos la respuesta
  const categorias: Categoria[] = await res.json()

  // 5. Renderizamos el Client Component con los datos
  return <MenuClient initialData={categorias} />
}
