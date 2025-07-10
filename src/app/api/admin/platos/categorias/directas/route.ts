import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // find categories that have no subcategorias
    const categorias = await prisma.categoria.findMany({
      where: { subcategorias: { none: {} } },
      select: { id: true, nombre: true },
      orderBy: { nombre: "asc" },
    });
    return NextResponse.json({ categorias }, { status: 200 });
  } catch (error: any) {
    console.error("Error al obtener categorías directas:", error);
    return NextResponse.json(
      { error: "Error al obtener categorías directas" },
      { status: 500 }
    );
  }
}
