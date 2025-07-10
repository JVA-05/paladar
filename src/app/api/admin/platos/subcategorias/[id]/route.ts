// app/api/admin/subcategorias/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'   // ó donde tengas tu función de verificación

// Helper guard para admin
async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : req.cookies.get('auth-token')?.value

  if (!token) {
    throw new Error('No autorizado')
  }
  try {
    verifyToken(token)
  } catch {
    throw new Error('Token inválido')
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1) Protección sólo admins
    await requireAdmin(request)

    // 2) Validar ID
    const id = Number(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    // 3) Leer body y validaciones
    const body = await request.json()
    const { nombre, categoriaId } = body

    if (!nombre?.trim()) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
    }
    if (categoriaId == null || isNaN(Number(categoriaId))) {
      return NextResponse.json({ error: 'categoriaId inválido' }, { status: 400 })
    }

    // 4) Actualizar en BD
    const updated = await prisma.subcategoria.update({
      where: { id },
      data: {
        nombre: nombre.trim(),
        categoriaId: Number(categoriaId),
      },
    })
    return NextResponse.json(updated, { status: 200 })

  } catch (err: any) {
    // 5) Manejo de errores
    const msg    = err.message
    const status = msg === 'No autorizado' || msg === 'Token inválido' ? 401 : 500
    return NextResponse.json({ error: msg }, { status })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1) Protección sólo admins
    await requireAdmin(request)

    // 2) Validar ID
    const id = Number(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    // 3) Eliminar en BD
    const deleted = await prisma.subcategoria.delete({ where: { id } })
    return NextResponse.json(deleted, { status: 200 })

  } catch (err: any) {
    // 4) Manejo de errores
    const msg    = err.message
    const status = msg === 'No autorizado' || msg === 'Token inválido' ? 401 : 500
    return NextResponse.json({ error: msg }, { status })
  }
}
