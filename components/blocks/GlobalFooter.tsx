import { SiteFooter } from "@/components/layout/SiteFooter";
import { getGlobal } from "@/lib/aem/client";
import { aueContainer, aueFragment, aueProp } from "@/lib/aem/ue";
import { toNavItems } from "./nav-items";

export async function GlobalFooter() {
  const { header, footer } = await getGlobal();
  if (!footer) return null;

  return (
    <SiteFooter
      attrs={aueFragment(footer, "Footer")}
      // O nome do site é editado no fragment do header.
      logo={<span className="text-xl font-bold text-foreground">{header?.siteName}</span>}
      links={toNavItems(footer.links)}
      linksAttrs={aueContainer("links", "links", "Links")}
      socialLinks={toNavItems(footer.socialLinks)}
      socialLinksAttrs={aueContainer("socialLinks", "links", "Social Links")}
      copyright={footer.copyright}
      copyrightAttrs={aueProp("copyright", "text", "Copyright")}
    />
  );
}
