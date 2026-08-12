import type { Metadata } from "next";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Twins Artigos Personalizados",
  description: "Soluções corporativas de brindes personalizados.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
