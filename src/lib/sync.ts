import { prisma } from "./db";
import { fetchXbzProdutos, type XbzProduto } from "./xbz";
import { categorizar } from "./categorize";

export interface SyncResult {
  totalFetched: number;
  totalCreated: number;
  totalUpdated: number;
  totalDeactivated: number;
}

/**
 * Sincroniza o catálogo local com a XBZ.
 *
 * Estratégia: uma única chamada a /ProdutosListar sem `busca` (deve trazer o
 * catálogo completo, a confirmar no primeiro dry run real — ver README).
 * Produtos que já existem no banco mas não vieram nesta sincronização são
 * marcados como `ativo: false` (não deletados, pra manter histórico de
 * orçamentos antigos íntegro).
 */
export async function sincronizarProdutosXbz(): Promise<SyncResult> {
  const log = await prisma.syncLog.create({
    data: { status: "running" },
  });

  try {
    const produtos: XbzProduto[] = await fetchXbzProdutos();

    let totalCreated = 0;
    let totalUpdated = 0;

    const idsVistos: number[] = [];

    for (const produto of produtos) {
      idsVistos.push(produto.id);

      const dados = {
        xbzId: produto.id,
        codigoXbz: produto.codigoXbz,
        codigoComposto: produto.codigoComposto,
        codigoAmigavel: produto.codigoAmigavel,
        nome: produto.nome,
        descricao: produto.descricao,
        siteLink: produto.siteLink,
        imageLink: produto.imageLink,
        xbzCadastroData: produto.cadastroData ? new Date(produto.cadastroData) : null,
        categoria: categorizar(`${produto.nome ?? ""} ${produto.descricao}`),
        ativo: true,
        syncedAt: new Date(),
      };

      const resultado = await prisma.product.upsert({
        where: { xbzId: produto.id },
        create: dados,
        update: dados,
      });

      // Prisma não diz diretamente se foi create ou update no upsert,
      // então comparamos createdAt/updatedAt (mesma instrução, primeira
      // gravação tem os dois timestamps praticamente iguais).
      if (resultado.createdAt.getTime() === resultado.updatedAt.getTime()) {
        totalCreated++;
      } else {
        totalUpdated++;
      }
    }

    // Desativa produtos que estavam no banco mas sumiram desta sincronização
    const { count: totalDeactivated } = await prisma.product.updateMany({
      where: {
        ativo: true,
        xbzId: { notIn: idsVistos },
      },
      data: { ativo: false },
    });

    await prisma.syncLog.update({
      where: { id: log.id },
      data: {
        status: "success",
        finishedAt: new Date(),
        totalFetched: produtos.length,
        totalCreated,
        totalUpdated,
        totalDeactivated,
      },
    });

    return { totalFetched: produtos.length, totalCreated, totalUpdated, totalDeactivated };
  } catch (error) {
    await prisma.syncLog.update({
      where: { id: log.id },
      data: {
        status: "error",
        finishedAt: new Date(),
        errorMessage: error instanceof Error ? error.message : String(error),
      },
    });
    throw error;
  }
}
