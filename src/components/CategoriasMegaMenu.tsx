"use client";

import { useState } from "react";
import Link from "next/link";

export interface ChipItem {
  href: string;
  label: string;
  active: boolean;
}

export interface GrupoMegaMenuUi {
  nome: string;
  itens: { nome: string; href: string; active: boolean }[];
}

interface CategoriasMegaMenuProps {
  chips: ChipItem[];
  grupos: GrupoMegaMenuUi[];
  /** Abre o menu já aberto quando a página carrega com uma categoria
   * selecionada, pra dar contexto de onde ela está no agrupamento. */
  abrirPorPadrao: boolean;
}

// Barra principal enxuta (Todos / Destaques / Mais vendidos / campanhas
// sazonais ativas) + botão "Categorias" que abre um mega-menu agrupado por
// tema — substitui a lista longa de 50 chips de categoria soltos.
export function CategoriasMegaMenu({ chips, grupos, abrirPorPadrao }: CategoriasMegaMenuProps) {
  const [aberto, setAberto] = useState(abrirPorPadrao);

  return (
    <>
      <div className="chips">
        {chips.map((chip) => (
          <Link key={chip.href} href={chip.href} className={`chip${chip.active ? " active" : ""}`}>
            {chip.label}
          </Link>
        ))}
        <button
          type="button"
          className={`chip cats${aberto ? " open" : ""}`}
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
        >
          Categorias
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      <div className={`mega${aberto ? " open" : ""}`}>
        {grupos.map((grupo) => (
          <div key={grupo.nome} className="mega-col">
            <h5>{grupo.nome}</h5>
            {grupo.itens.map((item) => (
              <Link key={item.nome} href={item.href} className={item.active ? "active" : undefined}>
                {item.nome}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
