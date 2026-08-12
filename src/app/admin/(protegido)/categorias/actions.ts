"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

function revalidarTudo() {
  revalidatePath("/admin/categorias");
  revalidatePath("/admin");
  revalidatePath("/catalogo");
}

export async function criarCategoria(formData: FormData) {
  requireAdmin();

  const nome = String(formData.get("nome") ?? "").trim();
  if (!nome) throw new Error("Nome da categoria é obrigatório");

  const existente = await prisma.category.findUnique({ where: { nome } });
  if (existente) throw new Error("Já existe uma categoria com esse nome");

  const maiorOrdem = await prisma.category.aggregate({ _max: { ordem: true } });
  await prisma.category.create({ data: { nome, ordem: (maiorOrdem._max.ordem ?? 0) + 1 } });

  revalidarTudo();
}

export async function renomearCategoria(id: number, formData: FormData) {
  requireAdmin();

  const novoNome = String(formData.get("novoNome") ?? "").trim();
  if (!novoNome) throw new Error("Nome da categoria é obrigatório");

  const categoria = await prisma.category.findUnique({ where: { id } });
  if (!categoria) throw new Error("Categoria não encontrada");
  if (categoria.nome === novoNome) return;

  const conflito = await prisma.category.findUnique({ where: { nome: novoNome } });
  if (conflito) throw new Error("Já existe uma categoria com esse nome");

  // Renomear atualiza também os produtos que já usam essa categoria — tanto
  // os ajustados manualmente quanto os classificados automaticamente na
  // última sincronização — pra não ficar nada com o nome antigo "órfão".
  await prisma.$transaction([
    prisma.category.update({ where: { id }, data: { nome: novoNome } }),
    prisma.product.updateMany({ where: { categoriaManual: categoria.nome }, data: { categoriaManual: novoNome } }),
    prisma.product.updateMany({ where: { categoria: categoria.nome }, data: { categoria: novoNome } }),
  ]);

  revalidarTudo();
}

export async function excluirCategoria(id: number) {
  requireAdmin();

  const categoria = await prisma.category.findUnique({ where: { id } });
  if (!categoria) return;

  // Produtos que tinham essa categoria escolhida manualmente voltam a usar
  // a classificação automática (não ficam "presos" numa categoria que não
  // existe mais na lista).
  await prisma.$transaction([
    prisma.product.updateMany({ where: { categoriaManual: categoria.nome }, data: { categoriaManual: null } }),
    prisma.category.delete({ where: { id } }),
  ]);

  revalidarTudo();
}
