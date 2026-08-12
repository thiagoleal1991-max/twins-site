// Cliente da API da XBZ Brindes.
// Documentação: XBZ_API__GuiaIntegracao__V001.pdf (anexado ao projeto).
//
// IMPORTANTE:
// - Autenticação é via headers `cnpj` e `token` (não query string).
// - Limite de 24 acessos/dia — COMPARTILHADO com o ERP da Twins. Esse cliente
//   só deve ser chamado pela rotina de sincronização semanal (ver
//   src/app/api/sync/xbz/route.ts), nunca por uma página pública.
// - O endpoint de produtos NÃO retorna preço nem estoque.

export interface XbzProduto {
  id: number;
  codigoXbz: string;
  codigoComposto: string | null;
  codigoAmigavel: string | null;
  descricao: string;
  siteLink: string | null;
  imageLink: string | null;
  cadastroData: string; // ISO date string
}

export class XbzApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "XbzApiError";
  }
}

function getCredentials() {
  const cnpj = process.env.XBZ_CNPJ;
  const token = process.env.XBZ_TOKEN;
  const baseUrl = process.env.XBZ_BASE_URL ?? "https://api.minhaxbz.com.br:5001/api/clientes";

  if (!cnpj || !token) {
    throw new Error(
      "XBZ_CNPJ / XBZ_TOKEN não configurados. Defina-os no .env (local) ou nas " +
        "variáveis de ambiente do projeto na Vercel.",
    );
  }

  return { cnpj, token, baseUrl };
}

/**
 * Busca produtos no catálogo da XBZ.
 *
 * `busca` é opcional — sem ele, a documentação indica que retorna o catálogo
 * completo. Isso ainda não foi validado contra a API real (ver nota no
 * README sobre o "dry run" recomendado antes de ativar o cron em produção).
 */
export async function fetchXbzProdutos(busca?: string): Promise<XbzProduto[]> {
  const { cnpj, token, baseUrl } = getCredentials();

  const url = new URL(`${baseUrl}/ProdutosListar`);
  if (busca) url.searchParams.set("busca", busca);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { cnpj, token },
    // Nunca cachear: cada chamada aqui é "cara" (limite diário compartilhado).
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new XbzApiError(
      `XBZ API respondeu ${res.status} em /ProdutosListar${busca ? `?busca=${busca}` : ""}. ${body}`.trim(),
      res.status,
    );
  }

  const data = (await res.json()) as XbzProduto[];
  return data;
}
