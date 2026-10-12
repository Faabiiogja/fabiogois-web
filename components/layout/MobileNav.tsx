"use client";

import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLink, type NavItem } from "./NavLink";

export function MobileNav({
  title,
  items,
  className,
}: {
  title: string;
  items: NavItem[];
  className?: string;
}) {
  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className={className} aria-label="Abrir menu" />}
      >
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {items.map((item) => (
            <SheetClose
              key={item.href + item.label}
              render={<NavLink href={item.href} />}
              className="rounded-md px-3 py-2 text-base font-medium hover:bg-muted"
            >
              {item.label}
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
