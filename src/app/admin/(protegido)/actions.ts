"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { listarCategorias } from "@/lib/categorize";
import { idsDaFamilia } from "@/lib/products";

function revalidarPublico() {
  revalidatePath("/catalogo");
  revalidatePath("/produto/[codigo]", "page");
}

export async function atualizarCategoriaManual(produtoId: number, categoria: string) {
  requireAdmin();

  const valor = categoria.trim();
  const categoriaValida = valor === "" || listarCategorias().includes(valor);
  if (!categoriaValida) throw new Error("Categoria inválida");

  const ids = await idsDaFamilia(produtoId);
  await prisma.product.updateMany({
    where: { id: { in: ids } },
    data: { categoriaManual: valor || null },
  });

  revalidatePath("/admin");
  revalidarPublico();
}

export async function alternarOculto(produtoId: number, valor: boolean) {
  requireAdmin();
  const ids = await idsDaFamilia(produtoId);
  await prisma.product.updateMany({ where: { id: { in: ids } }, data: { ocultoManualmente: valor } });
  revalidatePath("/admin");
  revalidarPublico();
}

export async function alternarDestaque(produtoId: number, valor: boolean) {
  requireAdmin();
  const ids = await idsDaFamilia(produtoId);
  await prisma.product.updateMany({ where: { id: { in: ids } }, data: { destaque: valor } });
  revalidatePath("/admin");
  revalidarPublico();
}

export async function alternarMaisVendido(produtoId: number, valor: boolean) {
  requireAdmin();
  const ids = await idsDaFamilia(produtoId);
  await prisma.product.updateMany({ where: { id: { in: ids } }, data: { maisVendido: valor } });
  revalidatePath("/admin");
  revalidarPublico();
}
