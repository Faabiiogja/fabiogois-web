import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Blocks } from "@/components/blocks/Blocks";
import { getPageBySlug } from "@/lib/aem/client";
import { aueFragment } from "@/lib/aem/ue";

// Conteúdo vem do author sem cache: o Universal Editor precisa sempre da versão mais recente.
async function PageContent({ params }: Pick<PageProps<"/[[...slug]]">, "params">) {
  const { slug } = await params;
  const page = await getPageBySlug(slug?.join("/") ?? "home");
  if (!page) notFound();

  return (
    <main {...aueFragment(page, "Page")} className="page-container">
      <Blocks blocks={page.blocks ?? []} />
    </main>
  );
}

export default function Page({ params }: PageProps<"/[[...slug]]">) {
  return (
    <Suspense fallback={<main className="page-container py-16">Carregando…</main>}>
      <PageContent params={params} />
    </Suspense>
  );
}
