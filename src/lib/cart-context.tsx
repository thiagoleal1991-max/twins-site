"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface CartItem {
  productId: number;
  codigoXbz: string;
  /** Código "humano" da XBZ (família, ex: 06520) — o que a Twins usa pra
   * comprar de verdade, diferente do codigoXbz (ID interno da nossa rota). */
  codigoExibicao: string;
  descricao: string;
  imageLink: string | null;
  quantidade: number;
}

interface CartContextValue {
  items: CartItem[];
  adicionar: (item: Omit<CartItem, "quantidade">, quantidade?: number) => void;
  remover: (productId: number) => void;
  atualizarQuantidade: (productId: number, quantidade: number) => void;
  limpar: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "twins-orcamento-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [carregado, setCarregado] = useState(false);

  // Carrega do localStorage só no cliente (evita mismatch de SSR)
  useEffect(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      if (salvo) setItems(JSON.parse(salvo));
    } catch {
      // localStorage indisponível ou corrompido — segue com carrinho vazio
    }
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (!carregado) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, carregado]);

  function adicionar(item: Omit<CartItem, "quantidade">, quantidade = 1) {
    setItems((atual) => {
      const existente = atual.find((i) => i.productId === item.productId);
      if (existente) {
        return atual.map((i) =>
          i.productId === item.productId ? { ...i, quantidade: i.quantidade + quantidade } : i,
        );
      }
      return [...atual, { ...item, quantidade }];
    });
  }

  function remover(productId: number) {
    setItems((atual) => atual.filter((i) => i.productId !== productId));
  }

  function atualizarQuantidade(productId: number, quantidade: number) {
    if (quantidade < 1) return;
    setItems((atual) => atual.map((i) => (i.productId === productId ? { ...i, quantidade } : i)));
  }

  function limpar() {
    setItems([]);
  }

  return (
    <CartContext.Provider value={{ items, adicionar, remover, atualizarQuantidade, limpar }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}
