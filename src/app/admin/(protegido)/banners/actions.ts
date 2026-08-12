"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

function revalidarTudo() {
  revalidatePath("/admin/banners");
  revalidatePath("/catalogo");
}

export async function criarBanner(formData: FormData) {
  requireAdmin();

  const tag = String(formData.get("tag") ?? "").trim();
  const titulo = String(formData.get("titulo") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim();
  const tamanho = String(formData.get("tamanho") ?? "grande");
  const href = String(formData.get("href") ?? "").trim() || null;
  const ordem = Number(formData.get("ordem") ?? 0) || 0;

  if (!tag || !titulo || !descricao) {
    throw new Error("Preencha tag, título e descrição");
  }

  await prisma.banner.create({ data: { tag, titulo, descricao, tamanho, href, ordem } });
  revalidarTudo();
}

export async function excluirBanner(id: number) {
  requireAdmin();
  await prisma.banner.delete({ where: { id } });
  revalidarTudo();
}

export async function alternarBannerAtivo(id: number, valorAtual: boolean) {
  requireAdmin();
  await prisma.banner.update({ where: { id }, data: { ativo: !valorAtual } });
  revalidarTudo();
}
