"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { listarCategorias } from "@/lib/categorize";

function revalidarPublico() {
  revalidatePath("/catalogo");
  revalidatePath("/produto/[codigo]", "page");
}

export async function atualizarCategoriaManual(produtoId: number, categoria: string) {
  requireAdmin();

  const valor = categoria.trim();
  const categoriaValida = valor === "" || listarCategorias().includes(valor);
  if (!categoriaValida) throw new Error("Categoria inválida");

  await prisma.product.update({
    where: { id: produtoId },
    data: { categoriaManual: valor || null },
  });

  revalidatePath("/admin");
  revalidarPublico();
}

export async function alternarOculto(produtoId: number, valor: boolean) {
  requireAdmin();
  await prisma.product.update({ where: { id: produtoId }, data: { ocultoManualmente: valor } });
  revalidatePath("/admin");
  revalidarPublico();
}

export async function alternarDestaque(produtoId: number, valor: boolean) {
  requireAdmin();
  await prisma.product.update({ where: { id: produtoId }, data: { destaque: valor } });
  revalidatePath("/admin");
  revalidarPublico();
}

export async function alternarMaisVendido(produtoId: number, valor: boolean) {
  requireAdmin();
  await prisma.product.update({ where: { id: produtoId }, data: { maisVendido: valor } });
  revalidatePath("/admin");
  revalidarPublico();
}
