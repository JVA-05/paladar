// scripts/generateMenu.js
import 'dotenv/config'                 // <- Carga variables de .env
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

async function main() {
  const prisma = new PrismaClient()    // Usa process.env.DATABASE_URL

  const categorias = await prisma.categoria.findMany({
    include: {
      subcategorias: {
        include: { platos: true }
      },
      platos: true
    }
  })

  const outfile = path.resolve(process.cwd(), 'public/menu.json')
  fs.writeFileSync(outfile, JSON.stringify(categorias))
  await prisma.$disconnect()
  console.log(`✅ menu.json generado (${categorias.length} categorías)`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
