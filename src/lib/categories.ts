import { prisma } from "./db";
import { Prisma } from "@prisma/client";

export async function listarCategoriasDb() {
  return prisma.category.findMany({ orderBy: { ordem: "asc" } });
}

export async function listarNomesCategorias(): Promise<string[]> {
  const categorias = await listarCategoriasDb();
  return categorias.map((c) => c.nome);
}

// Categoria "efetiva" de um produto — usada em vários lugares (contagem,
// filtros). Mesma expressão usada em listarProdutos()/listarProdutosAdmin().
const CATEGORIA_EFETIVA_SQL = Prisma.sql`COALESCE(NULLIF(trim("categoriaManual"), ''), "categoria")`;

export async function contarProdutosPorCategoria(): Promise<Record<string, number>> {
  const linhas = await prisma.$queryRaw<{ categoria: string; total: bigint }[]>`
    SELECT ${CATEGORIA_EFETIVA_SQL} AS categoria, COUNT(*) AS total
    FROM "Product"
    GROUP BY ${CATEGORIA_EFETIVA_SQL}
  `;
  return Object.fromEntries(linhas.map((l) => [l.categoria, Number(l.total)]));
}
