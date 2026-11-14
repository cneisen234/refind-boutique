import type { ReactNode } from "react";
import { Heart } from "./Logo";

// The flier's own furniture, redrawn: the dry-brush olive label banner, the
// thin tan frame it breaks into, the heart-centered rule, the rust line icons
// and the sprig bullets.

// ---- Brush banner -----------------------------------------------------------
// The flier's "WHAT WE'RE LOOKING FOR" label: a dry-brush olive stroke whose
// ends split into bristle streaks. Built as two fixed-width bristle caps around
// a stretchable body, so the bristles never distort however long the label is.

// Bristles as [center y, half-thickness at the body, reach] in a 60-unit-tall,
// 40-unit-wide cap. Each is a sliver that tapers to a point as the paint runs
// out; neighbors overlap at the body and part toward the tips, like dry brush.
const BRISTLES: [number, number, number][] = [
  [7, 2.2, 21], [10.5, 2.6, 33], [14, 2.1, 25], [17.5, 2.8, 38], [21, 2.2, 18],
  [24.5, 2.7, 31], [28, 2.4, 36], [31.5, 2.2, 22], [35, 2.8, 34], [38.5, 2.1, 27],
  [42, 2.6, 39], [45.5, 2.3, 20], [49, 2.7, 30], [52.5, 2.1, 24],
];

function sliver([y, hw, reach]: [number, number, number]) {
  const tip = 40 - reach;
  const lift = (reach % 3) - 1; // a slight up/down drift per bristle
  return `M40 ${y - hw} C${40 - reach * 0.45} ${y - hw * 0.95} ${tip + reach * 0.18} ${y - hw * 0.35 + lift * 0.4} ${tip} ${y + lift * 0.5} C${tip + reach * 0.18} ${y + hw * 0.35 + lift * 0.4} ${40 - reach * 0.45} ${y + hw * 0.95} 40 ${y + hw}Z`;
}

function BrushCap({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 40 60"
      preserveAspectRatio="none"
      className={`h-full w-[26px] shrink-0 ${flip ? "-ml-px" : "-mr-px"}`}
      style={flip ? { transform: "scale(-1, -1)" } : undefined}
      aria-hidden="true"
    >
      <path d={BRISTLES.map(sliver).join("")} fill="currentColor" />
    </svg>
  );
}

// The body's top and bottom edges: small irregular wobbles, like a brush
// dragged across paper, not a ruled rectangle.
const TOP = [6.2, 5.1, 6.6, 5.4, 4.9, 6.1, 5.6, 4.7, 5.9, 6.4, 5.2, 4.8, 5.7, 6.3, 5.0, 5.8, 6.5, 5.3, 4.9, 6.0, 5.5];
const BOTTOM = [54.4, 55.3, 53.8, 54.9, 55.6, 54.1, 53.6, 55.1, 54.6, 53.9, 55.4, 54.2, 55.0, 53.7, 54.8, 55.5, 54.0, 53.8, 55.2, 54.5, 54.9];

function BrushBody() {
  const step = 200 / (TOP.length - 1);
  const top = TOP.map((y, i) => `${(i * step).toFixed(1)} ${y}`).join(" L");
  const bottom = BOTTOM.map((y, i) => `${(200 - i * step).toFixed(1)} ${y}`).join(" L");
  return (
    <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <path d={`M${top} L${bottom}Z`} fill="currentColor" />
      {/* faint dry-brush drag lines */}
      <g fill="var(--cream)" opacity="0.1">
        <rect x="8" y="14" width="70" height="1.3" rx="0.65" />
        <rect x="96" y="20" width="88" height="1" rx="0.5" />
        <rect x="24" y="43" width="112" height="1.2" rx="0.6" />
        <rect x="150" y="48" width="40" height="0.9" rx="0.45" />
      </g>
    </svg>
  );
}

export function BrushBanner({
  children,
  as: Tag = "span",
  className = "",
  tone = "olive",
}: {
  children: ReactNode;
  as?: "span" | "h2" | "h3" | "p";
  className?: string;
  /** olive with cream text (the flier), or cream with olive text for dark bands. */
  tone?: "olive" | "cream";
}) {
  const color = tone === "olive" ? "var(--olive)" : "var(--cream)";
  const text = tone === "olive" ? "var(--cream)" : "var(--olive)";
  return (
    <Tag className={`inline-flex items-stretch ${className}`} style={{ color }}>
      <BrushCap />
      <span className="relative flex items-center px-3 py-2">
        <BrushBody />
        <span className="label relative whitespace-nowrap" style={{ color: text }}>
          {children}
        </span>
      </span>
      <BrushCap flip />
    </Tag>
  );
}

// ---- Flier panel ------------------------------------------------------------
// The flier's thin tan frame on a slightly deeper cream, with its brush banner
// breaking the top edge.

export function FlierPanel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative rounded-[var(--radius)] px-6 pb-7 pt-12 sm:px-8 ${className}`}
      style={{ background: "var(--linen)", border: "var(--outline-width) solid var(--tan)" }}
    >
      <div className="absolute inset-x-0 top-0 flex -translate-y-1/2 justify-center px-4">
        <BrushBanner as="h3" className="text-[1.35rem] sm:text-[1.5rem]">
          {title}
        </BrushBanner>
      </div>
      {children}
    </section>
  );
}

// ---- Heart rule -------------------------------------------------------------
// The flier's divider: a thin olive line, a dot-and-dash, the heart, and back.

function DotDash({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 26 8"
      className="h-2 w-[26px] shrink-0"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      <circle cx="4" cy="4" r="2.3" fill="var(--olive)" />
      <rect x="8" y="3.3" width="7" height="1.4" rx="0.7" fill="var(--olive)" />
      <circle cx="19.5" cy="4" r="2.3" fill="var(--olive)" />
    </svg>
  );
}

export function HeartRule({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`} aria-hidden="true">
      <span className="h-px flex-1" style={{ background: "var(--olive)", opacity: 0.55 }} />
      <DotDash />
      <Heart className="mx-1 h-6 w-auto" />
      <DotDash flip />
      <span className="h-px flex-1" style={{ background: "var(--olive)", opacity: 0.55 }} />
    </div>
  );
}

// ---- Icons ------------------------------------------------------------------
// The flier's rust line icons for "What we're looking for", and the sprig it
// uses as bullets for "What to expect". 24-unit grid, one stroke weight.

export type IconName = "tee" | "star" | "heart" | "hanger" | "leaf" | "handbag";

const ICONS: Record<Exclude<IconName, "heart">, ReactNode> = {
  tee: <path d="M8.5 3.5 4 6l-2 4.3 3.3 1.5 1.2-1.7V20.5h11V10.1l1.2 1.7 3.3-1.5L20 6l-4.5-2.5c-.6 1.6-2 2.6-3.5 2.6S9.1 5.1 8.5 3.5Z" />,
  star: <path d="m12 2.8 2.75 6 6.5.65-4.9 4.35 1.4 6.4L12 16.9l-5.75 3.3 1.4-6.4-4.9-4.35 6.5-.65Z" />,
  hanger: (
    <>
      <path d="M12 9.2V7.6a2.1 2.1 0 1 0-2.1-2.1" />
      <path d="M12 9.2 2.6 16.4c-.7.5-.35 1.6.5 1.6h17.8c.85 0 1.2-1.1.5-1.6Z" />
    </>
  ),
  leaf: (
    <>
      <path d="M20.5 3.5C11 3.6 5 8.6 5 15.2c0 1.5.4 2.8 1 3.8 6.6.4 13.4-3.7 14.5-15.5Z" />
      <path d="M3.5 21 16 8.5M10 14.6l-.4-3.3M12.9 11.7l-.3-2.6M7.4 17.3l-.5-3" />
    </>
  ),
  handbag: (
    <>
      <path d="M8.3 9V7.2a3.7 3.7 0 0 1 7.4 0V9" />
      <path d="M4.6 9.2h14.8l1.1 10.4a1.3 1.3 0 0 1-1.3 1.4H4.8a1.3 1.3 0 0 1-1.3-1.4Z" />
      <path d="M9.6 13.4h4.8" />
    </>
  ),
};

export function FlierIcon({ name, className = "" }: { name: IconName; className?: string }) {
  if (name === "heart") return <Heart className={className} />;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="var(--rust)"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

/** The rust sprig the flier uses as a bullet. */
export function Sprig({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 28"
      className={className}
      fill="none"
      stroke="var(--rust)"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7.6 26.5C7.3 19 8 11.5 9.6 2.5" />
      <path d="M8 21.5C5.2 21 3.4 18.9 3.2 16.4c2.7.1 4.6 1.9 4.8 5.1Z" />
      <path d="M8.2 16.8c.4-3 2.6-4.9 5.2-5-.2 2.8-2.2 4.7-5.2 5Z" />
      <path d="M8.3 12.2C5.7 11.6 4.2 9.6 4.2 7.3c2.5.2 4.2 2 4.1 4.9Z" />
      <path d="M9 7.8c.5-2.4 2.3-4 4.4-4-.2 2.3-1.9 3.9-4.4 4Z" />
    </svg>
  );
}

/** The flier's feather flourish beside "BRANDS WE LOVE": a thin line ending in
 *  a row of fletching chevrons, pointing in toward the heading. */
export function Flourish({ flip = false, className = "" }: { flip?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 120 16"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      fill="none"
      stroke="var(--olive)"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 8 H116" />
      <path d="M6 3 C10 4.5 12 6.5 13 8 C12 9.5 10 11.5 6 13" />
      {[18, 30, 42, 54].map((x) => (
        <path key={x} d={`M${x} 2.5 L${x + 8} 8 L${x} 13.5`} />
      ))}
    </svg>
  );
}

/** Small arrow for "go somewhere" links. */
export function Arrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M4 10h12m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
