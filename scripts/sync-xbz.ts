/**
 * Roda a sincronização com a XBZ manualmente, fora do cron.
 * Uso: npm run sync:xbz
 *
 * Carrega o .env na mão (sem depender de pacote extra) porque este script
 * roda fora do runtime do Next.
 */
import fs from "node:fs";
import path from "node:path";

function carregarEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;

  const conteudo = fs.readFileSync(envPath, "utf-8");
  for (const linha of conteudo.split("\n")) {
    const linhaLimpa = linha.trim();
    if (!linhaLimpa || linhaLimpa.startsWith("#")) continue;
    const [chave, ...resto] = linhaLimpa.split("=");
    if (!chave) continue;
    const valor = resto.join("=").trim();
    if (!(chave in process.env)) process.env[chave] = valor;
  }
}

carregarEnv();

async function main() {
  const { sincronizarProdutosXbz } = await import("../src/lib/sync");
  console.log("Iniciando sincronização com a XBZ...");
  const resultado = await sincronizarProdutosXbz();
  console.log("Concluído:", resultado);
  process.exit(0);
}

main().catch((error) => {
  console.error("Falhou:", error);
  process.exit(1);
});
