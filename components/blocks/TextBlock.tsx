import type { TextBlock as TextBlockData } from "@/lib/aem/types";
import { aueFragment, aueProp } from "@/lib/aem/ue";

export function TextBlock({ block }: { block: TextBlockData }) {
  return (
    <section {...aueFragment(block, "Text Block")} className="py-8">
      <h2
        {...aueProp("title", "text", "Title")}
        className="mb-4 text-2xl font-semibold"
      >
        {block.title}
      </h2>
      <div
        {...aueProp("body", "richtext", "Body")}
        className="prose leading-7 [&_p]:mb-4"
        // HTML vem do rich text do Content Fragment (conteúdo do próprio author).
        dangerouslySetInnerHTML={{ __html: block.body?.html ?? "" }}
      />
    </section>
  );
}
