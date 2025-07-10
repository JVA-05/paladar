import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    // Validación del contenido (ya no se necesita validar data.id, ya que usamos params.id)
    if (!data.nombre?.trim()) {
      return NextResponse.json(
        { error: "El nombre es requerido" },
        { status: 400 }
      );
    }

    if (!data.subcategoriaId || isNaN(Number(data.subcategoriaId))) {
      return NextResponse.json(
        { error: "Subcategoría inválida" },
        { status: 400 }
      );
    }

    const precio = Number(data.precio);
    if (isNaN(precio) || precio <= 0) {
      return NextResponse.json(
        { error: "Precio debe ser mayor a 0" },
        { status: 400 }
      );
    }

    // Verificar si el plato existe usando params.id
    const existingPlato = await prisma.plato.findUnique({
      where: { id: Number(params.id) }
    });

    if (!existingPlato) {
      return NextResponse.json({ error: "Plato no encontrado" }, { status: 404 });
    }

    // Actualización usando una transacción
    const platoActualizado = await prisma.$transaction(async (tx) => {
      return await tx.plato.update({
        where: { id: Number(params.id) },
        data: {
          nombre: data.nombre.trim(),
          descripcion: data.descripcion?.trim(),
          precio: precio,
          subcategoriaId: Number(data.subcategoriaId)
        }
      });
    });

    return NextResponse.json(platoActualizado);

  } catch (error: any) {
    console.error("Error detallado:", {
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: "Error en la base de datos: " + error.message },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
