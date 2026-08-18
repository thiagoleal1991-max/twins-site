"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

const WHATSAPP_NUMERO = "5553984554951";

// O layout da zona catálogo (ver (catalogo)/layout.tsx) lê `temaSite` do
// banco a cada request — sem forçar essa página como dinâmica também, o
// Next a pré-renderiza estática no build e o tema fica congelado.
export const dynamic = "force-dynamic";

export default function OrcamentoPage() {
  const { items, remover, atualizarQuantidade, limpar } = useCart();
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [linkWhatsapp, setLinkWhatsapp] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);

    const form = new FormData(e.currentTarget);
    const body = {
      empresa: String(form.get("empresa") ?? ""),
      contatoNome: String(form.get("contatoNome") ?? ""),
      contatoFone: String(form.get("contatoFone") ?? ""),
      contatoEmail: String(form.get("contatoEmail") ?? ""),
      observacoes: String(form.get("observacoes") ?? ""),
      items: items.map((item) => ({ productId: item.productId, quantidade: item.quantidade })),
    };

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setErro(data.error?.formErrors?.join(", ") ?? "Não foi possível enviar o orçamento.");
        return;
      }

      const listaItens = items.map((i) => `• ${i.quantidade}x ${i.descricao} (código ${i.codigoExibicao})`).join("\n");
      const mensagem = `Olá! Gostaria de um orçamento (pedido #${data.id}):\n\n${listaItens}\n\nEmpresa: ${body.empresa}`;
      setLinkWhatsapp(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`);
      limpar();
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  if (linkWhatsapp) {
    return (
      <main className="wrap" style={{ paddingTop: 60, paddingBottom: 80 }}>
        <h1>Orçamento enviado! 🎉</h1>
        <p style={{ color: "var(--cream-dim)", marginTop: 12, marginBottom: 24 }}>
          Recebemos seu pedido de orçamento. Finalize falando com nosso time no WhatsApp:
        </p>
        <a className="btn-wpp" href={linkWhatsapp} target="_blank" rel="noreferrer">
          Continuar no WhatsApp
        </a>
      </main>
    );
  }

  return (
    <main className="wrap" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <span className="badge-dev">🚧 Layout provisório — banco/carrinho já reais</span>
      <h1>Meu orçamento</h1>

      {items.length === 0 ? (
        <p style={{ color: "var(--cream-dim)", marginTop: 12 }}>
          Nenhum produto adicionado ainda. Volte ao catálogo e escolha alguns itens.
        </p>
      ) : (
        <div style={{ marginBottom: 24 }}>
          {items.map((item) => (
            <div key={item.productId} className="carrinho-item">
              <span>{item.descricao}</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="number"
                  min={1}
                  value={item.quantidade}
                  onChange={(e) => atualizarQuantidade(item.productId, Number(e.target.value))}
                  style={{
                    width: 60,
                    padding: 6,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--line)",
                    borderRadius: 6,
                    color: "var(--cream)",
                  }}
                />
                <button type="button" className="btn-ghost" onClick={() => remover(item.productId)}>
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <form className="form-orcamento" onSubmit={handleSubmit}>
          <input name="empresa" placeholder="Nome da empresa" required />
          <input name="contatoNome" placeholder="Seu nome" required />
          <input name="contatoFone" placeholder="Telefone / WhatsApp" required />
          <input name="contatoEmail" type="email" placeholder="E-mail (opcional)" />
          <textarea name="observacoes" placeholder="Observações (opcional)" rows={3} />
          {erro && <p style={{ color: "#ff8080" }}>{erro}</p>}
          <button className="btn-wpp" style={{ border: "none" }} type="submit" disabled={enviando}>
            {enviando ? "Enviando..." : "Solicitar orçamento"}
          </button>
        </form>
      )}
    </main>
  );
}
