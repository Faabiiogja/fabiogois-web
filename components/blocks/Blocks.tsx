import type { Block } from "@/lib/aem/types";
import { aueContainer } from "@/lib/aem/ue";
import { Hero } from "./Hero";
import { TextBlock } from "./TextBlock";

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div {...aueContainer("blocks", "blocks", "Blocks")}>
      {blocks.map((block) => {
        switch (block.__typename) {
          case "HeroModel":
            return <Hero key={block._path} block={block} />;
          case "TextBlockModel":
            return <TextBlock key={block._path} block={block} />;
        }
      })}
    </div>
  );
}
