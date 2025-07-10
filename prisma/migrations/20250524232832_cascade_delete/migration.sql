-- DropForeignKey
ALTER TABLE "plato" DROP CONSTRAINT "plato_subcategoriaId_fkey";

-- DropForeignKey
ALTER TABLE "subcategoria" DROP CONSTRAINT "subcategoria_categoriaId_fkey";

-- AddForeignKey
ALTER TABLE "subcategoria" ADD CONSTRAINT "subcategoria_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plato" ADD CONSTRAINT "plato_subcategoriaId_fkey" FOREIGN KEY ("subcategoriaId") REFERENCES "subcategoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
