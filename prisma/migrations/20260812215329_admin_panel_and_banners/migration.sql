-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "categoriaManual" TEXT,
ADD COLUMN     "destaque" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maisVendido" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ocultoManualmente" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Banner" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tamanho" TEXT NOT NULL DEFAULT 'grande',
    "href" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Banner_ativo_ordem_idx" ON "Banner"("ativo", "ordem");

-- CreateIndex
CREATE INDEX "Product_destaque_idx" ON "Product"("destaque");

-- CreateIndex
CREATE INDEX "Product_maisVendido_idx" ON "Product"("maisVendido");
