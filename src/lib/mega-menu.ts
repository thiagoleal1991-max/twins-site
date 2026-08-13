import { listarCategoriasDb } from "./categories";

// Agrupamento temático das categorias oficiais da XBZ pro mega-menu do
// catálogo — replica o protótipo (reference/twins-nav-categorias-prototipo.html)
// enviado pela Twins. É uma lista estática (mesmo espírito de
// src/lib/categorize.ts): fácil de ajustar se a Twins criar/renomear uma
// categoria em /admin/categorias.
//
// "Verão" fica de fora dos 6 temas do protótipo — decisão da Twins, já que
// lá ela é tratada como campanha sazonal (chip separado), não como grupo de
// categoria. Vira um 7º grupo só pra ela.
const GRUPOS_CATEGORIA: { nome: string; categorias: string[] }[] = [
  {
    nome: "Escritório & Papelaria",
    categorias: [
      "Blocos e Cadernetas",
      "Canetas",
      "Conjuntos Executivos",
      "Escritório",
      "Estojos",
      "Lápis e Lapiseiras",
      "Pastas",
      "Plaquinhas",
      "Porta Canetas",
      "Porta-documentos e ID",
    ],
  },
  {
    nome: "Tecnologia",
    categorias: [
      "Acessórios p/ Celular",
      "Caixas de Som",
      "Carregadores",
      "Fones de Ouvido",
      "Informática e Telefonia",
      "Microfones",
      "Pen Drives",
    ],
  },
  {
    nome: "Casa, Cozinha & Bebidas",
    categorias: [
      "Bar e Bebidas",
      "Canecas",
      "Copos",
      "Squeezes e Garrafas",
      "Bolsas Térmicas",
      "Kit Churrasco",
      "Kit Queijo",
      "Petisqueiras",
      "Tábuas",
      "Casa",
      "Cozinha",
      "Espelhos",
      "Lanternas e Luminárias",
      "Porta Retratos",
      "Umidificadores",
    ],
  },
  {
    nome: "Moda & Acessórios Pessoais",
    categorias: [
      "Linha Feminina",
      "Linha Masculina",
      "Moda e Estilo",
      "Nécessaires",
      "Malas Mochilas Bolsas",
      "Sacolas e Sacochilas",
      "Relógios",
      "Chaveiros",
      "Guarda-Chuva",
      "Cuidados Pessoais",
    ],
  },
  {
    nome: "Ao Ar Livre & Diversão",
    categorias: ["Esporte e Jogos", "Brinquedos", "Linha Pet", "Acessórios para Carros"],
  },
  {
    nome: "Sustentável & Ferramentas",
    categorias: ["Linha Ecológica", "Ferramentas", "Outros"],
  },
  {
    nome: "Verão",
    categorias: ["Verão"],
  },
];

export interface GrupoMegaMenu {
  nome: string;
  categorias: { nome: string; ordem: number }[];
}

/**
 * Categorias do banco, agrupadas nos temas do mega-menu. Categorias que a
 * Twins criar em /admin/categorias sem estar em nenhum grupo acima caem no
 * último grupo ("Sustentável & Ferramentas", junto com "Outros") em vez de
 * desaparecer — mas o ideal é adicionar elas em GRUPOS_CATEGORIA acima.
 */
export async function listarMegaMenu(): Promise<GrupoMegaMenu[]> {
  const categoriasDb = await listarCategoriasDb();
  const nomesConhecidos = new Set(GRUPOS_CATEGORIA.flatMap((g) => g.categorias));

  const grupos: GrupoMegaMenu[] = GRUPOS_CATEGORIA.map((g) => ({
    nome: g.nome,
    categorias: categoriasDb
      .filter((c) => g.categorias.includes(c.nome))
      .map((c) => ({ nome: c.nome, ordem: c.ordem })),
  }));

  const orfas = categoriasDb.filter((c) => !nomesConhecidos.has(c.nome));
  if (orfas.length > 0) {
    grupos[grupos.length - 2].categorias.push(...orfas.map((c) => ({ nome: c.nome, ordem: c.ordem })));
  }

  return grupos.filter((g) => g.categorias.length > 0);
}
