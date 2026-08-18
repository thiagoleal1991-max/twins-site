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

  const imagem = String(formData.get("imagem") ?? "").trim();
  const href = String(formData.get("href") ?? "").trim() || null;
  const ordem = Number(formData.get("ordem") ?? 0) || 0;

  if (!imagem) {
    throw new Error("Preencha a URL da imagem");
  }

  await prisma.banner.create({ data: { imagem, href, ordem } });
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
