// Painel interno (login + área protegida) — sempre no tema escuro, não
// importa o que `temaSite` estiver configurado pros visitantes do site.
// "Configuração de marca aplicada a todos os visitantes" não inclui a
// equipe usando a ferramenta de administração.
//
// background/color explícitos aqui (não só `data-tema`) evitam que o fundo
// do tema geral (que pode ser claro, se `temaSite` for "claro") vaze nas
// bordas do conteúdo — mesmo motivo do wrapper em (catalogo)/layout.tsx.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-tema="escuro" style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
