// app/api/categorias/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { nombre } = await req.json();
    
    const nuevaCategoria = await prisma.categoria.create({
      data: { nombre }
    });
    
    return NextResponse.json(nuevaCategoria);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating category' },
      { status: 500 }
    );
  }
}