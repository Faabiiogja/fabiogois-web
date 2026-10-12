# fabiogois-web

Front-end Next.js (App Router, Next 16 com Cache Components) do site do Fabio Gois. O conteúdo vem do AEM ([`fabiogois`](../fabiogois/README.md)) como **Content Fragments** via **GraphQL persisted queries**, e as páginas são editáveis no **Universal Editor (UE)**.

## Como funciona

| Arquivo | Papel |
|---|---|
| `app/[[...slug]]/page.tsx` | Rota única: busca a página pelo slug (`/` → `home`) e renderiza os blocos |
| `lib/aem/client.ts` | Chama `/graphql/execute.json/fabiogois/<query>` no AEM (sem cache) |
| `lib/aem/types.ts` | Tipos da query `page-by-slug` |
| `lib/aem/ue.ts` | Helpers dos atributos `data-aue-*` |
| `components/blocks/*` | `Hero`, `TextBlock` e o container `Blocks` (instrumentados para o UE) |
| `app/aem/[...path]/route.ts` | Proxy de imagens do DAM (o author exige login) |
| `app/layout.tsx` | Meta tags `urn:adobe:aue:*` e scripts do UE (só quando `NEXT_PUBLIC_AEM_UE_HOST` está definido) |
| `public/component-*.json` | Definições, modelos e filtros de componentes do UE |

Instrumentação: cada fragment é um `data-aue-type="reference"` com `data-aue-resource="urn:aemconnection:<_path>/jcr:content/data/<_variation>"`, e cada campo um `data-aue-prop`. O painel de propriedades do UE é gerado a partir do modelo do fragment, por isso `component-models.json` fica vazio.

**Novo bloco:** crie o modelo no AEM → adicione um fragmento `... on NovoModel { ... }` na persisted query `page-by-slug` → tipo em `lib/aem/types.ts` → componente em `components/blocks/` → `case` em `Blocks.tsx` → entradas em `component-definition.json` e `component-filters.json`.

## Subindo localmente

Pré-requisitos: Node 20+, o ambiente de `~/Job/aem-sdk` no ar (AEM SDK em `:4502`, proxy HTTPS em `:8443`, UES em `:8000` — ver [`aem-sdk/README.md`](../../aem-sdk/README.md)) e o projeto AEM instalado com uma página `home`.

1. Variáveis de ambiente:
   ```bash
   cp .env.example .env.local
   ```
   | Variável | Local | Uso |
   |---|---|---|
   | `AEM_HOST` | `http://localhost:4502` | AEM de onde o servidor busca conteúdo |
   | `AEM_AUTH` | `admin:admin` | Basic auth do SDK (nunca credenciais reais) |
   | `NEXT_PUBLIC_AEM_UE_HOST` | `https://localhost:8443` | Author visto pelo UE (meta `aemconnection`) |
   | `NEXT_PUBLIC_UE_SERVICE` | `https://localhost:8000` | UES local (meta `config:service`) |
2. Instalar e subir em HTTPS (o UE só abre páginas HTTPS). O script usa o certificado de `~/Job/aem-sdk/universal-editor`:
   ```bash
   npm install
   ```
   ```bash
   npm run dev:ue
   ```
   Sem o UE, `npm run dev` (HTTP) também funciona.
3. No navegador, aceite o certificado autoassinado em `https://localhost:8000/ping`, `https://localhost:8443` e `https://localhost:3000`.
4. Abra o editor em `https://experience.adobe.com/#/aem/editor/canvas/localhost:3000`, faça login com o Adobe ID, clique em **Local Developer Login** e entre com `admin` / `admin`.

### Problemas comuns

- **401 "Backend responded with" no UE**: o token de login não está sendo aceito pelo AEM — confira os ajustes de `TokenAuthenticationHandler` em `aem-sdk/README.md` e refaça o *Local Developer Login*.
- **UE não carrega o iframe**: certificado não aceito em alguma das três URLs, ou `X-Frame-Options` voltou no AEM.
- **Mudou a query/modelo e o front não refletiu**: ver a nota sobre `mode="merge"` no README do projeto AEM.

## Indo para um servidor

O código hoje assume o cenário local (sempre author, Basic auth, sem cache). Para publicar, o recomendado são **dois deployments** do mesmo código:

| | Preview / edição (aberto no UE) | Produção (público) |
|---|---|---|
| Fonte de conteúdo | AEM **author** | AEM **publish** |
| Autenticação | Token de Technical Account (Bearer) | Nenhuma (persisted queries são públicas) |
| Cache | Nenhum (o editor precisa do rascunho) | `"use cache"` + `cacheTag`/`cacheLife`, revalidado por webhook do AEM |
| Scripts/meta do UE | Sim | Não (deixe `NEXT_PUBLIC_AEM_UE_HOST` vazio) |
| Iframe | Permitir `frame-ancestors https://experience.adobe.com` | Pode bloquear |

O que precisa mudar:

1. **Variáveis de ambiente** por deployment:
   - preview: `AEM_HOST=https://author-pXXXX-eYYYY.adobeaemcloud.com`, `NEXT_PUBLIC_AEM_UE_HOST` com a mesma URL do author, **sem** `NEXT_PUBLIC_UE_SERVICE` (a Adobe hospeda o UES);
   - produção: `AEM_HOST=https://publish-pXXXX-eYYYY.adobeaemcloud.com` (ou o domínio do CDN), sem as variáveis do UE.
2. **Autenticação** (`lib/aem/client.ts`): trocar o Basic `AEM_AUTH` por `Authorization: Bearer <token>` gerado a partir das credenciais da Technical Account (Developer Console), renovando o token antes de expirar. Guardar as credenciais como secret do provedor (ex. Vercel).
3. **Cache em produção**: no deployment público, envolver `getPageBySlug` com `"use cache"` e `cacheTag(\`page-${slug}\`)`, e criar um Route Handler que receba um webhook do AEM ao publicar e chame a revalidação da tag. Gerar `generateStaticParams` a partir da query `pages-all`.
4. **Imagens**: no publish, usar `_publishUrl` / `_dynamicUrl` direto (configurando `images.remotePatterns` para usar `next/image`) e manter o proxy `/aem/...` só no preview.
5. **Headers**: no preview, garantir que nada envia `X-Frame-Options: DENY` e definir `Content-Security-Policy: frame-ancestors https://experience.adobe.com`.
6. **CORS no AEM**: incluir os domínios de preview e produção nas configs `CORSPolicyImpl~fabiogois` do projeto AEM.
7. **Universal Editor**: abrir em `https://experience.adobe.com/#/@<org>/aem/editor/canvas/<dominio-de-preview>`; a autenticação passa a ser por IMS (sem *Local Developer Login*).
