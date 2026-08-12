import { prisma } from "./db";

export async function listarBannersAtivos() {
  return prisma.banner.findMany({
    where: { ativo: true },
    orderBy: { ordem: "asc" },
  });
}

export async function listarBannersAdmin() {
  return prisma.banner.findMany({
    orderBy: [{ ordem: "asc" }, { id: "asc" }],
  });
}
