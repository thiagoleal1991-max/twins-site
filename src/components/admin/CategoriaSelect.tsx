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
        padding: "4px 6px",
        background: "rgba(255,255,255,0.04)",
        color: "var(--cream)",
        border: "1px solid var(--line)",
        borderRadius: 6,
        maxWidth: 220,
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
