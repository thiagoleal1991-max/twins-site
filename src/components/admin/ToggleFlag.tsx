"use client";

import { useTransition } from "react";

interface ToggleFlagProps {
  produtoId: number;
  valorAtual: boolean;
  label: string;
  action: (produtoId: number, valor: boolean) => Promise<void>;
}

export function ToggleFlag({ produtoId, valorAtual, label, action }: ToggleFlagProps) {
  const [pending, startTransition] = useTransition();

  return (
    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, opacity: pending ? 0.5 : 1 }}>
      <input
        type="checkbox"
        checked={valorAtual}
        disabled={pending}
        onChange={(e) => {
          const novoValor = e.target.checked;
          startTransition(() => {
            action(produtoId, novoValor);
          });
        }}
      />
      {label}
    </label>
  );
}
