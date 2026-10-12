"use client";

import { motion, useReducedMotion } from "motion/react";
import NextLink from "next/link";
import type { ReactNode } from "react";

// fabiogois: alterações em relação ao original do SmoothUI estão marcadas com
// "fabiogois:" — reaplique-as se reinstalar o componente. Principais:
// - ícones de marca do lucide-react foram removidos na v1: sem defaults com ícones;
// - attrs (data-aue-*) no footer, nas listas, nos itens e no copyright;
// - next/link nos links internos e largura via `page-container`.

const ANIMATION_DURATION = 0.25;
const HOVER_SCALE = 1.08;
const TAP_SCALE = 0.95;

type Attrs = Record<string, string>;

export interface FooterMinimalProps {
  copyright?: ReactNode;
  links?: Array<{ label: string; href: string; attrs?: Attrs }>;
  logo?: ReactNode;
  socialLinks?: Array<{
    icon: ReactNode;
    href: string;
    label: string;
    attrs?: Attrs;
  }>;
  // fabiogois: atributos extras (instrumentação do Universal Editor).
  attrs?: Attrs;
  linksAttrs?: Attrs;
  socialLinksAttrs?: Attrs;
  copyrightAttrs?: Attrs;
}

export const FooterMinimal = ({
  logo = <span className="font-bold text-foreground text-xl">SmoothUI</span>,
  links = [],
  socialLinks = [],
  copyright = "© 2024 SmoothUI",
  attrs,
  linksAttrs,
  socialLinksAttrs,
  copyrightAttrs,
}: FooterMinimalProps) => {
  const shouldReduceMotion = useReducedMotion();

  const getAnimationProps = () => {
    if (shouldReduceMotion) {
      return {
        animate: { opacity: 1 },
        initial: { opacity: 1 },
        transition: { duration: 0 },
      };
    }

    return {
      initial: { opacity: 0, y: 10 },
      transition: {
        bounce: 0.1,
        duration: ANIMATION_DURATION,
        type: "spring" as const,
      },
      viewport: { once: true },
      whileInView: { opacity: 1, y: 0 },
    };
  };

  const getHoverProps = () => {
    if (shouldReduceMotion) {
      return {};
    }

    return {
      whileHover: { scale: HOVER_SCALE },
      whileTap: { scale: TAP_SCALE },
    };
  };

  return (
    <footer className="mt-auto border-border border-t bg-background" {...attrs}>
      <div className="page-container py-6">
        <motion.div
          {...getAnimationProps()}
          className="flex flex-col items-center justify-between gap-6 md:flex-row"
        >
          {/* Logo and Copyright */}
          <div className="flex items-center gap-3">
            <div>{logo}</div>
            <span className="text-foreground/50">|</span>
            <span className="text-foreground/60 text-sm" {...copyrightAttrs}>
              {copyright}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6" {...linksAttrs}>
            {links.map((link) => (
              <NextLink
                className="relative text-foreground/70 text-sm transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all after:duration-200 hover:text-foreground hover:after:w-full"
                href={link.href}
                key={link.label}
                {...link.attrs}
              >
                {link.label}
              </NextLink>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-4" {...socialLinksAttrs}>
            {socialLinks.map((social) => (
              <motion.a
                aria-label={social.label}
                className="text-foreground/60 transition-colors hover:text-brand"
                href={social.href}
                key={social.label}
                rel="noopener noreferrer"
                target="_blank"
                {...getHoverProps()}
                {...social.attrs}
              >
                {social.icon}
                <span className="sr-only">{social.label}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterMinimal;
