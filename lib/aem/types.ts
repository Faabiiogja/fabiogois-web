// Tipos espelhando a persisted query `fabiogois/page-by-slug`.

export type FragmentMeta = {
  _path: string;
  _variation: string;
};

export type ImageRef = {
  _path: string;
  width?: number;
  height?: number;
};

export type HeroBlock = FragmentMeta & {
  __typename: "HeroModel";
  title: string;
  subtitle: { plaintext: string } | null;
  image: ImageRef | null;
  ctaLabel: string | null;
  ctaLink: string | null;
};

export type TextBlock = FragmentMeta & {
  __typename: "TextBlockModel";
  title: string | null;
  body: { html: string } | null;
};

export type Block = HeroBlock | TextBlock;

export type Page = FragmentMeta & {
  title: string;
  slug: string;
  description: { plaintext: string } | null;
  blocks: Block[] | null;
};
