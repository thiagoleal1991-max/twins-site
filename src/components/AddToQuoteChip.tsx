"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

interface AddToQuoteChipProps {
  productId: number;
  codigoXbz: string;
  descricao: string;
  imageLink: string | null;
}

// Botão "+ Orçamento" usado nos cards do grid do catálogo — sempre adiciona
// 1 unidade (a quantidade é ajustável depois, na página /orcamento).
export function AddToQuoteChip({ productId, codigoXbz, descricao, imageLink }: AddToQuoteChipProps) {
  const { items, adicionar } = useCart();
  const [clicado, setClicado] = useState(false);

  const jaNoCarrinho = clicado || items.some((item) => item.productId === productId);

  return (
    <button
      type="button"
      className={`btn-add${jaNoCarrinho ? " added" : ""}`}
      disabled={jaNoCarrinho}
      onClick={() => {
        adicionar({ productId, codigoXbz, descricao, imageLink }, 1);
        setClicado(true);
      }}
    >
      {jaNoCarrinho ? "Adicionado ✓" : "+ Orçamento"}
    </button>
  );
}
