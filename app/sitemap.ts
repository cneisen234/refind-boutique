// Every public page (docs/site-conventions.md §6, in Pilot Light): Pilot Light
// reads them as Lena's knowledge. Checkout is left out. The pattern is Soady
// Poppers'.
//
// The site's address comes from NEXT_PUBLIC_SITE_URL. The fallback is the
// shop's current domain, on the assumption this site replaces it there —
// set the variable at launch if it goes live anywhere else.

import type { MetadataRoute } from "next";
import { navLinks } from "@/lib/refind";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.shoprefindboutique.com").replace(/\/+$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  return navLinks.map((l) => ({ url: `${SITE_URL}${l.href === "/" ? "" : l.href}` }));
}
