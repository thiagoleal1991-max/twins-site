"use client";

import { useRouter, useSearchParams } from "next/navigation";

const OPCOES: { value: string; label: string }[] = [
  { value: "nome", label: "Nome (A-Z)" },
  { value: "recentes", label: "Mais recentes" },
  { value: "categoria", label: "Categoria" },
];

export function SortSelect({ current }: { current: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="sort">
      <select
        value={current}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          if (e.target.value === "nome") {
            params.delete("sort");
          } else {
            params.set("sort", e.target.value);
          }
          params.delete("page");
          const qs = params.toString();
          router.push(qs ? `/catalogo?${qs}` : "/catalogo");
        }}
      >
        {OPCOES.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
    </div>
  );
}
