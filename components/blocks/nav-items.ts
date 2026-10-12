import type { NavItem } from "@/components/layout/NavLink";
import type { Link } from "@/lib/aem/types";
import { aueFragment } from "@/lib/aem/ue";

/** Converte fragments `link` em itens de navegação instrumentados para o UE. */
export function toNavItems(links: Link[] | null): NavItem[] {
  return (links ?? []).map((link) => ({
    label: link.label,
    href: link.url,
    attrs: {
      ...aueFragment(link, link.label),
      "data-aue-prop": "label",
    },
  }));
}
