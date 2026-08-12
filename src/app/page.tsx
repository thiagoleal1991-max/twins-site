import Link from "next/link";

// Home provisória — o design final (protótipo com a identidade visual da
// marca) ainda vai ser aplicado aqui. Por ora, foco é a arquitetura do
// catálogo/orçamento funcionando de ponta a ponta.
export default function HomePage() {
  return (
    <main className="container">
      <span className="badge-dev">🚧 Site em construção — design final ainda não aplicado</span>
      <h1>Twins Artigos Personalizados</h1>
      <p>
        Soluções corporativas de brindes personalizados — produção própria, gravação a laser,
        impressão 3D, estamparia têxtil e encadernação.
      </p>
      <p>
        <Link className="btn" href="/catalogo">
          Ver catálogo de produtos
        </Link>
      </p>
    </main>
  );
}
