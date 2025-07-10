// app/api/admin/platos/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'
import { verifyToken } from '@/lib/auth'

export const runtime = 'nodejs'

cloudinary.config({
  cloud_name:    process.env.CLOUDINARY_CLOUD_NAME,
  api_key:       process.env.CLOUDINARY_API_KEY,
  api_secret:    process.env.CLOUDINARY_API_SECRET,
})

async function requireAdmin(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? ''
  const token = auth.startsWith('Bearer ')
    ? auth.slice(7)
    : req.cookies.get('auth-token')?.value

  if (!token) {
    throw new NextResponse('No autorizado', { status: 401 })
  }

  try {
    verifyToken(token)
  } catch {
    throw new NextResponse('Token inválido', { status: 401 })
  }
}

/**
 * PUT /api/admin/platos/:id
 */
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  await requireAdmin(request)

  const id = Number(context.params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  const form = await request.formData()
  const nombreRaw = form.get('nombre')?.toString().trim() || ''
  const precioRaw = form.get('precio')?.toString().trim()  || ''
  const descrRaw  = form.get('descripcion')?.toString().trim() || null
  const subRaw    = form.get('subcategoriaId')?.toString().trim() || ''
  const catRaw    = form.get('categoriaId')?.toString().trim()    || ''
  const file      = form.get('imagen')

  const precio = Number(precioRaw)
  if (!nombreRaw || isNaN(precio) || precio <= 0) {
    return NextResponse.json(
      { error: 'Nombre y precio son obligatorios y deben ser válidos.' },
      { status: 400 }
    )
  }

  if ((subRaw && catRaw) || (!subRaw && !catRaw)) {
    return NextResponse.json(
      { error: 'Debes elegir o subcategoriaId o categoriaId, no ambos.' },
      { status: 400 }
    )
  }

  // Subida opcional de imagen
  let imagenUrl: string | null = null
  if (file instanceof File) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const uploadResult: any = await new Promise((res, rej) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder:    'paladar/platos',
          public_id: `plato_${id}`,
          overwrite: true,
        },
        (err, result) => (err ? rej(err) : res(result))
      )
      stream.end(buffer)
    })
    imagenUrl = uploadResult.secure_url
  }

  // Construir objeto de actualización
  const updateData: Record<string, any> = {
    nombre:      nombreRaw,
    precio,
    descripcion: descrRaw,
    subcategoriaId: subRaw ? Number(subRaw) : null,
    categoriaId:    catRaw ? Number(catRaw) : null,
    ...(imagenUrl && { imagen: imagenUrl }),
  }

  const updatedPlato = await prisma.plato.update({
    where: { id },
    data:  updateData,
  })

  return NextResponse.json(updatedPlato)
}

/**
 * DELETE /api/admin/platos/:id
 */
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  await requireAdmin(request)

  const id = Number(context.params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  await prisma.plato.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
