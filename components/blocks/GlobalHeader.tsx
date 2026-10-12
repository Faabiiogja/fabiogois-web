import { SiteHeader } from "@/components/layout/SiteHeader";
import { assetSrc, getGlobal } from "@/lib/aem/client";
import { aueContainer, aueFragment, aueProp } from "@/lib/aem/ue";
import { toNavItems } from "./nav-items";

export async function GlobalHeader() {
  const { header } = await getGlobal();
  if (!header) return null;

  return (
    <SiteHeader
      attrs={aueFragment(header, "Header")}
      menuTitle={header.siteName}
      brand={
        <>
          {header.logo && (
            // eslint-disable-next-line @next/next/no-img-element -- assets vêm do proxy do AEM
            <img
              {...aueProp("logo", "media", "Logo")}
              src={assetSrc(header.logo._path)}
              alt=""
              className="h-8 w-auto"
            />
          )}
          <span {...aueProp("siteName", "text", "Site Name")}>{header.siteName}</span>
        </>
      }
      items={toNavItems(header.navItems)}
      navAttrs={aueContainer("navItems", "links", "Navigation")}
    />
  );
}
