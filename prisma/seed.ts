// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Crear categoría
  const categoriaEntradas = await prisma.categoria.create({
    data: { nombre: "Entradas" }
  });

  // 2. Crear subcategoría asociada
  const subcategoriaFrituras = await prisma.subcategoria.create({
    data: {
      nombre: "Frituras",
      categoriaId: categoriaEntradas.id
    }
  });

  // 3. Crear platos
  await prisma.plato.createMany({
    data: [
      {
        nombre: "Tostones",
        precio: 4.99,
        subcategoriaId: subcategoriaFrituras.id
      },
      {
        nombre: "Yuca con Mojo",
        precio: 5.50,
        subcategoriaId: subcategoriaFrituras.id
      }
    ]
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())