"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

interface AddToQuoteButtonProps {
  productId: number;
  codigoXbz: string;
  descricao: string;
  imageLink: string | null;
}

export function AddToQuoteButton({ productId, codigoXbz, descricao, imageLink }: AddToQuoteButtonProps) {
  const { adicionar } = useCart();
  const [quantidade, setQuantidade] = useState(1);
  const [adicionado, setAdicionado] = useState(false);
  const router = useRouter();

  function handleAdicionar() {
    adicionar({ productId, codigoXbz, descricao, imageLink }, quantidade);
    setAdicionado(true);
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 16 }}>
      <input
        type="number"
        min={1}
        value={quantidade}
        onChange={(e) => setQuantidade(Math.max(1, Number(e.target.value)))}
        style={{
          width: 70,
          padding: 8,
          border: "1px solid var(--line)",
          borderRadius: 8,
          background: "rgba(255,255,255,0.04)",
          color: "var(--cream)",
        }}
      />
      <button className="btn-wpp" style={{ border: "none" }} onClick={handleAdicionar} disabled={adicionado}>
        {adicionado ? "Adicionado ✓" : "Adicionar ao orçamento"}
      </button>
      {adicionado && (
        <button className="btn-ghost" onClick={() => router.push("/orcamento")}>
          Ver orçamento →
        </button>
      )}
    </div>
  );
}
