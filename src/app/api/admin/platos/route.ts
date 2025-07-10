import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// deshabilitamos JSON bodyParser para formData()
export const config = { api: { bodyParser: false } }

// GET /api/admin/platos
export async function GET() {
  const platos = await prisma.plato.findMany({
    include: { subcategoria: true, categoria: true },
  })
  return NextResponse.json({ platos })
}

// POST /api/admin/platos
export async function POST(request: Request) {
  const form = await request.formData()
  const nombre   = form.get('nombre')?.toString().trim()   || ''
  const precio   = Number(form.get('precio')?.toString()   || '0')
  const descr    = form.get('descripcion')?.toString()     || null
  const subRaw   = form.get('subcategoriaId')?.toString()  || ''
  const catRaw   = form.get('categoriaId')?.toString()     || ''
  const file     = form.get('imagen')

  if ((subRaw && catRaw) || (!subRaw && !catRaw)) {
    return NextResponse.json(
      { error: 'Elige subcategoriaId o categoriaId, no ambos.' },
      { status: 400 }
    )
  }
  if (!nombre || precio <= 0) {
    return NextResponse.json({ error: 'Nombre/precio inválidos.' }, { status: 400 })
  }

  // Subir imagen si existe
  let imagen: string | null = null
  if (file instanceof File) {
    const buf = Buffer.from(await file.arrayBuffer())
    const upload: any = await new Promise((res, rej) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'paladar/platos' },
        (err, result) => err ? rej(err) : res(result)
      )
      stream.end(buf)
    })
    imagen = upload.secure_url
  }

  // Crear con fk directas
  const data: any = {
    nombre,
    precio,
    descripcion: descr,
    ...(imagen && { imagen }),
    ...(subRaw && { subcategoriaId: Number(subRaw) }),
    ...(catRaw && { categoriaId: Number(catRaw) }),
  }

  const nuevo = await prisma.plato.create({ data })
  return NextResponse.json(nuevo, { status: 201 })
}
