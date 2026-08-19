import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { temaEfetivo } from "@/lib/tema";

const WHATSAPP_LINK =
  "https://wa.me/5553984554951?text=Ol%C3%A1!%20Quero%20um%20or%C3%A7amento%20para%20minha%20empresa.";

// Precisa reler `temaSite` do banco a cada request (não é preferência de
// visitante, é config de marca — ver src/lib/tema.ts) — sem isso, o Next
// pré-renderiza a home como estática no build e o tema fica congelado no
// valor de quando o site foi buildado pela última vez.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const tema = await temaEfetivo("geral");
  const footerLogo = tema === "claro" ? "/assets/logo-roxa.svg" : "/assets/logo-branca.svg";

  return (
    <>
      <ScrollReveal />

      <section className="hero dotted">
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow">Soluções corporativas personalizadas</div>
            <h1>
              Potencializamos o valor das <span className="accent">empresas e eventos</span> através de nossas
              soluções e produtos personalizados.
            </h1>
            <p className="lede">
              Onboarding, reconhecimento e eventos corporativos com produção própria: gravação a laser, impressão
              3D, estamparia têxtil e encadernação. Curadoria estratégica, prazo garantido.
            </p>
            <div className="hero-ctas">
              <a className="btn-wpp" href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
                Solicitar orçamento agora
              </a>
              <Link className="btn-ghost" href="/catalogo">
                Ver catálogo
              </Link>
            </div>
            <div className="stat-row">
              <div className="stat">
                <b>+5 anos</b>
                <span>de mercado</span>
              </div>
              <div className="stat">
                <b>+5 mil</b>
                <span>itens em catálogo</span>
              </div>
              <div className="stat">
                <b>+2 milhões</b>
                <span>faturados em personalização</span>
              </div>
            </div>
          </div>

          <div className="laser-stage">
            <div className="laser-ring" />
            <img className="isotipo-img" src="/assets/isotipo-roxo.svg" alt="Isotipo Twins" />
          </div>
        </div>
      </section>

      <section className="section problems-section dotted" id="problemas">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="kicker">O que sua empresa provavelmente já enfrentou</div>
            <h2>Três problemas comuns quando o assunto é brinde corporativo</h2>
            <p>
              Sem planejamento estratégico e curadoria adequada, o brinde perde a função — vira só mais um objeto
              esquecido na gaveta.
            </p>
          </div>
          <div className="problem-grid reveal">
            <div className="problem-card">
              <div className="problem-num">01</div>
              <h3>Falta de criatividade</h3>
              <p>Empresas não sabem o que escolher para fugir do óbvio e criar valor real.</p>
            </div>
            <div className="problem-card">
              <div className="problem-num">02</div>
              <h3>Problemas com prazo</h3>
              <p>O medo constante de que o material não seja entregue a tempo do evento.</p>
            </div>
            <div className="problem-card">
              <div className="problem-num">03</div>
              <h3>Baixa qualidade e impacto</h3>
              <p>Brindes frágeis, mal feitos, que não refletem a excelência da marca.</p>
            </div>
          </div>
          <p className="destino reveal">
            &ldquo;Muitas vezes, o brinde vira apenas mais um objeto inútil, rapidamente esquecido no fundo de uma
            gaveta.&rdquo; — é esse destino que a Twins existe para evitar.
          </p>
        </div>
      </section>

      <section className="section" id="solucoes">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="kicker">Soluções de ponta a ponta</div>
            <h2>Não vendemos brindes. Atuamos como parceiros estratégicos.</h2>
            <p>Análise de perfil, curadoria de produto, compromisso com prazo acima de tudo e entrega com cuidado.</p>
          </div>
          <div className="solutions-grid reveal">
            <div className="solution-card">
              <div className="sol-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3>Onboarding & Equipes</h3>
              <p>
                Kits de integração completos para dar as boas-vindas a novos talentos e campanhas internas de
                incentivo focadas em produtividade.
              </p>
            </div>
            <div className="solution-card">
              <div className="sol-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <circle cx="12" cy="8" r="6" />
                  <path d="M8.2 13.5 7 22l5-3 5 3-1.2-8.5" />
                </svg>
              </div>
              <h3>Reconhecimento</h3>
              <p>Troféus personalizados, medalhas e placas focadas em premiar e celebrar as metas atingidas internamente.</p>
            </div>
            <div className="solution-card">
              <div className="sol-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1M9 13h1m4 0h1M9 17h1m4 0h1" />
                </svg>
              </div>
              <h3>Eventos & Ativações</h3>
              <p>
                Soluções para grandes eventos corporativos, feiras, workshops e ações de relacionamento com clientes
                de alto valor.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="diferenciais">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="kicker">O que a Twins faz diferente</div>
            <h2>Produção própria, do início ao fim</h2>
          </div>
          <div className="diff-list reveal">
            <div className="diff-item">
              <div className="diff-check">✓</div>
              <div>
                <h4>Gravação a laser</h4>
                <p>Metal, couro, madeira e acrílico — tudo produzido internamente.</p>
              </div>
            </div>
            <div className="diff-item">
              <div className="diff-check">✓</div>
              <div>
                <h4>Impressão 3D</h4>
                <p>Peças exclusivas sem depender de terceiros.</p>
              </div>
            </div>
            <div className="diff-item">
              <div className="diff-check">✓</div>
              <div>
                <h4>Estamparia têxtil (DTF)</h4>
                <p>Camisetas, brindes têxteis e uniformes personalizados.</p>
              </div>
            </div>
            <div className="diff-item">
              <div className="diff-check">✓</div>
              <div>
                <h4>Encadernação e cartonagem</h4>
                <p>Cadernos, kits e materiais impressos com acabamento profissional.</p>
              </div>
            </div>
            <div className="diff-item">
              <div className="diff-check">✓</div>
              <div>
                <h4>Compromisso com prazo acima de tudo</h4>
                <p>O medo de atraso não faz parte da experiência com a Twins.</p>
              </div>
            </div>
            <div className="diff-item">
              <div className="diff-check">✓</div>
              <div>
                <h4>Curadoria estratégica</h4>
                <p>Indicamos o produto certo pro objetivo certo — não empurramos catálogo.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section persona-section dotted" id="sobre">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="kicker">Pra quem a Twins trabalha</div>
            <h2>Se você reconhece esse cenário, a gente já entendeu seu problema</h2>
          </div>
          <div className="persona-grid reveal">
            <div className="persona-card">
              <div className="persona-role">RH & Endomarketing</div>
              <h3>&ldquo;Precisamos engajar nossa equipe.&rdquo;</h3>
              <p>Kits de integração e campanhas de incentivo focadas em produtividade, entregues com agilidade via WhatsApp.</p>
            </div>
            <div className="persona-card">
              <div className="persona-role">Marketing</div>
              <h3>&ldquo;Precisa ter cara de presente.&rdquo;</h3>
              <p>Brindes com identidade visual moderna, fotogênicos e alinhados à cultura da sua marca.</p>
            </div>
            <div className="persona-card">
              <div className="persona-role">Eventos</div>
              <h3>&ldquo;Preciso de um parceiro que entenda o padrão da marca.&rdquo;</h3>
              <p>Curadoria de alta qualidade, embalagem premium e atendimento consultivo do início ao fim.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="manifesto">
        <div className="wrap">
          <blockquote className="reveal">
            &ldquo;Na Twins, acreditamos que um produto personalizado não deve apenas carregar uma marca. Ele deve
            gerar conexão, reconhecimento e lembrança.&rdquo;
          </blockquote>
          <cite>— Thiago Leal, fundador da Twins</cite>
        </div>
      </section>

      <section className="section">
        <div className="final-cta reveal">
          <h2>Vamos planejar a próxima ação da sua empresa?</h2>
          <p>Fale agora com nosso time pelo WhatsApp e receba uma curadoria sob medida para o seu objetivo.</p>
          <a className="btn-wpp" href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
            Solicitar orçamento no WhatsApp
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <img src={footerLogo} alt="Twins Artigos Personalizados" className="footer-logo-img" />
              <p style={{ color: "var(--cream-dim)", fontSize: 13.5, marginTop: 10, maxWidth: 260 }}>
                Potencializar o valor das empresas e eventos através de soluções e produtos personalizados.
              </p>
            </div>
            <div className="footer-cols">
              <div className="footer-col">
                <h5>Navegação</h5>
                <Link href="/#solucoes">Soluções</Link>
                <Link href="/catalogo">Catálogo</Link>
                <Link href="/#diferenciais">Diferenciais</Link>
                <Link href="/#sobre">Sobre</Link>
              </div>
              <div className="footer-col">
                <h5>Contato</h5>
                <a href="https://wa.me/5553984554951" target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
                <a href="https://instagram.com/twinsartigospersonalizados" target="_blank" rel="noreferrer">
                  @twinsartigospersonalizados
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Twins Artigos Personalizados — Pelotas, RS</span>
            <span>Feito com produção própria, do início ao fim.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
