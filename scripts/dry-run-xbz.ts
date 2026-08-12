/**
 * Teste isolado: só chama /ProdutosListar (SEM busca) e mostra quantos
 * produtos vieram — não grava nada no banco, não precisa de DATABASE_URL.
 *
 * Objetivo: confirmar se a chamada sem `busca` retorna o catálogo completo
 * (+5 mil itens esperados) ou se vem paginado/truncado.
 *
 * ⚠️ Isso consome 1 das 24 chamadas diárias (compartilhadas com o ERP).
 *
 * Uso: npm run dry-run:xbz
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
  const { fetchXbzProdutos } = await import("../src/lib/xbz");

  console.log("Chamando GET /ProdutosListar (sem busca)...");
  const inicio = Date.now();
  const produtos = await fetchXbzProdutos();
  const duracaoMs = Date.now() - inicio;

  console.log(`\n✅ Resposta recebida em ${duracaoMs}ms`);
  console.log(`Total de produtos retornados: ${produtos.length}`);

  if (produtos.length > 0) {
    console.log("\nPrimeiros 3 produtos (amostra):");
    console.log(JSON.stringify(produtos.slice(0, 3), null, 2));

    const idsUnicos = new Set(produtos.map((p) => p.id)).size;
    console.log(`\nIDs únicos: ${idsUnicos} (deveria ser igual ao total, senão há duplicidade)`);
  }

  console.log(
    produtos.length >= 4000
      ? "\n👉 Parece o catálogo completo (bate com os '+5 mil itens' esperados)."
      : "\n👉 Número bem abaixo de 5 mil — pode estar paginado ou limitado. Investigar antes de confiar no cron semanal.",
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Falhou:", error.message ?? error);
    process.exit(1);
  });
