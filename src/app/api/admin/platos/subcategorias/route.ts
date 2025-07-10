// src/app/api/admin/subcategorias/route.ts
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // 1) Incluimos la relación 'categoria' en la consulta
    const raws = await prisma.subcategoria.findMany({
      select: {
        id: true,
        nombre: true,
        categoriaId: true,
        categoria: {
          select: { nombre: true }
        },
        platos: {
          select: { id: true, nombre: true },
          orderBy: { nombre: "asc" },
        },
      },
      orderBy: { nombre: "asc" },
    });

    // 2) Mapeamos para exponer un campo 'categoriaNombre'
    const subcategorias = raws.map((s) => ({
      id: s.id,
      nombre: s.nombre,
      categoriaId: s.categoriaId,
      categoriaNombre: s.categoria.nombre,
      platos: s.platos,
    }));

    return NextResponse.json({ subcategorias }, { status: 200 });
  } catch (error: any) {
    console.error("Error al obtener subcategorías:", error);
    return NextResponse.json(
      { error: "Error al obtener subcategorías: " + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.nombre?.trim()) {
      return NextResponse.json(
        { error: "El nombre de la subcategoría es requerido." },
        { status: 400 }
      );
    }
    if (!data.categoriaId || isNaN(Number(data.categoriaId))) {
      return NextResponse.json(
        { error: "La categoría es requerida y debe ser numérica." },
        { status: 400 }
      );
    }

    const newSubcategoria = await prisma.subcategoria.create({
      data: {
        nombre: data.nombre.trim(),
        categoriaId: Number(data.categoriaId),
      },
    });

    return NextResponse.json(newSubcategoria, { status: 201 });
  } catch (error: any) {
    console.error("Error creando subcategoría:", error);
    return NextResponse.json(
      { error: "Error creando subcategoría: " + error.message },
      { status: 500 }
    );
  }
}
