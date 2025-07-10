// src/app/api/admin/platos/categorias/route.ts
import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

// GET: devuelve todas las categorías
export async function GET(request: NextRequest) {
  try {
    const categorias = await prisma.categoria.findMany({
      select: { id: true, nombre: true },
      orderBy: { nombre: 'asc' },
    })
    return NextResponse.json({ categorias }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al obtener categorías: ' + error.message },
      { status: 500 }
    )
  }
}

// POST: crea una nueva categoría
export async function POST(request: Request) {
  try {
    const data = await request.json()
    if (!data.nombre?.trim()) {
      return NextResponse.json(
        { error: 'El nombre de la categoría es requerido.' },
        { status: 400 }
      )
    }
    const nuevaCategoria = await prisma.categoria.create({
      data: { nombre: data.nombre.trim() }
    })
    return NextResponse.json(nuevaCategoria, { status: 201 })
  } catch (error: any) {
    console.error('Error en POST /api/admin/platos/categorias:', error)
    return NextResponse.json(
      { error: error.message || 'Error desconocido' },
      { status: 500 }
    )
  }
}
