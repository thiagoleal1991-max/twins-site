-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "xbzId" INTEGER NOT NULL,
    "codigoXbz" TEXT NOT NULL,
    "codigoComposto" TEXT,
    "codigoAmigavel" TEXT,
    "descricao" TEXT NOT NULL,
    "siteLink" TEXT,
    "imageLink" TEXT,
    "xbzCadastroData" TIMESTAMP(3),
    "categoria" TEXT NOT NULL DEFAULT 'Outros',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteRequest" (
    "id" SERIAL NOT NULL,
    "empresa" TEXT NOT NULL,
    "contatoNome" TEXT NOT NULL,
    "contatoFone" TEXT NOT NULL,
    "contatoEmail" TEXT,
    "observacoes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'novo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteRequestItem" (
    "id" SERIAL NOT NULL,
    "quoteRequestId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "QuoteRequestItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" SERIAL NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "totalFetched" INTEGER,
    "totalCreated" INTEGER,
    "totalUpdated" INTEGER,
    "totalDeactivated" INTEGER,
    "errorMessage" TEXT,

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_xbzId_key" ON "Product"("xbzId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_codigoXbz_key" ON "Product"("codigoXbz");

-- CreateIndex
CREATE INDEX "Product_categoria_idx" ON "Product"("categoria");

-- CreateIndex
CREATE INDEX "Product_ativo_idx" ON "Product"("ativo");

-- AddForeignKey
ALTER TABLE "QuoteRequestItem" ADD CONSTRAINT "QuoteRequestItem_quoteRequestId_fkey" FOREIGN KEY ("quoteRequestId") REFERENCES "QuoteRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteRequestItem" ADD CONSTRAINT "QuoteRequestItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
