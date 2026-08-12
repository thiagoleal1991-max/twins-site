"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function QuoteBar() {
  const { items } = useCart();
  const total = items.reduce((soma, item) => soma + item.quantidade, 0);

  return (
    <div className={`quote-bar${total > 0 ? " show" : ""}`}>
      <span>
        <b>{total}</b> {total === 1 ? "item" : "itens"} no orçamento
      </span>
      <Link className="quote-cta" href="/orcamento">
        Ver orçamento →
      </Link>
    </div>
  );
}
