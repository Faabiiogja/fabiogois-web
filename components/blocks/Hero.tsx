import { assetSrc } from "@/lib/aem/client";
import type { HeroBlock } from "@/lib/aem/types";
import { aueFragment, aueProp } from "@/lib/aem/ue";

export function Hero({ block }: { block: HeroBlock }) {
  return (
    <section
      {...aueFragment(block, "Hero")}
      className="flex flex-col gap-6 py-16"
    >
      {block.image && (
        // eslint-disable-next-line @next/next/no-img-element -- assets vêm do proxy do AEM
        <img
          {...aueProp("image", "media", "Image")}
          src={assetSrc(block.image._path)}
          alt=""
          width={block.image.width}
          height={block.image.height}
          className="w-full rounded-lg object-cover"
        />
      )}
      <h1
        {...aueProp("title", "text", "Title")}
        className="text-4xl font-semibold tracking-tight"
      >
        {block.title}
      </h1>
      <p
        {...aueProp("subtitle", "text", "Subtitle")}
        className="text-lg text-zinc-600 dark:text-zinc-400"
      >
        {block.subtitle?.plaintext}
      </p>
      {block.ctaLink && (
        <a
          href={block.ctaLink}
          {...aueProp("ctaLabel", "text", "CTA Label")}
          className="self-start rounded-full bg-foreground px-5 py-3 text-background"
        >
          {block.ctaLabel}
        </a>
      )}
    </section>
  );
}
