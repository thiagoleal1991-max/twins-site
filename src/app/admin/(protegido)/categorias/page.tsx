import { listarCategoriasDb, contarProdutosPorCategoria } from "@/lib/categories";
import { criarCategoria, renomearCategoria, excluirCategoria } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminCategoriasPage() {
  const [categorias, contagens] = await Promise.all([listarCategoriasDb(), contarProdutosPorCategoria()]);

  return (
    <main className="wrap" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Categorias</h1>
      <p style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 24 }}>
        Renomear atualiza automaticamente os produtos que já usam essa categoria. Excluir joga os produtos
        ajustados manualmente pra ela de volta na classificação automática.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>
        {categorias.length === 0 && <p style={{ color: "var(--muted)" }}>Nenhuma categoria cadastrada ainda.</p>}
        {categorias.map((cat) => (
          <div
            key={cat.id}
            style={{
              border: "1px solid var(--line)",
              borderRadius: 10,
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <form action={renomearCategoria.bind(null, cat.id)} style={{ display: "flex", gap: 8, flex: 1, minWidth: 240 }}>
              <input
                name="novoNome"
                defaultValue={cat.nome}
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  border: "1px solid var(--line)",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.04)",
                  color: "var(--cream)",
                  fontSize: 13.5,
                }}
              />
              <button className="btn-ghost" type="submit">
                Salvar
              </button>
            </form>
            <span style={{ color: "var(--muted)", fontSize: 12.5, fontFamily: "var(--mono)" }}>
              {contagens[cat.nome] ?? 0} produto(s)
            </span>
            <form action={excluirCategoria.bind(null, cat.id)}>
              <button className="btn-ghost" type="submit" style={{ color: "#ff8080" }}>
                Excluir
              </button>
            </form>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 18, marginBottom: 16 }}>Nova categoria</h2>
      <form action={criarCategoria} style={{ display: "flex", gap: 8, maxWidth: 420 }}>
        <input
          name="nome"
          placeholder="Nome da categoria (ex: Brindes de Cozinha)"
          required
          style={{
            flex: 1,
            padding: "10px 12px",
            border: "1px solid var(--line)",
            borderRadius: 8,
            background: "rgba(255,255,255,0.04)",
            color: "var(--cream)",
          }}
        />
        <button className="btn-wpp" style={{ border: "none" }} type="submit">
          Criar
        </button>
      </form>
    </main>
  );
}
