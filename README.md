# Twins Artigos Personalizados — Site institucional

Site estático (HTML/CSS/JS puro, sem build) da Twins Artigos Personalizados.

## Deploy no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login (pode usar sua conta GitHub).
2. Clique em **Add New… → Project**.
3. Importe o repositório `thiagoleal1991-max/twins-site`.
4. Framework Preset: **Other** (site estático, sem build necessário) — o Vercel detecta o `index.html` automaticamente. Não é preciso configurar Build Command nem Output Directory.
5. Clique em **Deploy**.

Em poucos segundos o site fica no ar em uma URL do tipo `twins-site.vercel.app`.

## Conectar o domínio twinsartigospersonalizados.com.br

1. No painel do projeto na Vercel, vá em **Settings → Domains**.
2. Digite `twinsartigospersonalizados.com.br` e clique em **Add**.
3. A Vercel vai indicar os registros DNS que precisam ser configurados no seu provedor de domínio (Registro.br, Hostgator, etc.). Normalmente:
   - Um registro **A** apontando para `76.76.21.21`, **ou**
   - Um registro **CNAME** apontando para `cname.vercel-dns.com` (se for usar um subdomínio como `www`).
4. Acesse o painel do seu provedor de domínio (ex: [registro.br](https://registro.br)), vá até a área de DNS/Zona do domínio e adicione o(s) registro(s) indicados pela Vercel.
5. Aguarde a propagação do DNS (pode levar de alguns minutos até 24h). A Vercel emite o certificado SSL automaticamente assim que o DNS estiver correto.
6. Recomenda-se também adicionar `www.twinsartigospersonalizados.com.br` e configurar o redirecionamento (a própria Vercel oferece essa opção ao adicionar o domínio).

## Atualizações futuras

Qualquer push para a branch `main` deste repositório gera um novo deploy automático na Vercel.
