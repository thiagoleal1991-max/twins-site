"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const WHATSAPP_LINK =
  "https://wa.me/5553984554951?text=Ol%C3%A1!%20Quero%20um%20or%C3%A7amento%20para%20minha%20empresa.";

const LINKS = [
  { href: "/#solucoes", label: "Soluções" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/#diferenciais", label: "Por que a Twins" },
  { href: "/#sobre", label: "Sobre" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="nav">
        <Link href="/" aria-label="Twins Artigos Personalizados">
          <img src="/assets/logo-branca.svg" alt="Twins Artigos Personalizados" className="logo-img" />
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
