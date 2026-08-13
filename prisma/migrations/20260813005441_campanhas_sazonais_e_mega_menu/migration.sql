-- CreateTable
CREATE TABLE "CampanhaSazonal" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "icone" TEXT NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampanhaSazonal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CampanhaSazonalToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CampanhaSazonal_nome_key" ON "CampanhaSazonal"("nome");

-- CreateIndex
CREATE INDEX "CampanhaSazonal_ativa_idx" ON "CampanhaSazonal"("ativa");

-- CreateIndex
CREATE UNIQUE INDEX "_CampanhaSazonalToProduct_AB_unique" ON "_CampanhaSazonalToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_CampanhaSazonalToProduct_B_index" ON "_CampanhaSazonalToProduct"("B");

-- AddForeignKey
ALTER TABLE "_CampanhaSazonalToProduct" ADD CONSTRAINT "_CampanhaSazonalToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "CampanhaSazonal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampanhaSazonalToProduct" ADD CONSTRAINT "_CampanhaSazonalToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
