"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ProductImageProps {
  src: string;
  alt: string;
  /** Imagem "acima da dobra" (ex: a única foto grande da página de produto)
   * — carrega sem lazy loading e com prioridade mais alta. Nos cards do
   * catálogo (muitas imagens, a maioria fora da tela) deixa false. */
  priority?: boolean;
}

// Mesma lista de domínios liberada em next.config.js (images.remotePatterns).
// next/image lança um erro de verdade durante o render — não dispara
// onError, e o React não consegue conter isso com error boundary — tanto
// pra `src` fora desse formato quanto pra host fora dessa lista. Como
// `imageLink` vem direto do que a XBZ manda (nunca validado nesse formato,
// ver src/lib/xbz.ts), uma única linha com valor estranho no banco
// derrubaria a página de catálogo inteira pros outros produtos junto. Por
// isso replicamos a checagem aqui e decidimos ANTES de renderizar o
// <Image> — mesma queda pro fallback de "sem foto" que qualquer outra
// imagem quebrada.
const HOSTS_PERMITIDOS = [
  /(^|\.)minhaxbz\.com\.br$/i,
  /(^|\.)xbz\.com\.br$/i,
  // Domínio real confirmado das fotos (ex: cdn.xbzbrindes.com.br).
  /(^|\.)xbzbrindes\.com\.br$/i,
];

function ehSrcValida(src: string): boolean {
  if (src.startsWith("/")) return true;
  if (!/^https:\/\//i.test(src)) return false;
  try {
    const { hostname } = new URL(src);
    return HOSTS_PERMITIDOS.some((padrao) => padrao.test(hostname));
  } catch {
    return false;
  }
}

// Usa o otimizador de imagem do Next (configurado em next.config.js) em vez
// de <img> puro: as fotos passam a ser redimensionadas pro tamanho real
// exibido e cacheadas pela Vercel — antes cada visita baixava a imagem
// original inteira direto do CDN da XBZ, mais lento e mais pesado que
// precisa.
//
// Se a imagem falhar depois de carregada (URL fora do ar, CDN lento, etc),
// esconde em vez de deixar o navegador mostrar o texto alternativo por cima
// do badge de categoria — cai de volta pro fundo padrão do thumb.
//
// Além do onError normal, checamos no mount se a imagem JÁ falhou antes da
// hidratação do React terminar (comum quando o erro — ex: 404 — chega muito
// rápido, antes do listener ser conectado): nesse caso `complete` já é true
// e `naturalWidth` fica 0.
export function ProductImage({ src, alt, priority = false }: ProductImageProps) {
  const [comErro, setComErro] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setComErro(true);
    }
  }, []);

  if (comErro || !ehSrcValida(src)) return null;

  return (
    <Image
      ref={imgRef}
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 480px) 100vw, (max-width: 760px) 50vw, (max-width: 1080px) 33vw, 280px"
      style={{ objectFit: "contain", padding: 12 }}
      priority={priority}
      onError={() => setComErro(true)}
    />
  );
}
