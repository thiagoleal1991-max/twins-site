// Classificação automática de categoria a partir da descrição do produto.
//
// A API da XBZ não retorna categoria — só descrição e códigos. Em vez de
// deixar tudo em "Outros", classificamos por palavra-chave. Isso é uma
// heurística simples e vai errar alguns casos; ajuste as regras livremente
// conforme formos vendo o catálogo real sincronizado.
//
// Ordem importa: a primeira regra que bater "ganha". Coloque regras mais
// específicas antes de regras genéricas.

interface CategoryRule {
  categoria: string;
  palavrasChave: string[];
}

const REGRAS: CategoryRule[] = [
  {
    categoria: "Canecas e Garrafas",
    palavrasChave: ["caneca", "garrafa", "squeeze", "copo", "termica", "térmica"],
  },
  {
    categoria: "Papelaria",
    palavrasChave: ["caderno", "agenda", "bloco de notas", "caneta", "lapis", "lápis", "marcador", "post-it"],
  },
  {
    categoria: "Tecnologia",
    palavrasChave: ["power bank", "carregador", "fone de ouvido", "pen drive", "pendrive", "mouse", "cabo usb", "caixa de som"],
  },
  {
    categoria: "Vestuário",
    palavrasChave: ["camiseta", "boné", "bone", "jaqueta", "moletom", "gorro", "colete"],
  },
  {
    categoria: "Bolsas e Mochilas",
    palavrasChave: ["mochila", "bolsa", "necessaire", "nécessaire", "sacola"],
  },
  {
    categoria: "Chaveiros e Acessórios",
    palavrasChave: ["chaveiro", "pin", "broche", "porta-cartao", "porta-cartão"],
  },
  {
    categoria: "Casa e Escritório",
    palavrasChave: ["porta-treco", "organizador", "mouse pad", "suporte para celular", "luminaria", "luminária"],
  },
  {
    categoria: "Brindes para Eventos",
    palavrasChave: ["cordao", "cordão", "crachá", "cracha", "pulseira", "bandeira", "banner"],
  },
];

export function categorizar(descricao: string): string {
  const texto = descricao.toLowerCase();

  for (const regra of REGRAS) {
    if (regra.palavrasChave.some((palavra) => texto.includes(palavra))) {
      return regra.categoria;
    }
  }

  return "Outros";
}

export function listarCategorias(): string[] {
  return [...REGRAS.map((r) => r.categoria), "Outros"];
}
