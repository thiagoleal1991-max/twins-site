import { notFound } from "next/navigation";
import { buscarProdutoPorCodigo } from "@/lib/products";
import { AddToQuoteButton } from "@/components/AddToQuoteButton";

export const dynamic = "force-dynamic";

interface ProdutoPageProps {
  params: { codigo: string };
}

export default async function ProdutoPage({ params }: ProdutoPageProps) {
  const produto = await buscarProdutoPorCodigo(params.codigo);

  if (!produto) notFound();

  return (
    <main className="container">
      <span className="badge-dev">🚧 Layout provisório</span>
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 32 }}>
        {produto.imageLink && (
          <img
            src={produto.imageLink}
            alt={produto.descricao}
            style={{ width: "100%", background: "#f7f5fa", borderRadius: 10 }}
          />
        )}
        <div>
          <span className="categoria">{produto.categoria}</span>
          <h1>{produto.descricao}</h1>
          <p style={{ color: "#666", fontSize: 13 }}>Código: {produto.codigoXbz}</p>
          <p>
            Preço sob consulta — a Twins monta um orçamento personalizado conforme quantidade,
            personalização e prazo.
          </p>
          <AddToQuoteButton
            productId={produto.id}
            codigoXbz={produto.codigoXbz}
            descricao={produto.descricao}
            imageLink={produto.imageLink}
          />
        </div>
      </div>
    </main>
  );
}
