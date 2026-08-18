import { temaEfetivo } from "@/lib/tema";

// Esse layout lê `temaSite` do banco — precisa forçar toda a zona catálogo
// como dinâmica (não só marcar a página, que não bastou pro /orcamento por
// ser "use client": o Next não pegou o `dynamic` exportado de lá).
export const dynamic = "force-dynamic";

// Zona catálogo (/catalogo, /produto/[codigo], /orcamento) — no modo
// híbrido, essas páginas ficam sempre claras mesmo com o resto do site
// escuro (ver src/lib/tema.ts). O wrapper com `data-tema` sobrescreve
// localmente os tokens de cor definidos em globals.css a partir daqui pra
// baixo, sem afetar o <html> nem as outras páginas.
//
// Precisa de background/color explícitos aqui (não só o atributo
// `data-tema`, que só redefine variáveis CSS): sem isso, qualquer margem
// nas bordas do conteúdo (ex: a .toolbar tem margin-top) deixa o fundo
// escuro do <body> (herdado do tema geral do <html>) vazar por trás.
export default async function CatalogoLayout({ children }: { children: React.ReactNode }) {
  const tema = await temaEfetivo("catalogo");

  return (
    <div data-tema={tema} style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
