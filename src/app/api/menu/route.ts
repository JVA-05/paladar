// src/app/api/menu/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Devuelve el menú completo (categorías con subcategorías y platos directos)
export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany({
      include: {
        // Incluir los platos directos de la categoría
        platos: true,

        // Incluir subcategorías y sus respectivos platos
        subcategorias: {
          include: { platos: true },
        },
      },
      orderBy: { nombre: 'asc' },
    });

    return NextResponse.json(categorias);
  } catch (error: unknown) {
    let errorMsg = 'Error desconocido';
    if (error instanceof Error) {
      errorMsg = error.message;
      console.error('Error en GET /api/menu:', error);
    }
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

// POST: Crea una nueva subcategoría dentro de una categoría existente
export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.nombre?.trim()) {
      return NextResponse.json(
        { error: 'El nombre de la subcategoría es requerido.' },
        { status: 400 }
      );
    }
    if (!data.categoriaId || isNaN(Number(data.categoriaId))) {
      return NextResponse.json(
        { error: 'La categoría debe existir y ser un número válido.' },
        { status: 400 }
      );
    }

    const cat = await prisma.categoria.findUnique({
      where: { id: Number(data.categoriaId) },
    });
    if (!cat) {
      return NextResponse.json(
        { error: 'La categoría especificada no existe.' },
        { status: 400 }
      );
    }

    await prisma.subcategoria.create({
      data: {
        nombre: data.nombre.trim(),
        categoriaId: Number(data.categoriaId),
      },
    });

    // Devolvemos el menú actualizado, con subcategorías y platos
    const categorias = await prisma.categoria.findMany({
      include: {
        platos: true,
        subcategorias: { include: { platos: true } },
      },
      orderBy: { nombre: 'asc' },
    });
    return NextResponse.json(categorias, { status: 201 });
  } catch (error: unknown) {
    let errorMsg = 'Error desconocido';
    if (error instanceof Error) {
      errorMsg = error.message;
      console.error('Error en POST /api/menu:', error);
    }
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
