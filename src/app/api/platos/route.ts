import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();

    // Verificar si el plato existe antes de actualizar
    const existingPlato = await prisma!.plato.findUnique({
      where: { id: Number(params.id) }
    });

    if (!existingPlato) {
      return NextResponse.json({ error: "Plato no encontrado" }, { status: 404 });
    }

    // Actualizar el plato
    const platoActualizado = await prisma!.plato.update({
      where: { id: Number(params.id) },
      data
    });

    return NextResponse.json(platoActualizado);

  } catch (error) {
    console.error("Error en actualización:", error);
    return NextResponse.json({ error: "Error en la base de datos" }, { status: 500 });
  }
}
