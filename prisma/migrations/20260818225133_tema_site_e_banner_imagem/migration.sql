/*
  Warnings:

  - You are about to drop the column `descricao` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `tag` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `tamanho` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `titulo` on the `Banner` table. All the data in the column will be lost.
  - Added the required column `imagem` to the `Banner` table without a default value.

*/

-- Banner virou "imagem pura" (sem texto/overlay) — decisão da Twins de
-- substituir por completo o conceito antigo. Qualquer banner de texto já
-- cadastrado não tem como virar imagem sozinho, então limpamos a tabela
-- antes de adicionar a coluna obrigatória "imagem" (senão a migração falha
-- se já existir alguma linha em produção).
DELETE FROM "Banner";

-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "descricao",
DROP COLUMN "tag",
DROP COLUMN "tamanho",
DROP COLUMN "titulo",
ADD COLUMN     "imagem" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "temaSite" TEXT NOT NULL DEFAULT 'escuro',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteConfig_pkey" PRIMARY KEY ("id")
);

-- Seed: garante que sempre existe a linha singleton de configuração —
-- o app lê id=1 direto (ver src/lib/tema.ts). Sem isso, o primeiro
-- carregamento depois do deploy não acharia nenhuma config.
INSERT INTO "SiteConfig" ("id", "temaSite", "updatedAt")
VALUES (1, 'escuro', CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
