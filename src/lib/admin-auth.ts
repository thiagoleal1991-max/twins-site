import crypto from "node:crypto";
import { cookies } from "next/headers";

// Autenticação simples pro painel /admin — sem biblioteca externa, sem
// cadastro de usuários. Uma senha única (ADMIN_PASSWORD, variável de
// ambiente), sessão em cookie assinado (HMAC) com validade de 7 dias.
// Suficiente pro uso interno da equipe da Twins.

export const ADMIN_COOKIE_NAME = "twins_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 dias

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET não configurado. Defina no .env (local) ou nas variáveis de ambiente da Vercel.",
    );
  }
  return secret;
}

function assinar(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function criarSessionToken(): string {
  const expira = Date.now() + SESSION_TTL_MS;
  const payload = `admin:${expira}`;
  return `${payload}.${assinar(payload)}`;
}

export function validarSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, assinatura] = token.split(".");
  if (!payload || !assinatura) return false;

  // Comparação em tempo constante pra evitar timing attack
  const esperado = Buffer.from(assinar(payload));
  const recebido = Buffer.from(assinatura);
  if (esperado.length !== recebido.length || !crypto.timingSafeEqual(esperado, recebido)) {
    return false;
  }

  const expira = Number(payload.split(":")[1]);
  return Number.isFinite(expira) && Date.now() < expira;
}

/** Usado dentro de Server Actions do /admin — defesa extra, além do layout
 * protegido, contra alguém chamar a action diretamente. */
export function requireAdmin(): void {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  if (!validarSessionToken(token)) {
    throw new Error("Não autorizado");
  }
}

export function verificarSenhaAdmin(senha: string): boolean {
  const esperada = process.env.ADMIN_PASSWORD;
  if (!esperada) return false;

  const a = Buffer.from(senha);
  const b = Buffer.from(esperada);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
