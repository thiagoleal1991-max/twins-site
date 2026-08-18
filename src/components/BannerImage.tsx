"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ehSrcValida } from "@/lib/image-hosts";

interface BannerImageProps {
  src: string;
  alt: string;
  /** O banner é o primeiro elemento visível do /catalogo — sempre prioridade. */
  priority?: boolean;
}

// Banner do topo do catálogo — imagem pura (o texto já vem embutido na
// arte), full-width, proporção de referência 1920x600. Mesma lógica de
// validação/fallback do ProductImage (ver esse componente e
// src/lib/image-hosts.ts pro porquê), só muda o object-fit: aqui é `cover`
// preenchendo o slot inteiro, sem padding — não é uma foto de produto num
// card com fundo, é a peça gráfica inteira.
export function BannerImage({ src, alt, priority = false }: BannerImageProps) {
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
      sizes="100vw"
      style={{ objectFit: "cover" }}
      priority={priority}
      onError={() => setComErro(true)}
    />
  );
}
