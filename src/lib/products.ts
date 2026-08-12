import { prisma } from "./db";
import { Prisma } from "@prisma/client";

const PAGE_SIZE_PADRAO = 24;
const PAGE_SIZE_MAXIMO = 60;

export type OrdenacaoProdutos = "recentes" | "nome" | "categoria";

export interface ListarProdutosParams {
  busca?: string;
  categoria?: string;
  page?: number;
  pageSize?: number;
  sort?: OrdenacaoProdutos;
}

export interface ProdutoListado {
  id: number;
  xbzId: number;
  codigoXbz: string;
  codigoComposto: string | null;
  codigoAmigavel: string | null;
  nome: string | null;
  descricao: string;
  siteLink: string | null;
  imageLink: string | null;
  categoria: string;
  /** Quantas variações (normalmente de cor) essa mesma família de produto tem. */
  variantes: number;
}

interface ProdutoListadoRaw extends Omit<ProdutoListado, "variantes"> {
  variantes: bigint;
}

export interface ListarProdutosResultado {
  produtos: ProdutoListado[];
  totalItens: number;
  totalPaginas: number;
  paginaAtual: number;
}

const ORDER_SQL: Record<OrdenacaoProdutos, Prisma.Sql> = {
  recentes: Prisma.sql`"syncedAt" DESC`,
  nome: Prisma.sql`"nome" ASC`,
  categoria: Prisma.sql`"categoria" ASC, "nome" ASC`,
};

/**
 * Lista o catálogo já agrupado por família de produto (mesmo "codigoAmigavel"
 * = mesmo item em cores diferentes) — mostra 1 card por família em vez de um
 * card por variação de cor. Também exige nome + foto: produtos incompletos
 * (só SKU, sem imagem) ficam no banco mas não aparecem no catálogo público.
 */
export async function listarProdutos(params: ListarProdutosParams): Promise<ListarProdutosResultado> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(PAGE_SIZE_MAXIMO, Math.max(1, params.pageSize ?? PAGE_SIZE_PADRAO));
  const offset = (page - 1) * pageSize;

  const filtros = Prisma.sql`
    "ativo" = true
    AND "nome" IS NOT NULL
    AND "imageLink" IS NOT NULL
    ${params.categoria ? Prisma.sql`AND "categoria" = ${params.categoria}` : Prisma.empty}
    ${
      params.busca
        ? Prisma.sql`AND ("nome" ILIKE ${"%" + params.busca + "%"} OR "descricao" ILIKE ${"%" + params.busca + "%"})`
        : Prisma.empty
    }
  `;

  const ordenacao = ORDER_SQL[params.sort ?? "nome"];

  const [produtosRaw, totalRows] = await Promise.all([
    prisma.$queryRaw<ProdutoListadoRaw[]>`
      SELECT * FROM (
        SELECT DISTINCT ON (COALESCE("codigoAmigavel", "codigoXbz"))
          "id", "xbzId", "codigoXbz", "codigoComposto", "codigoAmigavel", "nome",
          "descricao", "siteLink", "imageLink", "categoria",
          COUNT(*) OVER (PARTITION BY COALESCE("codigoAmigavel", "codigoXbz")) AS variantes
        FROM "Product"
        WHERE ${filtros}
        ORDER BY COALESCE("codigoAmigavel", "codigoXbz"), "id" ASC
      ) AS familias
      ORDER BY ${ordenacao}
      LIMIT ${pageSize} OFFSET ${offset}
    `,
    prisma.$queryRaw<{ total: bigint }[]>`
      SELECT COUNT(DISTINCT COALESCE("codigoAmigavel", "codigoXbz")) AS total
      FROM "Product"
      WHERE ${filtros}
    `,
  ]);

  const totalItens = Number(totalRows[0]?.total ?? 0);

  return {
    produtos: produtosRaw.map((p) => ({ ...p, variantes: Number(p.variantes) })),
    totalItens,
    totalPaginas: Math.max(1, Math.ceil(totalItens / pageSize)),
    paginaAtual: page,
  };
}

export async function buscarProdutoPorCodigo(codigoXbz: string) {
  return prisma.product.findFirst({
    where: { codigoXbz, ativo: true },
  });
}

/**
 * Todas as variações (cores) da mesma família de produto — usado na página
 * de detalhe pra montar o seletor de cor.
 */
export async function listarVariantes(codigoAmigavel: string | null) {
  if (!codigoAmigavel) return [];
  return prisma.product.findMany({
    where: { codigoAmigavel, ativo: true },
    orderBy: { codigoComposto: "asc" },
  });
}

export async function listarCategoriasComContagem() {
  const grupos = await prisma.product.groupBy({
    by: ["categoria"],
    where: { ativo: true, nome: { not: null }, imageLink: { not: null } },
    _count: { _all: true },
    orderBy: { categoria: "asc" },
  });

  return grupos.map((g) => ({ categoria: g.categoria, total: g._count._all }));
}
