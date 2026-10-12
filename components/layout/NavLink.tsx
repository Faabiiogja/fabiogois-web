import NextLink from "next/link";
import type { ComponentProps } from "react";

export type NavItem = {
  label: string;
  href: string;
  /** Atributos extras (ex.: instrumentação `data-aue-*`) aplicados ao `<a>`. */
  attrs?: Record<string, string>;
};

export function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

/** Link que escolhe entre `next/link` (interno) e `<a target="_blank">` (externo). */
export function NavLink({ href, ...props }: ComponentProps<"a"> & { href: string }) {
  if (isExternal(href)) {
    return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
  }
  return <NextLink href={href} {...props} />;
}
