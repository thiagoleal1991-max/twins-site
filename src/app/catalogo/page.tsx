import Link from "next/link";
import { listarProdutos } from "@/lib/products";
import { listarCategorias } from "@/lib/categorize";

export const dynamic = "force-dynamic";

interface CatalogoPageProps {
  searchParams: { busca?: string; categoria?: string; page?: string };
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const page = searchParams.page ? Number(searchParams.page) : 1;

  const { produtos, totalItens, totalPaginas, paginaAtual } = await listarProdutos({
    busca: searchParams.busca,
    categoria: searchParams.categoria,
    page,
  });

  const categorias = listarCategorias();

  function buildLink(overrides: Partial<{ busca: string; categoria: string; page: number }>) {
    const params = new URLSearchParams();
    const busca = overrides.busca ?? searchParams.busca;
    const categoria = overrides.categoria ?? searchParams.categoria;
    const pageParam = overrides.page ?? paginaAtual;

    if (busca) params.set("busca", busca);
    if (categoria) params.set("categoria", categoria);
    if (pageParam && pageParam !== 1) params.set("page", String(pageParam));

    const qs = params.toString();
    return qs ? `/catalogo?${qs}` : "/catalogo";
  }

  return (
    <main className="container">
      <span className="badge-dev">🚧 Layout provisório — só pra validar busca/categoria/paginação</span>
      <h1>Catálogo</h1>
      <p>{totalItens} produto(s) — sem preço fixo, modelo de orçamento sob consulta.</p>

      <form className="filtros" action="/catalogo" method="get">
        <input type="text" name="busca" placeholder="Buscar produto..." defaultValue={searchParams.busca ?? ""} />
        <select name="categoria" defaultValue={searchParams.categoria ?? ""}>
          <option value="">Todas as categorias</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button className="btn" type="submit">
          Filtrar
        </button>
      </form>

      {produtos.length === 0 && (
        <p>
          Nenhum produto encontrado. Se o banco ainda não foi sincronizado com a XBZ, rode a
          sincronização primeiro (ver README).
        </p>
      )}

      <div className="grid-produtos">
        {produtos.map((produto) => (
          <Link key={produto.id} href={`/produto/${produto.codigoXbz}`} className="card-produto">
            {produto.imageLink && <img src={produto.imageLink} alt={produto.descricao} loading="lazy" />}
            <span className="categoria">{produto.categoria}</span>
            <h3>{produto.descricao}</h3>
          </Link>
        ))}
      </div>

      <div className="paginacao">
        <Link
          className="btn"
          href={buildLink({ page: paginaAtual - 1 })}
          aria-disabled={paginaAtual <= 1}
          style={paginaAtual <= 1 ? { pointerEvents: "none", opacity: 0.5 } : undefined}
        >
          ← Anterior
        </Link>
        <span>
          Página {paginaAtual} de {totalPaginas}
        </span>
        <Link
          className="btn"
          href={buildLink({ page: paginaAtual + 1 })}
          aria-disabled={paginaAtual >= totalPaginas}
          style={paginaAtual >= totalPaginas ? { pointerEvents: "none", opacity: 0.5 } : undefined}
        >
          Próxima →
        </Link>
      </div>
    </main>
  );
}
