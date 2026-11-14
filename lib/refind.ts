// ---------------------------------------------------------------------------
// Refind Boutique — Fairview, MI — single source of truth.
//
// Every business fact the site renders lives here. Presentation never hardcodes
// a phone number, an address or an hour; it imports from this module. Facts
// come from the shop's "We're currently purchasing" flier, its Facebook page
// and its Instagram. Not yet known: store hours.
// ---------------------------------------------------------------------------

export const refind = {
  name: "Refind Boutique",
  tagline: "Boutique clothing",
  motto: "Rewear. Relove. Refind.",
  town: "Fairview, Michigan",
  townShort: "Fairview, MI",

  // Her own bio line (Facebook + Instagram).
  intro: "A carefully curated selection of preloved & upcycled fashion.",

  blurb:
    "A women's resale boutique in Fairview, Michigan. Preloved & upcycled fashion, and we buy too: cash or store credit on the spot.",

  address: "2014 E Miller Rd",
  cityStateZip: "Fairview, MI 48621",

  // The flier: "Call or text … or message us on Facebook to book your appointment."
  // PLACEHOLDER (555) number for the build — swap in the shop's real one at launch.
  phone: "989-555-0142",
  phoneHref: "tel:+19895550142",
  smsHref: "sms:+19895550142",

  facebook: "https://www.facebook.com/refindboutiquemi",
  instagram: "https://www.instagram.com/refindboutique_mi/",
  instagramHandle: "@refindboutique_mi",

  // Keyless Google Maps links (work with no API key).
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=Refind+Boutique+2014+E+Miller+Rd+Fairview+MI+48621",
  mapsEmbed:
    "https://www.google.com/maps?q=Refind+Boutique,+2014+E+Miller+Rd,+Fairview,+MI+48621&output=embed",
} as const;

// ---- Navigation -------------------------------------------------------------
// Six links, so every one is a plain link (Pilot Light docs/site-conventions.md
// §4). The header's main button isn't part of the menu.
export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/sell", label: "Sell" },
  { href: "/live", label: "Live Sales" },
  { href: "/about", label: "About" },
  { href: "/visit", label: "Visit" },
] as const;

// In the shop's own first-person voice, like the flier's "We're currently
// purchasing" — not an instruction aimed at the visitor.
export const mainAction = { href: "/sell", label: "We’re buying" } as const;

// ---- Hours ------------------------------------------------------------------
// 0 = Sun … 6 = Sat. open/close are 24h decimal hours, Fairview (Eastern) time.
// PLACEHOLDER hours (made up for the build, with the user's OK) — replace with
// the shop's real hours before launch. Set to null to hide every open/closed
// status and hours list on the site.
export type DayHours = { open: number; close: number } | null;
export const hours: Record<number, DayHours> | null = {
  0: null, // Sun closed
  1: null, // Mon closed
  2: { open: 10, close: 17 }, // Tue 10–5
  3: { open: 10, close: 17 }, // Wed 10–5
  4: { open: 10, close: 17 }, // Thu 10–5
  5: { open: 10, close: 17 }, // Fri 10–5
  6: { open: 10, close: 15 }, // Sat 10–3
};

export const TIME_ZONE = "America/Detroit";

// ---- Facebook Live sales ----------------------------------------------------
// Source, her own Instagram/Facebook post of Nov 3, 2026 (instagram.com/
// refindboutique_mi/reel/DfR893kRyYL): "Every Tuesday at 7PM, Refind Boutique +
// Wild + Thrifted go LIVE on Facebook … We show you everything up close, give
// you the details, and you can claim your favorites right from the comments."
// The site states only that schedule; it never predicts a specific date.
export const liveSales = {
  timeLabel: "7 PM",
  partner: "Wild + Thrifted",
  partnerHref: "https://www.instagram.com/wildandthrifted/",
  // Her words, lightly trimmed.
  how: "We show you everything up close, give you the details, and you can claim your favorites right from the comments.",
} as const;
