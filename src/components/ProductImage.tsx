"use client";

import { useEffect, useRef, useState } from "react";

interface ProductImageProps {
  src: string;
  alt: string;
}

// Se a imagem falhar (URL fora do ar, CDN lento, etc), esconde a tag <img>
// em vez de deixar o navegador mostrar o texto alternativo por cima do
// badge de categoria — cai de volta pro fundo padrão do thumb.
//
// Além do onError normal, checamos no mount se a imagem JÁ falhou antes da
// hidratação do React terminar (comum quando o erro — ex: 404 — chega muito
// rápido, antes do listener ser conectado): nesse caso `complete` já é true
// e `naturalWidth` fica 0.
export function ProductImage({ src, alt }: ProductImageProps) {
  const [comErro, setComErro] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setComErro(true);
    }
  }, []);

  if (comErro) return null;

  return <img ref={imgRef} src={src} alt={alt} loading="lazy" onError={() => setComErro(true)} />;
}
