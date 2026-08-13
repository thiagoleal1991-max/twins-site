import { prisma } from "./db";

// Campanhas sazonais/temáticas (ex: "☀️ Verão", "🎗️ Outubro Rosa") — chips
// extras na barra do catálogo, ao lado de Destaques/Mais vendidos. Curadoria
// 100% manual via Prisma Studio por enquanto (marcar `ativa` e relacionar
// produtos), sem UI própria no /admin ainda.

export async function listarCampanhasAtivas() {
  return prisma.campanhaSazonal.findMany({
    where: { ativa: true },
    orderBy: { nome: "asc" },
  });
}
