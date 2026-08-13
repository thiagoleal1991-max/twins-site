/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Imagens dos produtos vêm do CDN da XBZ — cobrimos tanto o domínio
    // "puro" quanto qualquer subdomínio dele (já vimos `imageLink` variar
    // entre os dois). Um wildcard total (hostname: "**") parecia mais à
    // prova de futuro, mas a Vercel rejeita isso no deploy (provavelmente
    // pra evitar que o otimizador de imagem vire um proxy aberto) — por
    // isso a lista explícita abaixo. Qualquer domínio da XBZ fora dela cai
    // no fallback de "sem foto" em src/components/ProductImage.tsx (que
    // valida o formato de `src` antes de tentar renderizar) em vez de
    // derrubar a página.
    remotePatterns: [
      { protocol: "https", hostname: "minhaxbz.com.br" },
      { protocol: "https", hostname: "**.minhaxbz.com.br" },
      { protocol: "https", hostname: "xbz.com.br" },
      { protocol: "https", hostname: "**.xbz.com.br" },
    ],
  },
};

module.exports = nextConfig;
