/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Imagens dos produtos vêm do CDN da XBZ — libera esse domínio para o
    // componente <Image> do Next otimizar sem precisar baixar/hospedar aqui.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.minhaxbz.com.br",
      },
      {
        protocol: "https",
        hostname: "**.xbz.com.br",
      },
    ],
  },
};

module.exports = nextConfig;
