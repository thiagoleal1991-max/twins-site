import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const QuoteItemSchema = z.object({
  productId: z.number().int().positive(),
  quantidade: z.number().int().positive(),
});

const QuoteRequestSchema = z.object({
  empresa: z.string().min(2, "Informe o nome da empresa"),
  contatoNome: z.string().min(2, "Informe seu nome"),
  contatoFone: z.string().min(8, "Informe um telefone válido"),
  contatoEmail: z.string().email().optional().or(z.literal("")),
  observacoes: z.string().optional(),
  items: z.array(QuoteItemSchema).min(1, "Adicione ao menos um produto ao orçamento"),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = QuoteRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { items, ...dadosContato } = parsed.data;

  const quoteRequest = await prisma.quoteRequest.create({
    data: {
      ...dadosContato,
      contatoEmail: dadosContato.contatoEmail || null,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantidade: item.quantidade,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  return NextResponse.json({ ok: true, id: quoteRequest.id });
}
