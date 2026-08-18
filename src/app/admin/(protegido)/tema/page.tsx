import { buscarTemaSite, type TemaSite } from "@/lib/tema";
import { alterarTemaSite } from "./actions";

export const dynamic = "force-dynamic";

const OPCOES: { valor: TemaSite; titulo: string; descricao: string }[] = [
  {
    valor: "escuro",
    titulo: "Escuro",
    descricao: "O visual atual do site inteiro (home + catálogo).",
  },
  {
    valor: "claro",
    titulo: "Claro",
    descricao: "Paleta clara aplicada no site inteiro (home + catálogo).",
  },
  {
    valor: "hibrido",
    titulo: "Híbrido",
    descricao: "Home institucional continua escura; catálogo, produto e orçamento ficam claros.",
  },
];

export default async function AdminTemaPage() {
  const temaAtual = await buscarTemaSite();

  return (
    <main className="wrap" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Tema do site</h1>
      <p style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 24, maxWidth: 560 }}>
        Configuração de marca única — vale pra todo mundo que visita o site, não é uma preferência individual.
        Muda na hora, sem precisar de deploy. O painel administrativo (aqui) sempre fica escuro, independente
        dessa escolha.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 560 }}>
        {OPCOES.map((opcao) => {
          const ativo = opcao.valor === temaAtual;
          return (
            <form key={opcao.valor} action={alterarTemaSite}>
              <input type="hidden" name="tema" value={opcao.valor} />
              <button
                type="submit"
                disabled={ativo}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "16px 18px",
                  borderRadius: 10,
                  border: ativo ? "1px solid var(--glow-soft)" : "1px solid var(--line)",
                  background: ativo ? "rgba(214, 79, 224, 0.1)" : "rgba(255,255,255,0.03)",
                  color: "var(--cream)",
                  cursor: ativo ? "default" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{opcao.titulo}</span>
                  {ativo && (
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 10.5,
                        color: "var(--glow-soft)",
                        border: "1px solid var(--glow-soft)",
                        borderRadius: 999,
                        padding: "2px 8px",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Ativo agora
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: "var(--cream-dim)" }}>{opcao.descricao}</div>
              </button>
            </form>
          );
        })}
      </div>
    </main>
  );
}
