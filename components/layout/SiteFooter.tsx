import type { ReactNode } from "react";
import { FooterMinimal } from "@/components/smoothui/footer-4";
import type { NavItem } from "./NavLink";
import { SocialIcon } from "./SocialIcon";

type Attrs = Record<string, string>;

type SiteFooterProps = {
  logo: ReactNode;
  links: NavItem[];
  socialLinks: NavItem[];
  copyright: ReactNode;
  attrs?: Attrs;
  linksAttrs?: Attrs;
  socialLinksAttrs?: Attrs;
  copyrightAttrs?: Attrs;
};

export function SiteFooter({ socialLinks, ...props }: SiteFooterProps) {
  return (
    <FooterMinimal
      {...props}
      socialLinks={socialLinks.map((link) => ({
        ...link,
        icon: <SocialIcon href={link.href} />,
      }))}
    />
  );
}
