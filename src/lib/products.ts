import { prisma } from "./db";
import { Prisma } from "@prisma/client";

const PAGE_SIZE_PADRAO = 24;
const PAGE_SIZE_MAXIMO = 60;

/**
 * Código "humano" do produto, o mesmo que aparece no site da XBZ (ex:
 * xbzbrindes.com.br/06520) e que a Twins usa pra comprar/pesquisar —
 * diferente do `codigoXbz` (ID interno tipo "X000019", só usado por nós
 * pra identificar a linha no banco/rota, sem relação com o código real).
 */
export function codigoExibicao(produto: {
  codigoAmigavel: string | null;
  codigoComposto: string | null;
  codigoXbz: string;
}): string {
  return produto.codigoAmigavel || produto.codigoComposto || produto.codigoXbz;
}

export type OrdenacaoProdutos = "recentes" | "nome" | "categoria";
export type Vitrine = "destaques" | "mais-vendidos";

export interface ListarProdutosParams {
  busca?: string;
  categoria?: string;
  vitrine?: Vitrine;
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

// A categoria "efetiva" é a manual (definida no /admin), quando existir —
// senão cai pra classificação automática por palavra-chave da sincronização.
const CATEGORIA_EFETIVA_SQL = Prisma.sql`COALESCE(NULLIF(trim("categoriaManual"), ''), "categoria")`;

const ORDER_SQL: Record<OrdenacaoProdutos, Prisma.Sql> = {
  recentes: Prisma.sql`"syncedAt" DESC`,
  nome: Prisma.sql`"nome" ASC`,
  categoria: Prisma.sql`categoria ASC, "nome" ASC`,
};

/**
 * Lista o catálogo já agrupado por família de produto (mesmo "codigoAmigavel"
 * = mesmo item em cores diferentes) — mostra 1 card por família em vez de um
 * card por variação de cor. Exige nome + foto (produtos incompletos ficam no
 * banco mas não aparecem aqui) e respeita ocultação manual feita no /admin.
 */
export async function listarProdutos(params: ListarProdutosParams): Promise<ListarProdutosResultado> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(PAGE_SIZE_MAXIMO, Math.max(1, params.pageSize ?? PAGE_SIZE_PADRAO));
  const offset = (page - 1) * pageSize;

  const filtros = Prisma.sql`
    "ativo" = true
    AND "ocultoManualmente" = false
    AND "nome" IS NOT NULL AND trim("nome") != ''
    AND "imageLink" IS NOT NULL AND trim("imageLink") != ''
    ${params.categoria ? Prisma.sql`AND ${CATEGORIA_EFETIVA_SQL} = ${params.categoria}` : Prisma.empty}
    ${params.vitrine === "destaques" ? Prisma.sql`AND "destaque" = true` : Prisma.empty}
    ${params.vitrine === "mais-vendidos" ? Prisma.sql`AND "maisVendido" = true` : Prisma.empty}
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
          "descricao", "siteLink", "imageLink",
          ${CATEGORIA_EFETIVA_SQL} AS categoria,
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
  const produto = await prisma.product.findFirst({
    where: { codigoXbz, ativo: true, ocultoManualmente: false },
  });
  if (!produto) return null;

  return {
    ...produto,
    categoria: produto.categoriaManual?.trim() || produto.categoria,
  };
}

/**
 * Todas as variações (cores) da mesma família de produto — usado na página
 * de detalhe pra montar o seletor de cor.
 */
export async function listarVariantes(codigoAmigavel: string | null) {
  if (!codigoAmigavel) return [];
  return prisma.product.findMany({
    where: { codigoAmigavel, ativo: true, ocultoManualmente: false },
    orderBy: { codigoComposto: "asc" },
  });
}

// =====================================================================
// Painel administrativo (/admin) — aqui SIM aparecem produtos incompletos
// e ocultos, porque é justamente onde a equipe vai revisar/corrigir isso.
// =====================================================================

export interface ListarProdutosAdminParams {
  busca?: string;
  apenasIncompletos?: boolean;
  apenasCompletos?: boolean;
  apenasOcultos?: boolean;
  page?: number;
  pageSize?: number;
}

export interface ProdutoAdminListado {
  id: number;
  xbzId: number;
  codigoXbz: string;
  codigoComposto: string | null;
  codigoAmigavel: string | null;
  nome: string | null;
  descricao: string;
  imageLink: string | null;
  categoria: string;
  categoriaManual: string | null;
  ocultoManualmente: boolean;
  destaque: boolean;
  maisVendido: boolean;
  variantes: number;
}

interface ProdutoAdminListadoRaw extends Omit<ProdutoAdminListado, "variantes"> {
  variantes: bigint;
}

// Mesma ideia do catálogo público: 1 linha por família de produto (cores
// agrupadas), pra não poluir a lista com vários itens idênticos. Ao
// escolher o representante de cada família, prioriza um que já esteja
// completo (nome + foto), pra não esconder um item OK atrás de uma
// variação de cor incompleta.
const REPRESENTANTE_COMPLETO_SQL = Prisma.sql`
  ("nome" IS NOT NULL AND trim("nome") != '' AND "imageLink" IS NOT NULL AND trim("imageLink") != '')
`;

export async function listarProdutosAdmin(params: ListarProdutosAdminParams) {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 50));
  const offset = (page - 1) * pageSize;

  const filtroBusca = params.busca
    ? Prisma.sql`AND (
        "nome" ILIKE ${"%" + params.busca + "%"}
        OR "descricao" ILIKE ${"%" + params.busca + "%"}
        OR "codigoXbz" ILIKE ${"%" + params.busca + "%"}
        OR "codigoAmigavel" ILIKE ${"%" + params.busca + "%"}
      )`
    : Prisma.empty;

  const filtroPosGrupo = Prisma.sql`
    1=1
    ${params.apenasCompletos ? Prisma.sql`AND ${REPRESENTANTE_COMPLETO_SQL}` : Prisma.empty}
    ${params.apenasIncompletos ? Prisma.sql`AND NOT ${REPRESENTANTE_COMPLETO_SQL}` : Prisma.empty}
    ${params.apenasOcultos ? Prisma.sql`AND "ocultoManualmente" = true` : Prisma.empty}
  `;

  const [produtosRaw, totalRows] = await Promise.all([
    prisma.$queryRaw<ProdutoAdminListadoRaw[]>`
      SELECT * FROM (
        SELECT DISTINCT ON (COALESCE("codigoAmigavel", "codigoXbz"))
          "id", "xbzId", "codigoXbz", "codigoComposto", "codigoAmigavel", "nome",
          "descricao", "imageLink", "categoria", "categoriaManual", "ocultoManualmente",
          "destaque", "maisVendido",
          COUNT(*) OVER (PARTITION BY COALESCE("codigoAmigavel", "codigoXbz")) AS variantes
        FROM "Product"
        WHERE 1=1 ${filtroBusca}
        ORDER BY COALESCE("codigoAmigavel", "codigoXbz"), ${REPRESENTANTE_COMPLETO_SQL} DESC, "id" ASC
      ) AS familias
      WHERE ${filtroPosGrupo}
      ORDER BY "nome" ASC NULLS LAST, "id" ASC
      LIMIT ${pageSize} OFFSET ${offset}
    `,
    prisma.$queryRaw<{ total: bigint }[]>`
      SELECT COUNT(*) AS total FROM (
        SELECT DISTINCT ON (COALESCE("codigoAmigavel", "codigoXbz"))
          "nome", "imageLink", "ocultoManualmente"
        FROM "Product"
        WHERE 1=1 ${filtroBusca}
        ORDER BY COALESCE("codigoAmigavel", "codigoXbz"), ${REPRESENTANTE_COMPLETO_SQL} DESC, "id" ASC
      ) AS familias
      WHERE ${filtroPosGrupo}
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

/** IDs de todas as variações (cores) da mesma família — usado pelas Server
 * Actions do /admin pra aplicar uma mudança (categoria, ocultar, destaque)
 * na família inteira de uma vez, não só na variação que aparece na lista. */
export async function idsDaFamilia(produtoId: number): Promise<number[]> {
  const produto = await prisma.product.findUnique({
    where: { id: produtoId },
    select: { codigoAmigavel: true },
  });
  if (!produto?.codigoAmigavel) return [produtoId];

  const variantes = await prisma.product.findMany({
    where: { codigoAmigavel: produto.codigoAmigavel },
    select: { id: true },
  });
  return variantes.map((v) => v.id);
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
