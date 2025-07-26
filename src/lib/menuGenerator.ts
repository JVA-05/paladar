// src/lib/menuGenerator.ts
import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

export async function regenerateMenuJson() {
  // 1) Trae TODO el menú según tu schema.prisma
  const categorias = await prisma.categoria.findMany({
    include: {
      subcategorias: {
        include: { platos: true }
      },
      platos: true
    }
  })

  // 2) Serializa y sobreescribe public/menu.json
  const outFile = path.join(process.cwd(), 'public', 'menu.json')
  await fs.writeFile(outFile, JSON.stringify(categorias))

  // 3) Cierra conexión
  await prisma.$disconnect()
}
