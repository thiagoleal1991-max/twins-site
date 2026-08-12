import Link from "next/link";
import { listarProdutos, type OrdenacaoProdutos } from "@/lib/products";
import { listarCategorias } from "@/lib/categorize";
import { AddToQuoteChip } from "@/components/AddToQuoteChip";
import { QuoteBar } from "@/components/QuoteBar";
import { SortSelect } from "@/components/SortSelect";
import { ProductImage } from "@/components/ProductImage";

export const dynamic = "force-dynamic";

interface CatalogoPageProps {
  searchParams: { busca?: string; categoria?: string; page?: string; sort?: string };
}

const ORDENACOES_VALIDAS: OrdenacaoProdutos[] = ["recentes", "nome", "categoria"];

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const sort = ORDENACOES_VALIDAS.includes(searchParams.sort as OrdenacaoProdutos)
    ? (searchParams.sort as OrdenacaoProdutos)
    : "nome";

  const { produtos, totalItens, totalPaginas, paginaAtual } = await listarProdutos({
    busca: searchParams.busca,
    categoria: searchParams.categoria,
    page,
    sort,
  });

  const categorias = listarCategorias();

  function buildLink(overrides: Partial<{ busca: string; categoria: string; page: number; sort: string }>) {
    const params = new URLSearchParams();
    const busca = "busca" in overrides ? overrides.busca : searchParams.busca;
    const categoria = "categoria" in overrides ? overrides.categoria : searchParams.categoria;
    const pageParam = overrides.page ?? paginaAtual;
    const sortParam = overrides.sort ?? sort;

    if (busca) params.set("busca", busca);
    if (categoria) params.set("categoria", categoria);
    if (pageParam && pageParam !== 1) params.set("page", String(pageParam));
    if (sortParam && sortParam !== "nome") params.set("sort", sortParam);

    const qs = params.toString();
    return qs ? `/catalogo?${qs}` : "/catalogo";
  }

  // Janela de páginas visível na paginação (ex: 1 2 3 … 46), como no protótipo
  const janelaPaginas = new Set<number>([1, totalPaginas, paginaAtual, paginaAtual - 1, paginaAtual + 1]);
  const paginasVisiveis = [...janelaPaginas].filter((p) => p >= 1 && p <= totalPaginas).sort((a, b) => a - b);

  return (
    <>
      <section className="banner-strip dotted">
        <div className="wrap">
          <div className="banner-track">
            <div className="banner">
              <div className="tag">Destaque do mês</div>
              <h3>Kits de onboarding prontos pra encantar novos talentos</h3>
              <p>Curadoria completa com gravação a laser e identidade da sua marca.</p>
            </div>
            <div className="banner small">
              <div className="tag">Fim de ano</div>
              <h3>Reconhecimento & premiação</h3>
              <p>Troféus e medalhas personalizadas.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="toolbar">
        <div className="wrap toolbar-inner">
          <form className="search-box" action="/catalogo" method="get">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B29FCB" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input type="text" name="busca" placeholder="Buscar produto (ex: caneca, mochila, caderno)..." defaultValue={searchParams.busca ?? ""} />
            {searchParams.categoria && <input type="hidden" name="categoria" value={searchParams.categoria} />}
            {sort !== "nome" && <input type="hidden" name="sort" value={sort} />}
          </form>
          <div className="chips">
            <Link href={buildLink({ categoria: undefined, page: 1 })} className={`chip${!searchParams.categoria ? " active" : ""}`}>
              Todos
            </Link>
            {categorias.map((cat) => (
              <Link
                key={cat}
                href={buildLink({ categoria: cat, page: 1 })}
                className={`chip${searchParams.categoria === cat ? " active" : ""}`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="results-head">
          <span>{totalItens.toLocaleString("pt-BR")} produto(s) encontrado(s)</span>
          <SortSelect current={sort} />
        </div>

        {produtos.length === 0 ? (
          <p style={{ color: "var(--cream-dim)", paddingBottom: 60 }}>
            Nenhum produto encontrado{searchParams.busca ? ` para "${searchParams.busca}"` : ""}. Se o catálogo
            ainda não foi sincronizado com a XBZ, isso é esperado — rode a sincronização primeiro.
          </p>
        ) : (
          <div className="product-grid">
            {produtos.map((produto) => (
              <div key={produto.id} className="product-card">
                <Link href={`/produto/${produto.codigoXbz}`}>
                  <div className="product-thumb">
                    <span className="product-cat-badge">{produto.categoria}</span>
                    {produto.imageLink && (
                      <ProductImage src={produto.imageLink} alt={produto.nome ?? produto.descricao} />
                    )}
                  </div>
                </Link>
                <div className="product-body">
                  <Link href={`/produto/${produto.codigoXbz}`}>
                    <h4>{produto.nome ?? produto.descricao}</h4>
                  </Link>
                  <p>{produto.descricao}</p>
                  <div className="product-sku">
                    SKU {produto.codigoXbz}
                    {produto.variantes > 1 && ` · ${produto.variantes} cores`}
                  </div>
                  <div className="product-actions">
                    <AddToQuoteChip
                      productId={produto.id}
                      codigoXbz={produto.codigoXbz}
                      descricao={produto.nome ?? produto.descricao}
                      imageLink={produto.imageLink}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPaginas > 1 && (
          <div className="pagination">
            <Link
              href={buildLink({ page: Math.max(1, paginaAtual - 1) })}
              className={`page-btn${paginaAtual <= 1 ? " disabled" : ""}`}
            >
              ‹
            </Link>
            {paginasVisiveis.map((p, i) => (
              <span key={p} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {i > 0 && p - paginasVisiveis[i - 1] > 1 && <span className="page-btn disabled">…</span>}
                <Link href={buildLink({ page: p })} className={`page-btn${p === paginaAtual ? " active" : ""}`}>
                  {p}
                </Link>
              </span>
            ))}
            <Link
              href={buildLink({ page: Math.min(totalPaginas, paginaAtual + 1) })}
              className={`page-btn${paginaAtual >= totalPaginas ? " disabled" : ""}`}
            >
              ›
            </Link>
          </div>
        )}
      </div>

      <QuoteBar />
    </>
  );
}
