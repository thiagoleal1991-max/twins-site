import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarProdutoPorCodigo, listarVariantes, codigoExibicao } from "@/lib/products";
import { AddToQuoteButton } from "@/components/AddToQuoteButton";
import { QuoteBar } from "@/components/QuoteBar";
import { ProductImage } from "@/components/ProductImage";

export const dynamic = "force-dynamic";

interface ProdutoPageProps {
  params: { codigo: string };
}

export default async function ProdutoPage({ params }: ProdutoPageProps) {
  const produto = await buscarProdutoPorCodigo(params.codigo);

  if (!produto) notFound();

  const variantes = await listarVariantes(produto.codigoAmigavel);

  return (
    <>
      <div className="wrap" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <Link href="/catalogo" style={{ fontSize: 13.5, color: "var(--muted)" }}>
          ← Voltar ao catálogo
        </Link>

        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 40, marginTop: 20 }}>
          <div className="product-thumb" style={{ borderRadius: "var(--radius)" }}>
            <span className="product-cat-badge">{produto.categoria}</span>
            {produto.imageLink && <ProductImage src={produto.imageLink} alt={produto.nome ?? produto.descricao} />}
          </div>

          <div>
            <h1 style={{ fontSize: "clamp(24px, 3vw, 34px)" }}>{produto.nome ?? produto.descricao}</h1>
            <p className="product-sku" style={{ marginTop: 8 }}>
              Código {codigoExibicao(produto)}
            </p>
            <p style={{ color: "var(--cream-dim)", marginTop: 20, maxWidth: 480 }}>{produto.descricao}</p>

            {variantes.length > 1 && (
              <div style={{ marginTop: 24 }}>
                <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 8 }}>
                  Cor / variação ({variantes.length} opções):
                </p>
                <div className="chips">
                  {variantes.map((v) => {
                    const cor = v.codigoComposto?.split("-").pop() || v.codigoXbz;
                    const ativo = v.codigoXbz === produto.codigoXbz;
                    return (
                      <Link key={v.id} href={`/produto/${v.codigoXbz}`} className={`chip${ativo ? " active" : ""}`}>
                        {cor}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <p style={{ color: "var(--muted)", marginTop: 20, maxWidth: 480, fontSize: 13.5 }}>
              Preço sob consulta — a Twins monta um orçamento personalizado conforme quantidade, personalização e
              prazo de entrega.
            </p>
            <AddToQuoteButton
              productId={produto.id}
              codigoXbz={produto.codigoXbz}
              codigoExibicao={codigoExibicao(produto)}
              descricao={produto.nome ?? produto.descricao}
              imageLink={produto.imageLink}
            />
          </div>
        </div>
      </div>

      <QuoteBar />
    </>
  );
}
