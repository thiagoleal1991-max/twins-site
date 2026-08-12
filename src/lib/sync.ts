import { Prisma } from "@prisma/client";
import { prisma } from "./db";
import { fetchXbzProdutos, type XbzProduto } from "./xbz";
import { categorizar } from "./categorize";

export interface SyncResult {
  totalFetched: number;
  totalCreated: number;
  totalUpdated: number;
  totalDeactivated: number;
}

// Catálogo real da XBZ tem 16 mil+ produtos (confirmado em teste manual).
// Gravar um por um estourava o limite de tempo da função na Vercel — em
// lotes de 500 via SQL bruto (INSERT ... ON CONFLICT), a sincronização
// inteira roda em segundos em vez de minutos.
const TAMANHO_LOTE = 500;

/**
 * Sincroniza o catálogo local com a XBZ.
 *
 * Estratégia: uma única chamada a /ProdutosListar sem `busca` — confirmado
 * em teste manual que retorna o catálogo completo (16.178 produtos, sem
 * paginação). Produtos que já existem no banco mas não vieram nesta
 * sincronização são marcados como `ativo: false` (não deletados, pra manter
 * histórico de orçamentos antigos íntegro) — comparando o timestamp
 * `syncedAt` em vez de guardar uma lista gigante de IDs em memória.
 */
export async function sincronizarProdutosXbz(): Promise<SyncResult> {
  const log = await prisma.syncLog.create({
    data: { status: "running" },
  });

  const inicioSync = new Date();

  try {
    const produtos: XbzProduto[] = await fetchXbzProdutos();

    let totalCreated = 0;
    let totalUpdated = 0;

    for (let i = 0; i < produtos.length; i += TAMANHO_LOTE) {
      const lote = produtos.slice(i, i + TAMANHO_LOTE);
      const { criados, atualizados } = await upsertLote(lote, inicioSync);
      totalCreated += criados;
      totalUpdated += atualizados;
    }

    // Tudo que não foi tocado nesta sincronização (syncedAt ficou "velho")
    // sumiu do catálogo da XBZ — desativa em vez de deletar.
    const { count: totalDeactivated } = await prisma.product.updateMany({
      where: {
        ativo: true,
        syncedAt: { lt: inicioSync },
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

async function upsertLote(lote: XbzProduto[], syncedAt: Date): Promise<{ criados: number; atualizados: number }> {
  const linhas = lote.map(
    (p) => Prisma.sql`(
      ${p.id},
      ${p.codigoXbz},
      ${p.codigoComposto},
      ${p.codigoAmigavel},
      ${p.nome},
      ${p.descricao},
      ${p.siteLink},
      ${p.imageLink},
      ${p.cadastroData ? new Date(p.cadastroData) : null},
      ${categorizar(`${p.nome ?? ""} ${p.descricao}`)},
      true,
      ${syncedAt},
      now(),
      now()
    )`,
  );

  // O truque "xmax = 0" é como o Postgres deixa a gente saber, depois de um
  // INSERT ... ON CONFLICT, se cada linha foi inserida (nova) ou atualizada
  // (já existia) — sem precisar de uma segunda consulta.
  const resultado = await prisma.$queryRaw<{ inserted: boolean }[]>`
    INSERT INTO "Product" (
      "xbzId", "codigoXbz", "codigoComposto", "codigoAmigavel", "nome", "descricao",
      "siteLink", "imageLink", "xbzCadastroData", "categoria", "ativo", "syncedAt",
      "createdAt", "updatedAt"
    )
    VALUES ${Prisma.join(linhas)}
    ON CONFLICT ("xbzId") DO UPDATE SET
      "codigoXbz" = EXCLUDED."codigoXbz",
      "codigoComposto" = EXCLUDED."codigoComposto",
      "codigoAmigavel" = EXCLUDED."codigoAmigavel",
      "nome" = EXCLUDED."nome",
      "descricao" = EXCLUDED."descricao",
      "siteLink" = EXCLUDED."siteLink",
      "imageLink" = EXCLUDED."imageLink",
      "xbzCadastroData" = EXCLUDED."xbzCadastroData",
      "categoria" = EXCLUDED."categoria",
      "ativo" = true,
      "syncedAt" = EXCLUDED."syncedAt",
      "updatedAt" = now()
    RETURNING (xmax = 0) AS inserted
  `;

  const criados = resultado.filter((r) => r.inserted).length;
  return { criados, atualizados: resultado.length - criados };
}
