"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { definirTemaSite, type TemaSite } from "@/lib/tema";

export async function alterarTemaSite(formData: FormData) {
  requireAdmin();

  const tema = String(formData.get("tema") ?? "") as TemaSite;
  await definirTemaSite(tema);

  // O tema é lido em quase toda página do site (layout raiz, zona
  // catálogo) — revalida tudo pra refletir a mudança na hora, sem esperar
  // o próximo request "frio" recalcular sozinho.
  revalidatePath("/", "layout");
}
