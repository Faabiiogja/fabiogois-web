import { aemHeaders, aemUrl } from "@/lib/aem/client";

// Proxy de assets do DAM: o author exige autenticação, então o servidor busca
// o binário com as credenciais e repassa ao navegador.
export async function GET(_req: Request, ctx: RouteContext<"/aem/[...path]">) {
  const { path } = await ctx.params;
  if (path[0] !== "content" || path[1] !== "dam") {
    return new Response("Not found", { status: 404 });
  }

  const res = await fetch(aemUrl(`/${path.map(encodeURIComponent).join("/")}`), {
    headers: aemHeaders(),
  });
  if (!res.ok) {
    return new Response("Not found", { status: res.status });
  }
  return new Response(res.body, {
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "application/octet-stream",
      "Cache-Control": "no-store",
    },
  });
}
