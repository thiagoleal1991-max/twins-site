import { NextResponse } from "next/server";
import { sincronizarProdutosXbz } from "@/lib/sync";

export const dynamic = "force-dynamic";
// Com upsert em lote (ver src/lib/sync.ts), 16k+ produtos sincronizam em
// segundos — 120s é margem de sobra, não o esperado. No plano Hobby da
// Vercel o teto real é 60s independente do que configurarmos aqui.
export const maxDuration = 120;

function autorizado(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // Sem CRON_SECRET configurado, não deixamos a rota aberta por engano.
    return false;
  }
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

// Chamado automaticamente pelo Vercel Cron (ver vercel.json) — 1x/semana.
// Vercel envia "Authorization: Bearer $CRON_SECRET" automaticamente quando
// a variável de ambiente CRON_SECRET está definida no projeto.
export async function GET(request: Request) {
  if (!autorizado(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const resultado = await sincronizarProdutosXbz();
    return NextResponse.json({ ok: true, ...resultado });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      { status: 502 },
    );
  }
}

// Disparo manual (ex: painel interno, ou `curl` autenticado) — mesma
// autenticação, útil se precisar forçar uma sincronização fora do cron
// semanal. Lembre-se do limite de 24 chamadas/dia compartilhado com o ERP.
export async function POST(request: Request) {
  return GET(request);
}
