import { listarBannersAdmin } from "@/lib/banners";
import { criarBanner, excluirBanner, alternarBannerAtivo } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const banners = await listarBannersAdmin();

  return (
    <main className="wrap" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Banners do catálogo</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
        {banners.length === 0 && <p style={{ color: "var(--muted)" }}>Nenhum banner cadastrado ainda.</p>}
        {banners.map((b) => (
          <div
            key={b.id}
            style={{
              border: "1px solid var(--line)",
              borderRadius: 10,
              padding: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              opacity: b.ativo ? 1 : 0.5,
            }}
          >
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--glow-soft)" }}>
                {b.tag} · {b.tamanho} · ordem {b.ordem}
              </div>
              <div style={{ fontWeight: 600, marginTop: 4 }}>{b.titulo}</div>
              <div style={{ color: "var(--cream-dim)", fontSize: 13, marginTop: 2 }}>{b.descricao}</div>
              {b.href && (
                <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 2 }}>Link: {b.href}</div>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <form action={alternarBannerAtivo.bind(null, b.id, b.ativo)}>
                <button className="btn-ghost" type="submit">
                  {b.ativo ? "Desativar" : "Ativar"}
                </button>
              </form>
              <form action={excluirBanner.bind(null, b.id)}>
                <button className="btn-ghost" type="submit" style={{ color: "#ff8080" }}>
                  Excluir
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 18, marginBottom: 16 }}>Novo banner</h2>
      <form action={criarBanner} className="form-orcamento">
        <input name="tag" placeholder="Tag (ex: Destaque do mês)" required />
        <input name="titulo" placeholder="Título" required />
        <textarea name="descricao" placeholder="Descrição" rows={3} required />
        <select
          name="tamanho"
          defaultValue="grande"
          style={{
            padding: "10px 12px",
            border: "1px solid var(--line)",
            borderRadius: 8,
            background: "rgba(255,255,255,0.04)",
            color: "var(--cream)",
          }}
        >
          <option value="grande">Grande (banner principal)</option>
          <option value="pequeno">Pequeno (banner lateral)</option>
        </select>
        <input name="href" placeholder="Link (opcional, ex: /catalogo?categoria=Vestuário)" />
        <input name="ordem" type="number" defaultValue={0} placeholder="Ordem de exibição" />
        <button className="btn-wpp" style={{ border: "none" }} type="submit">
          Criar banner
        </button>
      </form>
    </main>
  );
}
