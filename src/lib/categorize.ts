// Classificação automática de categoria a partir do nome + descrição do produto.
//
// A API da XBZ não retorna categoria — só descrição e códigos. As categorias
// abaixo são as 49 categorias OFICIAIS do site público da XBZ
// (xbzbrindes.com.br/brindes/...), repassadas pela Twins — usamos o próprio
// nome de cada uma (+ sinônimos comuns) como palavra-chave contra o
// nome/descrição do produto. É uma heurística e vai errar alguns casos; o
// que sobrar em "Outros" (ou mal classificado) se ajusta manualmente no
// painel /admin.
//
// Critério de desempate quando o texto tem palavra-chave de mais de uma
// categoria (comum em kit/combo, ex: "bloco de notas com caneta"): ganha a
// que aparece mais CEDO no texto (ver `melhorRegra` mais abaixo) — o
// substantivo principal do produto normalmente vem no começo do
// nome/descrição, e o que acompanha vem depois. A ordem das regras aqui no
// array só desempata em caso de empate de posição (ex: "garrafa térmica"
// bate com a frase "garrafa térmica" E com a palavra solta "garrafa", nas
// duas a partir da mesma posição) — por isso categorias de produto bem
// específico (pen drive, caneca, chaveiro...) continuam vindo antes de
// categorias mais genéricas/temáticas (Casa, Moda e Estilo, Verão...).

interface CategoryRule {
  categoria: string;
  palavrasChave: string[];
}

const REGRAS: CategoryRule[] = [
  { categoria: "Pen Drives", palavrasChave: ["pen drive", "pendrive", "flash drive"] },
  { categoria: "Caixas de Som", palavrasChave: ["caixa de som", "caixinha de som", "speaker"] },
  {
    categoria: "Fones de Ouvido",
    palavrasChave: ["fone de ouvido", "fone bluetooth", "headset", "earphone", "airpod", "fone sem fio"],
  },
  { categoria: "Microfones", palavrasChave: ["microfone"] },
  {
    categoria: "Carregadores",
    palavrasChave: [
      "carregador",
      "power bank",
      "powerbank",
      "carregador portatil",
      "carregador portátil",
      "carregador sem fio",
      "carregador veicular",
    ],
  },
  {
    categoria: "Acessórios p/ Celular",
    palavrasChave: [
      "capa de celular",
      "capinha",
      "suporte para celular",
      "suporte de celular",
      "pop socket",
      "popsocket",
      "anel de celular",
      "case para celular",
      "case para smartphone",
    ],
  },
  {
    categoria: "Informática e Telefonia",
    palavrasChave: ["mouse pad", "mousepad", "mouse", "teclado", "cabo usb", "hub usb", "webcam", "adaptador usb"],
  },
  { categoria: "Relógios", palavrasChave: ["relógio", "relogio", "smartwatch"] },
  { categoria: "Canecas", palavrasChave: ["caneca"] },
  {
    // Antes de "Squeezes e Garrafas": "abridor de garrafa" contém "garrafa",
    // então precisa ser checado primeiro pra não cair na categoria errada.
    categoria: "Bar e Bebidas",
    palavrasChave: ["abridor de garrafa", "saca-rolha", "saca rolha", "coqueteleira", "balde de gelo", "taça de vinho", "taca de vinho", "taça", "taca"],
  },
  {
    categoria: "Squeezes e Garrafas",
    palavrasChave: ["squeeze", "garrafa", "garrafinha", "copo termico", "copo térmico"],
  },
  { categoria: "Copos", palavrasChave: ["copo"] },
  {
    categoria: "Bolsas Térmicas",
    palavrasChave: ["bolsa termica", "bolsa térmica", "sacola termica", "sacola térmica"],
  },
  {
    categoria: "Kit Churrasco",
    palavrasChave: ["kit churrasco", "churrasco", "espeto", "faca churrasqueira", "avental de churrasco"],
  },
  { categoria: "Kit Queijo", palavrasChave: ["kit queijo", "tábua de queijo", "tabua de queijo"] },
  { categoria: "Tábuas", palavrasChave: ["tábua", "tabua"] },
  { categoria: "Petisqueiras", palavrasChave: ["petisqueira", "petisco"] },
  {
    categoria: "Cozinha",
    palavrasChave: ["cozinha", "utensílio de cozinha", "utensilio de cozinha", "pegador", "escorredor", "descascador"],
  },
  { categoria: "Umidificadores", palavrasChave: ["umidificador"] },
  {
    categoria: "Lanternas e Luminárias",
    palavrasChave: ["lanterna", "luminária", "luminaria", "abajur"],
  },
  { categoria: "Espelhos", palavrasChave: ["espelho"] },
  { categoria: "Porta Retratos", palavrasChave: ["porta retrato", "porta-retrato"] },
  { categoria: "Guarda-Chuva", palavrasChave: ["guarda-chuva", "guarda chuva", "sombrinha"] },
  {
    categoria: "Ferramentas",
    palavrasChave: ["kit ferramentas", "ferramenta", "chave de fenda", "alicate", "trena", "martelo", "canivete"],
  },
  {
    categoria: "Acessórios para Carros",
    palavrasChave: [
      "organizador de carro",
      "suporte veicular",
      "aromatizador de carro",
      "kit automotivo",
      "acessório automotivo",
      "acessorio automotivo",
      "veicular",
    ],
  },
  {
    categoria: "Malas Mochilas Bolsas",
    palavrasChave: ["mochila", "mala de viagem", "mala", "bolsa transversal", "bolsa"],
  },
  { categoria: "Sacolas e Sacochilas", palavrasChave: ["sacola", "sacochila", "ecobag"] },
  { categoria: "Nécessaires", palavrasChave: ["necessaire", "nécessaire"] },
  { categoria: "Estojos", palavrasChave: ["estojo"] },
  {
    categoria: "Porta-documentos e ID",
    palavrasChave: [
      "porta documentos",
      "porta-documentos",
      "porta cracha",
      "porta crachá",
      "cordão para crachá",
      "cordao para cracha",
      "crachá",
      "cracha",
    ],
  },
  { categoria: "Pastas", palavrasChave: ["pasta executiva", "pasta para notebook", "pasta"] },
  { categoria: "Chaveiros", palavrasChave: ["chaveiro"] },
  { categoria: "Plaquinhas", palavrasChave: ["plaquinha", "placa"] },
  { categoria: "Porta Canetas", palavrasChave: ["porta caneta", "porta-caneta"] },
  { categoria: "Lápis e Lapiseiras", palavrasChave: ["lápis", "lapis", "lapiseira"] },
  { categoria: "Canetas", palavrasChave: ["caneta"] },
  {
    categoria: "Blocos e Cadernetas",
    palavrasChave: [
      "bloco de notas",
      "bloco de anotações",
      "bloco de anotacoes",
      "bloco adesivo",
      "bloquinho",
      "bloco",
      "caderneta",
      "caderno",
      "agenda",
      "post-it",
    ],
  },
  {
    categoria: "Conjuntos Executivos",
    palavrasChave: ["conjunto executivo", "kit executivo"],
  },
  {
    categoria: "Escritório",
    palavrasChave: ["clips", "grampeador", "organizador de mesa", "escritório", "escritorio"],
  },
  {
    categoria: "Cuidados Pessoais",
    palavrasChave: ["kit higiene", "escova de dente", "protetor labial", "creme hidratante", "sabonete", "kit banho"],
  },
  { categoria: "Linha Pet", palavrasChave: ["pet ", " pet", "cachorro", "gato", "ração", "racao", "coleira"] },
  {
    categoria: "Linha Ecológica",
    palavrasChave: ["ecológico", "ecologico", "sustentável", "sustentavel", "bambu", "reciclado", "biodegradável", "biodegradavel"],
  },
  { categoria: "Brinquedos", palavrasChave: ["brinquedo", "pelúcia", "pelucia", "quebra-cabeça", "quebra cabeça"] },
  {
    categoria: "Esporte e Jogos",
    palavrasChave: ["esporte", "bola de", "jogo de", "baralho", "dominó", "domino", "dado de"],
  },
  {
    categoria: "Verão",
    palavrasChave: ["protetor solar", "óculos de sol", "oculos de sol", "boia", "chapéu de praia", "chapeu de praia", "canga de praia", "toalha de praia"],
  },
  {
    categoria: "Linha Feminina",
    palavrasChave: ["linha feminina", "feminino"],
  },
  {
    categoria: "Linha Masculina",
    palavrasChave: ["linha masculina", "masculino"],
  },
  {
    categoria: "Moda e Estilo",
    palavrasChave: ["boné", "bone", "camiseta", "gorro", "moletom", "colete", "jaqueta"],
  },
  {
    categoria: "Casa",
    palavrasChave: ["casa", "porta-chaves de parede", "organizador de casa", "cabide"],
  },
];

// O nome do produto (ex: "BLOCO DE NOTAS COM CANETA") manda mais do que a
// descrição na hora de classificar — a descrição costuma citar acessórios
// que acompanham o produto (ex: um bloco de notas "que acompanha caneta"),
// e sem essa prioridade esse tipo de produto caía em "Canetas" em vez de
// "Blocos e Cadernetas" só porque a palavra "caneta" aparecia em algum
// lugar do texto combinado. Por isso: primeiro tenta bater com o nome
// sozinho; só cai pra descrição (comportamento antigo) se nada bater lá —
// cobre os casos de nome vazio/incompleto.
//
// Dentro de cada texto (nome ou descrição), o produto/kit combinado ainda é
// um problema: "BLOCO DE ANOTAÇÕES COM CANETA" tem palavra-chave de duas
// categorias diferentes. Quem ganha é a palavra-chave que aparece mais
// CEDO no texto — o substantivo principal do produto normalmente vem no
// começo do nome, e os acessórios/brindes que acompanham (o "com caneta",
// "acompanha bloco de notas" etc.) vêm depois. Em caso de empate (mesma
// posição — ex: "copo" é prefixo de "copo térmico"), desempata pela ordem
// das regras no array acima, que já é curada pra colocar o caso mais
// específico primeiro (ver comentário no topo do arquivo).
function melhorRegra(texto: string): CategoryRule | null {
  let melhor: CategoryRule | null = null;
  let melhorPosicao = Infinity;

  for (const regra of REGRAS) {
    for (const palavra of regra.palavrasChave) {
      const posicao = texto.indexOf(palavra);
      if (posicao !== -1 && posicao < melhorPosicao) {
        melhor = regra;
        melhorPosicao = posicao;
      }
    }
  }

  return melhor;
}

export function categorizar(nome: string, descricao: string): string {
  const nomeTexto = nome.toLowerCase();
  const descricaoTexto = descricao.toLowerCase();

  return melhorRegra(nomeTexto)?.categoria ?? melhorRegra(descricaoTexto)?.categoria ?? "Outros";
}
