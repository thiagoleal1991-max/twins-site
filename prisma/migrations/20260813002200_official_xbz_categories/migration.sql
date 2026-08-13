-- Substitui a lista provisória de 9 categorias pelas 49 categorias OFICIAIS
-- do site público da XBZ (xbzbrindes.com.br/brindes/...), repassada pela
-- Twins, + "Outros" (nossa categoria de fallback pra quando nada bate na
-- classificação automática, ver src/lib/categorize.ts).
--
-- Categoria não tem FK de Product (é só uma tabela auxiliar pra listar as
-- opções válidas no /admin), então é seguro trocar o conteúdo dela direto.
-- O que precisa de cuidado é: produtos com categoriaManual apontando pra uma
-- categoria antiga que deixou de existir ficariam "órfãos" — voltam pra
-- classificação automática (mesmo tratamento usado em excluirCategoria()).

DELETE FROM "Category";

INSERT INTO "Category" ("nome", "ordem", "updatedAt") VALUES
  ('Verão', 1, CURRENT_TIMESTAMP),
  ('Acessórios p/ Celular', 2, CURRENT_TIMESTAMP),
  ('Acessórios para Carros', 3, CURRENT_TIMESTAMP),
  ('Bar e Bebidas', 4, CURRENT_TIMESTAMP),
  ('Blocos e Cadernetas', 5, CURRENT_TIMESTAMP),
  ('Bolsas Térmicas', 6, CURRENT_TIMESTAMP),
  ('Brinquedos', 7, CURRENT_TIMESTAMP),
  ('Caixas de Som', 8, CURRENT_TIMESTAMP),
  ('Canecas', 9, CURRENT_TIMESTAMP),
  ('Canetas', 10, CURRENT_TIMESTAMP),
  ('Carregadores', 11, CURRENT_TIMESTAMP),
  ('Casa', 12, CURRENT_TIMESTAMP),
  ('Chaveiros', 13, CURRENT_TIMESTAMP),
  ('Conjuntos Executivos', 14, CURRENT_TIMESTAMP),
  ('Copos', 15, CURRENT_TIMESTAMP),
  ('Cozinha', 16, CURRENT_TIMESTAMP),
  ('Cuidados Pessoais', 17, CURRENT_TIMESTAMP),
  ('Escritório', 18, CURRENT_TIMESTAMP),
  ('Espelhos', 19, CURRENT_TIMESTAMP),
  ('Esporte e Jogos', 20, CURRENT_TIMESTAMP),
  ('Estojos', 21, CURRENT_TIMESTAMP),
  ('Ferramentas', 22, CURRENT_TIMESTAMP),
  ('Fones de Ouvido', 23, CURRENT_TIMESTAMP),
  ('Guarda-Chuva', 24, CURRENT_TIMESTAMP),
  ('Informática e Telefonia', 25, CURRENT_TIMESTAMP),
  ('Kit Churrasco', 26, CURRENT_TIMESTAMP),
  ('Kit Queijo', 27, CURRENT_TIMESTAMP),
  ('Lanternas e Luminárias', 28, CURRENT_TIMESTAMP),
  ('Lápis e Lapiseiras', 29, CURRENT_TIMESTAMP),
  ('Linha Ecológica', 30, CURRENT_TIMESTAMP),
  ('Linha Feminina', 31, CURRENT_TIMESTAMP),
  ('Linha Masculina', 32, CURRENT_TIMESTAMP),
  ('Linha Pet', 33, CURRENT_TIMESTAMP),
  ('Malas Mochilas Bolsas', 34, CURRENT_TIMESTAMP),
  ('Microfones', 35, CURRENT_TIMESTAMP),
  ('Moda e Estilo', 36, CURRENT_TIMESTAMP),
  ('Nécessaires', 37, CURRENT_TIMESTAMP),
  ('Pastas', 38, CURRENT_TIMESTAMP),
  ('Pen Drives', 39, CURRENT_TIMESTAMP),
  ('Petisqueiras', 40, CURRENT_TIMESTAMP),
  ('Plaquinhas', 41, CURRENT_TIMESTAMP),
  ('Porta Canetas', 42, CURRENT_TIMESTAMP),
  ('Porta Retratos', 43, CURRENT_TIMESTAMP),
  ('Porta-documentos e ID', 44, CURRENT_TIMESTAMP),
  ('Relógios', 45, CURRENT_TIMESTAMP),
  ('Sacolas e Sacochilas', 46, CURRENT_TIMESTAMP),
  ('Squeezes e Garrafas', 47, CURRENT_TIMESTAMP),
  ('Tábuas', 48, CURRENT_TIMESTAMP),
  ('Umidificadores', 49, CURRENT_TIMESTAMP),
  ('Outros', 50, CURRENT_TIMESTAMP);

-- Produtos ajustados manualmente pra uma categoria que não existe mais
-- (uma das 9 antigas) voltam a usar a classificação automática.
UPDATE "Product"
SET "categoriaManual" = NULL
WHERE "categoriaManual" IS NOT NULL
  AND "categoriaManual" NOT IN (
    'Verão', 'Acessórios p/ Celular', 'Acessórios para Carros', 'Bar e Bebidas',
    'Blocos e Cadernetas', 'Bolsas Térmicas', 'Brinquedos', 'Caixas de Som',
    'Canecas', 'Canetas', 'Carregadores', 'Casa', 'Chaveiros',
    'Conjuntos Executivos', 'Copos', 'Cozinha', 'Cuidados Pessoais', 'Escritório',
    'Espelhos', 'Esporte e Jogos', 'Estojos', 'Ferramentas', 'Fones de Ouvido',
    'Guarda-Chuva', 'Informática e Telefonia', 'Kit Churrasco', 'Kit Queijo',
    'Lanternas e Luminárias', 'Lápis e Lapiseiras', 'Linha Ecológica',
    'Linha Feminina', 'Linha Masculina', 'Linha Pet', 'Malas Mochilas Bolsas',
    'Microfones', 'Moda e Estilo', 'Nécessaires', 'Pastas', 'Pen Drives',
    'Petisqueiras', 'Plaquinhas', 'Porta Canetas', 'Porta Retratos',
    'Porta-documentos e ID', 'Relógios', 'Sacolas e Sacochilas',
    'Squeezes e Garrafas', 'Tábuas', 'Umidificadores', 'Outros'
  );

-- "categoria" (automática) desatualizada com nomes antigos vai se
-- autocorrigir sozinha na próxima sincronização (ela sempre reescreve
-- "categoria" com base nas regras atuais de src/lib/categorize.ts) — não
-- precisa de UPDATE aqui.
