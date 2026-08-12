import { prisma } from "./db";
import type { Prisma } from "@prisma/client";

const PAGE_SIZE_PADRAO = 24;
const PAGE_SIZE_MAXIMO = 60;

export interface ListarProdutosParams {
  busca?: string;
  categoria?: string;
  page?: number;
  pageSize?: number;
}

export interface ListarProdutosResultado {
  produtos: Awaited<ReturnType<typeof prisma.product.findMany>>;
  totalItens: number;
  totalPaginas: number;
  paginaAtual: number;
}

export async function listarProdutos(params: ListarProdutosParams): Promise<ListarProdutosResultado> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(PAGE_SIZE_MAXIMO, Math.max(1, params.pageSize ?? PAGE_SIZE_PADRAO));

  const where: Prisma.ProductWhereInput = {
    ativo: true,
    ...(params.categoria ? { categoria: params.categoria } : {}),
    ...(params.busca
      ? {
          descricao: {
            contains: params.busca,
            mode: "insensitive" as const,
          },
        }
      : {}),
  };

  const [produtos, totalItens] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { descricao: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    produtos,
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

export async function listarCategoriasComContagem() {
  const grupos = await prisma.product.groupBy({
    by: ["categoria"],
    where: { ativo: true },
    _count: { _all: true },
    orderBy: { categoria: "asc" },
  });

  return grupos.map((g) => ({ categoria: g.categoria, total: g._count._all }));
}
