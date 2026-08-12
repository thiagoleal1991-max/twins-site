-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_nome_key" ON "Category"("nome");

-- CreateIndex
CREATE INDEX "Category_ordem_idx" ON "Category"("ordem");

-- Seed: mesmas categorias que já existiam fixas no código
-- (src/lib/categorize.ts), agora editáveis pelo /admin/categorias.
INSERT INTO "Category" ("nome", "ordem", "updatedAt") VALUES
  ('Canecas e Garrafas', 1, CURRENT_TIMESTAMP),
  ('Papelaria', 2, CURRENT_TIMESTAMP),
  ('Tecnologia', 3, CURRENT_TIMESTAMP),
  ('Vestuário', 4, CURRENT_TIMESTAMP),
  ('Bolsas e Mochilas', 5, CURRENT_TIMESTAMP),
  ('Chaveiros e Acessórios', 6, CURRENT_TIMESTAMP),
  ('Casa e Escritório', 7, CURRENT_TIMESTAMP),
  ('Brindes para Eventos', 8, CURRENT_TIMESTAMP),
  ('Outros', 9, CURRENT_TIMESTAMP)
ON CONFLICT ("nome") DO NOTHING;
