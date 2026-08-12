import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, criarSessionToken, verificarSenhaAdmin } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const senha = typeof body?.senha === "string" ? body.senha : "";

  if (!verificarSenhaAdmin(senha)) {
    return NextResponse.json({ ok: false, error: "Senha incorreta" }, { status: 401 });
  }

  cookies().set(ADMIN_COOKIE_NAME, criarSessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });

  return NextResponse.json({ ok: true });
}
