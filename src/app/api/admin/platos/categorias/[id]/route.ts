// src/app/api/admin/categorias/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'   // o de donde tengas tu util de JWT

// 1) Helper guard (puedes extraerlo a lib/guards.ts)
async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : req.cookies.get('auth-token')?.value

  if (!token) throw new Error('No autorizado')
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
    // Protección: solo admins
    await requireAdmin(request)

    const id = Number(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const { nombre } = await request.json()
    if (!nombre?.trim()) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
    }

    const updated = await prisma.categoria.update({
      where: { id },
      data: { nombre: nombre.trim() },
    })
    return NextResponse.json(updated, { status: 200 })

  } catch (err: any) {
    const msg    = err.message
    const status = msg === 'No autorizado' || msg === 'Token inválido'
      ? 401
      : 500
    return NextResponse.json({ error: msg }, { status })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Protección: solo admins
    await requireAdmin(request)

    const id = Number(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const deleted = await prisma.categoria.delete({ where: { id } })
    return NextResponse.json(deleted, { status: 200 })

  } catch (err: any) {
    const msg    = err.message
    const status = msg === 'No autorizado' || msg === 'Token inválido'
      ? 401
      : 500
    return NextResponse.json({ error: msg }, { status })
  }
}
