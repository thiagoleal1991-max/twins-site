"use client";

import { useTransition } from "react";
import { atualizarCategoriaManual } from "@/app/admin/(protegido)/actions";

interface CategoriaSelectProps {
  produtoId: number;
  categoriaManualAtual: string | null;
  categoriaAutomatica: string;
  categorias: string[];
}

export function CategoriaSelect({ produtoId, categoriaManualAtual, categoriaAutomatica, categorias }: CategoriaSelectProps) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={categoriaManualAtual ?? ""}
      disabled={pending}
      onChange={(e) => {
        const valor = e.target.value;
        startTransition(() => {
          atualizarCategoriaManual(produtoId, valor);
        });
      }}
      style={{
        fontSize: 12.5,
        padding: "4px 26px 4px 8px",
        // Fundo sólido (não translúcido) + `appearance: none` com seta
        // desenhada por nós: o `color-scheme: dark` (globals.css) resolve
        // a maioria dos casos, mas em alguns Chrome/Windows o navegador
        // ainda pinta o <select> fechado com a cor nativa dele por cima do
        // nosso `color`, ficando ilegível. Assumindo o controle total do
        // visual (sem depender de tema nativo do SO) evita essa loteria.
        background: "#1a0f28",
        color: "#F5F1EA",
        border: "1px solid var(--line)",
        borderRadius: 6,
        maxWidth: 220,
        appearance: "none",
        WebkitAppearance: "none",
        MozAppearance: "none",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23F5F1EA' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center",
      }}
    >
      <option value="" style={{ background: "#1a0f28", color: "#F5F1EA" }}>
        Automática: {categoriaAutomatica}
      </option>
      {categorias.map((c) => (
        <option key={c} value={c} style={{ background: "#1a0f28", color: "#F5F1EA" }}>
          {c}
        </option>
      ))}
    </select>
  );
}
