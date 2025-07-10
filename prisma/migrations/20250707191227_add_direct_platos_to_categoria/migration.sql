-- AlterTable
ALTER TABLE "plato" ADD COLUMN     "categoriaId" INTEGER,
ALTER COLUMN "subcategoriaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "plato" ADD CONSTRAINT "plato_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
