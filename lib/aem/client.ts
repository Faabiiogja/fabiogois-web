import type { Page } from "./types";

const AEM_HOST = process.env.AEM_HOST ?? "http://localhost:4502";
const AEM_AUTH = process.env.AEM_AUTH;

export function aemHeaders(): HeadersInit {
  return AEM_AUTH
    ? { Authorization: `Basic ${Buffer.from(AEM_AUTH).toString("base64")}` }
    : {};
}

export function aemUrl(path: string): string {
  return `${AEM_HOST}${path}`;
}

/**
 * Executa uma persisted query do AEM. Variáveis seguem a sintaxe de matriz
 * (`;nome=valor`) usada pelo endpoint `/graphql/execute.json`.
 */
async function persistedQuery<T>(
  name: string,
  variables: Record<string, string> = {},
): Promise<T> {
  const params = Object.entries(variables)
    .map(([k, v]) => `;${k}=${encodeURIComponent(v)}`)
    .join("");
  const res = await fetch(aemUrl(`/graphql/execute.json/fabiogois/${name}${params}`), {
    headers: aemHeaders(),
  });
  if (!res.ok) {
    throw new Error(`AEM persisted query ${name} failed: ${res.status}`);
  }
  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(`AEM persisted query ${name}: ${json.errors[0].message}`);
  }
  return json.data as T;
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const data = await persistedQuery<{ pageList: { items: Page[] } }>(
    "page-by-slug",
    { slug },
  );
  return data.pageList.items[0] ?? null;
}

/** URL pública (via proxy do Next) para um asset do DAM. */
export function assetSrc(damPath: string): string {
  return `/aem${damPath}`;
}
