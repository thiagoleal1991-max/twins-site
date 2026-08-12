import Link from "next/link";
import { listarProdutosAdmin, codigoExibicao } from "@/lib/products";
import { alternarOculto, alternarDestaque, alternarMaisVendido } from "./actions";
import { ToggleFlag } from "@/components/admin/ToggleFlag";
import { CategoriaSelect } from "@/components/admin/CategoriaSelect";

export const dynamic = "force-dynamic";

interface AdminPageProps {
  searchParams: { busca?: string; incompletos?: string; completos?: string; ocultos?: string; page?: string };
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const page = searchParams.page ? Number(searchParams.page) : 1;

  const { produtos, totalItens, totalPaginas, paginaAtual } = await listarProdutosAdmin({
    busca: searchParams.busca,
    apenasIncompletos: searchParams.incompletos === "1",
    apenasCompletos: searchParams.completos === "1",
    apenasOcultos: searchParams.ocultos === "1",
    page,
  });

  function buildLink(
    overrides: Partial<{
      busca: string | undefined;
      incompletos: string | undefined;
      completos: string | undefined;
      ocultos: string | undefined;
      page: number;
    }>,
  ) {
    const params = new URLSearchParams();
    const busca = "busca" in overrides ? overrides.busca : searchParams.busca;
    const incompletos = "incompletos" in overrides ? overrides.incompletos : searchParams.incompletos;
    const completos = "completos" in overrides ? overrides.completos : searchParams.completos;
    const ocultos = "ocultos" in overrides ? overrides.ocultos : searchParams.ocultos;
    const p = overrides.page ?? paginaAtual;

    if (busca) params.set("busca", busca);
    if (incompletos) params.set("incompletos", incompletos);
    if (completos) params.set("completos", completos);
    if (ocultos) params.set("ocultos", ocultos);
    if (p && p !== 1) params.set("page", String(p));

    const qs = params.toString();
    return qs ? `/admin?${qs}` : "/admin";
  }

  return (
    <main className="wrap" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Produtos</h1>
      <p style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 20 }}>
        {totalItens} produto(s) — já agrupados por cor (cada linha pode ter várias variações)
      </p>

      <form className="filtros" action="/admin" method="get" style={{ marginBottom: 16 }}>
        <input
          type="text"
          name="busca"
          placeholder="Buscar por nome, descrição ou código..."
          defaultValue={searchParams.busca ?? ""}
        />
        <button className="btn" type="submit">
          Buscar
        </button>
      </form>

      <div className="chips" style={{ marginBottom: 24 }}>
        <Link
          href={buildLink({ incompletos: undefined, completos: undefined, ocultos: undefined, page: 1 })}
          className={`chip${!searchParams.incompletos && !searchParams.completos && !searchParams.ocultos ? " active" : ""}`}
        >
          Todos
        </Link>
        <Link
          href={buildLink({ incompletos: undefined, completos: "1", ocultos: undefined, page: 1 })}
          className={`chip${searchParams.completos === "1" ? " active" : ""}`}
        >
          ✓ Completos (com foto e nome)
        </Link>
        <Link
          href={buildLink({ incompletos: "1", completos: undefined, ocultos: undefined, page: 1 })}
          className={`chip${searchParams.incompletos === "1" ? " active" : ""}`}
        >
          ⚠ Incompletos (sem foto/nome)
        </Link>
        <Link
          href={buildLink({ incompletos: undefined, completos: undefined, ocultos: "1", page: 1 })}
          className={`chip${searchParams.ocultos === "1" ? " active" : ""}`}
        >
          Ocultos manualmente
        </Link>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--line)" }}>
              <th style={{ padding: 8 }}>Produto</th>
              <th style={{ padding: 8 }}>Código</th>
              <th style={{ padding: 8 }}>Categoria</th>
              <th style={{ padding: 8 }}>Sinalizadores</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid var(--line)" }}>
                <td style={{ padding: 8, maxWidth: 320 }}>
                  <div style={{ fontWeight: 600 }}>
                    {p.nome || <span style={{ color: "#ff8080" }}>(sem nome)</span>}
                    {p.variantes > 1 && (
                      <span style={{ color: "var(--muted)", fontWeight: 400 }}> · {p.variantes} cores</span>
                    )}
                  </div>
                  {!p.imageLink && <div style={{ color: "#ff8080", fontSize: 12 }}>⚠ sem imagem</div>}
                </td>
                <td style={{ padding: 8, fontFamily: "var(--mono)", fontSize: 12 }}>{codigoExibicao(p)}</td>
                <td style={{ padding: 8 }}>
                  <CategoriaSelect
                    produtoId={p.id}
                    categoriaManualAtual={p.categoriaManual}
                    categoriaAutomatica={p.categoria}
                  />
                </td>
                <td style={{ padding: 8 }}>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <ToggleFlag produtoId={p.id} valorAtual={p.ocultoManualmente} label="Ocultar" action={alternarOculto} />
                    <ToggleFlag produtoId={p.id} valorAtual={p.destaque} label="Destaque" action={alternarDestaque} />
                    <ToggleFlag
                      produtoId={p.id}
                      valorAtual={p.maisVendido}
                      label="Mais vendido"
                      action={alternarMaisVendido}
                    />
                  </div>
                  {p.variantes > 1 && (
                    <div style={{ color: "var(--muted)", fontSize: 11, marginTop: 4 }}>
                      Aplica nas {p.variantes} cores juntas
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {produtos.length === 0 && (
        <p style={{ color: "var(--muted)", marginTop: 20 }}>Nenhum produto encontrado com esse filtro.</p>
      )}

      {totalPaginas > 1 && (
        <div className="pagination" style={{ marginTop: 24 }}>
          <Link href={buildLink({ page: Math.max(1, paginaAtual - 1) })} className={`page-btn${paginaAtual <= 1 ? " disabled" : ""}`}>
            ‹
          </Link>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>
            Página {paginaAtual} de {totalPaginas}
          </span>
          <Link
            href={buildLink({ page: Math.min(totalPaginas, paginaAtual + 1) })}
            className={`page-btn${paginaAtual >= totalPaginas ? " disabled" : ""}`}
          >
            ›
          </Link>
        </div>
      )}
    </main>
  );
}
