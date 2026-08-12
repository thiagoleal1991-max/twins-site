"use client";

import { useEffect } from "react";

/**
 * Replica o efeito de fade-in ao rolar do protótipo original: observa todos
 * os elementos com a classe .reveal e adiciona .in quando entram na tela.
 */
export function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
