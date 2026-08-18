"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ehSrcValida } from "@/lib/image-hosts";

interface ProductImageProps {
  src: string;
  alt: string;
  /** Imagem "acima da dobra" (ex: a única foto grande da página de produto)
   * — carrega sem lazy loading e com prioridade mais alta. Nos cards do
   * catálogo (muitas imagens, a maioria fora da tela) deixa false. */
  priority?: boolean;
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
