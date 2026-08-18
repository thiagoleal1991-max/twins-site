import { prisma } from "./db";

// Configuração de tema do site — não é preferência por visitante, é uma
// configuração de marca única (ver model SiteConfig no schema). Lida do
// banco a cada carregamento (o app já é todo `force-dynamic`, sem cache de
// página — muda raramente e é barato de consultar).

export type TemaSite = "claro" | "escuro" | "hibrido";
export type TemaEfetivo = "claro" | "escuro";
export type ZonaTema = "geral" | "catalogo";

const TEMAS_VALIDOS: TemaSite[] = ["claro", "escuro", "hibrido"];

export async function buscarTemaSite(): Promise<TemaSite> {
  const config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  const valor = config?.temaSite;
  return TEMAS_VALIDOS.includes(valor as TemaSite) ? (valor as TemaSite) : "escuro";
}

/**
 * Tema que se aplica de fato numa "zona" da página:
 * - "geral": home institucional, /admin, /orcamento seguem essa.
 * - "catalogo": /catalogo e /produto/[codigo] (e /orcamento, ver layout).
 *
 * No modo "hibrido", a zona catálogo é sempre clara e o resto sempre
 * escuro — nos modos "claro"/"escuro" puros, as duas zonas são iguais.
 */
export async function temaEfetivo(zona: ZonaTema = "geral"): Promise<TemaEfetivo> {
  const tema = await buscarTemaSite();
  if (tema === "hibrido") return zona === "catalogo" ? "claro" : "escuro";
  return tema;
}

export async function definirTemaSite(tema: TemaSite): Promise<void> {
  if (!TEMAS_VALIDOS.includes(tema)) throw new Error("Tema inválido");
  await prisma.siteConfig.upsert({
    where: { id: 1 },
    create: { id: 1, temaSite: tema },
    update: { temaSite: tema },
  });
}
