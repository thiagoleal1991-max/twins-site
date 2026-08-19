import { listarBannersAdmin } from "@/lib/banners";
import { excluirBanner, alternarBannerAtivo } from "./actions";
import { NovoBannerForm } from "@/components/admin/NovoBannerForm";
import { BannerImage } from "@/components/BannerImage";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const banners = await listarBannersAdmin();

  return (
    <main className="wrap" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Banners do catálogo</h1>
      <p style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 20 }}>
        Imagem pura, sem texto sobreposto — o texto já vem embutido na própria arte. Proporção de referência
        1920x600. Se tiver mais de um banner ativo, o catálogo mostra todos numa faixa que rola lateralmente.
        Pra trocar uma campanha sazonal, é só desativar o banner antigo e ativar o novo.
      </p>

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
            <div style={{ display: "flex", gap: 14, minWidth: 0 }}>
              <div
                style={{
                  position: "relative",
                  width: 96,
                  aspectRatio: "1920 / 600",
                  borderRadius: 6,
                  overflow: "hidden",
                  background: "var(--purple-deep)",
                  flexShrink: 0,
                }}
              >
                <BannerImage src={b.imagem} alt="" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--glow-soft)" }}>
                  ordem {b.ordem}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    marginTop: 4,
                    wordBreak: "break-all",
                    color: "var(--muted)",
                  }}
                >
                  {b.imagem}
                </div>
                {b.href && (
                  <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 2 }}>Link: {b.href}</div>
                )}
              </div>
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
      <NovoBannerForm />
    </main>
  );
}
