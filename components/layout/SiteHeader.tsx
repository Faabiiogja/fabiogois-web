"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import FloatingNavbar from "@/components/smoothui/floating-navbar";
import { MobileNav } from "./MobileNav";
import { NavLink, type NavItem } from "./NavLink";

type SiteHeaderProps = {
  brand: ReactNode;
  items: NavItem[];
  menuTitle: string;
  /** Atributos do header (ex.: fragment do UE). */
  attrs?: Record<string, string>;
  /** Atributos da lista de navegação (ex.: container do UE). */
  navAttrs?: Record<string, string>;
};

export function SiteHeader({ brand, items, menuTitle, attrs, navAttrs }: SiteHeaderProps) {
  const pathname = usePathname();
  const activeItem = items.find((item) => item.href === pathname);

  return (
    <>
      <FloatingNavbar
        className="fixed max-w-[calc(100%-2rem)]"
        attrs={attrs}
        listAttrs={navAttrs}
        listClassName="hidden md:flex"
        activeId={activeItem ? activeItem.href + activeItem.label : ""}
        logo={
          <NavLink href="/" className="flex items-center gap-2 px-2 font-semibold tracking-tight">
            {brand}
          </NavLink>
        }
        items={items.map((item) => ({
          id: item.href + item.label,
          label: item.label,
          href: item.href,
          attrs: item.attrs,
        }))}
        actions={<MobileNav title={menuTitle} items={items} className="md:hidden" />}
      />
      {/* Reserva o espaço da navbar flutuante (position: fixed) no topo da página. */}
      <div aria-hidden="true" className="h-20" />
    </>
  );
}
