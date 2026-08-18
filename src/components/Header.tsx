"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { TemaSite } from "@/lib/tema";

const WHATSAPP_LINK =
  "https://wa.me/5553984554951?text=Ol%C3%A1!%20Quero%20um%20or%C3%A7amento%20para%20minha%20empresa.";

const LINKS = [
  { href: "/#solucoes", label: "Soluções" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/#diferenciais", label: "Por que a Twins" },
  { href: "/#sobre", label: "Sobre" },
];

// Rotas que ficam na "zona catálogo" (ver src/lib/tema.ts) — no modo
// híbrido elas são sempre claras, mesmo com o resto do site escuro. O
// header é compartilhado entre todas as páginas (renderizado uma vez no
// layout raiz), então precisa se re-temar sozinho conforme a rota atual em
// vez de herdar só o tema geral do <html>.
const ZONA_CATALOGO = ["/catalogo", "/produto", "/orcamento"];

// /admin fica sempre escuro (ver src/app/admin/layout.tsx) — não importa o
// `temaSite` configurado. Sem essa checagem aqui, um `temaSite` "claro"
// deixaria só o header claro (compartilhado, não sabe que está sobre uma
// página pinada em escuro), destoando do painel escuro logo abaixo.
const ZONA_ADMIN = "/admin";

interface HeaderProps {
  temaSite: TemaSite;
}

export function Header({ temaSite }: HeaderProps) {
  const pathname = usePathname();

  const emAdmin = pathname?.startsWith(ZONA_ADMIN);
  const emZonaCatalogo = ZONA_CATALOGO.some((prefixo) => pathname?.startsWith(prefixo));
  const tema = emAdmin ? "escuro" : temaSite === "hibrido" ? (emZonaCatalogo ? "claro" : "escuro") : temaSite;
  const logo = tema === "claro" ? "/assets/logo-roxa.svg" : "/assets/logo-branca.svg";

  return (
    <header className="site-header" data-tema={tema}>
      <div className="nav">
        <Link href="/" aria-label="Twins Artigos Personalizados">
          <img src={logo} alt="Twins Artigos Personalizados" className="logo-img" />
        </Link>
        <nav className="nav-links">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={link.href === "/catalogo" && pathname?.startsWith("/catalogo") ? "active" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <a className="btn-wpp" href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
          Falar no WhatsApp
        </a>
      </div>
    </header>
  );
}
