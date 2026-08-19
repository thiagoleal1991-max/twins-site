// Mesma lista de domínios liberada em next.config.js (images.remotePatterns).
// next/image lança um erro de verdade durante o render — não dispara
// onError, e o React não consegue conter isso com error boundary — tanto
// pra `src` fora desse formato quanto pra host fora dessa lista. Como as
// URLs de imagem (produto vindo da XBZ, banner cadastrado no /admin) nunca
// passam por validação de formato antes de cair no banco, uma única linha
// com valor estranho derrubaria a página inteira pros outros itens junto.
// Por isso replicamos a checagem aqui e decidimos ANTES de renderizar o
// <Image> — mesma queda pro fallback de "sem imagem" que qualquer outra
// imagem quebrada. Usado por ProductImage e BannerImage.
const HOSTS_PERMITIDOS = [
  /(^|\.)minhaxbz\.com\.br$/i,
  /(^|\.)xbz\.com\.br$/i,
  // Domínio real confirmado das fotos de produto (ex: cdn.xbzbrindes.com.br)
  // — banners usam o mesmo CDN.
  /(^|\.)xbzbrindes\.com\.br$/i,
  // Banners enviados pelo /admin via upload direto pro Vercel Blob.
  /(^|\.)public\.blob\.vercel-storage\.com$/i,
];

export function ehSrcValida(src: string): boolean {
  if (src.startsWith("/")) return true;
  if (!/^https:\/\//i.test(src)) return false;
  try {
    const { hostname } = new URL(src);
    return HOSTS_PERMITIDOS.some((padrao) => padrao.test(hostname));
  } catch {
    return false;
  }
}
