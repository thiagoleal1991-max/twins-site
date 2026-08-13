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

// Um produto só aparece no catálogo público se: ativo, não ocultado
// manualmente, e com nome + foto preenchidos (ver listarProdutos() em
// src/lib/products.ts) — mesma condição repetida aqui.
const PUBLICAVEL_SQL = Prisma.sql`(
  "ativo" = true
  AND "ocultoManualmente" = false
  AND "nome" IS NOT NULL AND trim("nome") != ''
  AND "imageLink" IS NOT NULL AND trim("imageLink") != ''
)`;

export interface ContagemCategoria {
  /** Linhas no banco (conta cada variação de cor separada). */
  total: number;
  /** Famílias de produto (cores agrupadas) que realmente aparecem no
   * catálogo público — o que a Twins vê em /catalogo. Costuma ser bem menor
   * que `total`: produtos sem foto/nome, inativos ou ocultados não contam. */
  familiasPublicas: number;
}

export async function contarProdutosPorCategoria(): Promise<Record<string, ContagemCategoria>> {
  const linhas = await prisma.$queryRaw<{ categoria: string; total: bigint; familiasPublicas: bigint }[]>`
    SELECT
      ${CATEGORIA_EFETIVA_SQL} AS categoria,
      COUNT(*) AS total,
      COUNT(DISTINCT CASE WHEN ${PUBLICAVEL_SQL} THEN COALESCE("codigoAmigavel", "codigoXbz") END) AS "familiasPublicas"
    FROM "Product"
    GROUP BY ${CATEGORIA_EFETIVA_SQL}
  `;
  return Object.fromEntries(
    linhas.map((l) => [l.categoria, { total: Number(l.total), familiasPublicas: Number(l.familiasPublicas) }]),
  );
}
