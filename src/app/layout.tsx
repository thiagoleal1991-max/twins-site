import type { Metadata } from "next";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/Header";
import { WhatsappFab } from "@/components/WhatsappFab";
import { temaEfetivo, buscarTemaSite } from "@/lib/tema";
import "./globals.css";

export const metadata: Metadata = {
  title: "Twins Artigos Personalizados — Soluções Corporativas",
  description:
    "Onboarding, reconhecimento e eventos corporativos com produção própria: gravação a laser, impressão 3D, estamparia têxtil e encadernação. Curadoria estratégica, prazo garantido.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Tema padrão do site (home institucional, /admin, etc). A zona do
  // catálogo pode sobrescrever localmente no modo híbrido — ver
  // src/app/(catalogo)/layout.tsx e o Header (que se re-tema sozinho por
  // rota, já que ele é compartilhado entre todas as páginas).
  const [temaGeral, temaSite] = await Promise.all([temaEfetivo("geral"), buscarTemaSite()]);

  return (
    <html lang="pt-BR" data-tema={temaGeral}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <Header temaSite={temaSite} />
          {children}
          <WhatsappFab />
        </CartProvider>
      </body>
    </html>
  );
}
