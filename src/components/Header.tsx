"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function Header() {
  const { items } = useCart();
  const totalItens = items.reduce((soma, item) => soma + item.quantidade, 0);

  return (
    <header className="site-header">
      <Link href="/">twins®</Link>
      <nav>
        <Link href="/catalogo">Catálogo</Link>
        <Link href="/orcamento">Orçamento{totalItens > 0 ? ` (${totalItens})` : ""}</Link>
      </nav>
    </header>
  );
}
