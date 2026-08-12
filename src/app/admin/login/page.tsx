"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha }),
      });

      if (!res.ok) {
        setErro("Senha incorreta.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="wrap" style={{ paddingTop: 100, paddingBottom: 100, maxWidth: 400 }}>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>Painel administrativo</h1>
      <form className="form-orcamento" onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          autoFocus
          required
        />
        {erro && <p style={{ color: "#ff8080", fontSize: 13.5 }}>{erro}</p>}
        <button className="btn-wpp" style={{ border: "none" }} type="submit" disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
