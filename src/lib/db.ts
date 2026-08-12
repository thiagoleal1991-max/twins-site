import { PrismaClient } from "@prisma/client";

// Evita criar uma nova conexão a cada hot-reload em desenvolvimento
// (padrão recomendado pela própria Prisma para Next.js).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
