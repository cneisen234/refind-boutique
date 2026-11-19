import type { ReactNode } from "react";

/**
 * Refind's hang tag, like the ones on every piece on her racks: a cream card in
 * the flier's thin tan frame with a dashed stitch line, clipped top corners, a
 * grommet, and a rust string running up out of it. What it says is up to the
 * caller (the open sign, the 404 page).
 *
 * Positioned by the caller (absolute) or in flow (relative); either way it's
 * the containing block for the string and the lettering.
 */
export default function HangTag({
  children,
  className = "",
  role,
  live,
}: {
  children: ReactNode;
  className?: string;
  role?: string;
  live?: "polite";
}) {
  return (
    <div className={`hang-tag ${/\b(absolute|fixed)\b/.test(className) ? "" : "relative"} ${className}`} role={role} aria-live={live}>
      {/* the string, running up from the grommet */}
      <svg viewBox="0 0 40 90" className="absolute bottom-[calc(100%-28px)] left-1/2 h-[64px] w-[28px] -translate-x-1/2 overflow-visible" aria-hidden="true">
        <path d="M20 88 C14 66 27 46 19 24 C15 13 22 5 20 0" fill="none" stroke="var(--rust)" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {/* the tag */}
      <svg viewBox="0 0 140 176" className="block w-full" aria-hidden="true">
        <path
          d="M34 1.5 H106 L138.5 32 V162 Q138.5 174.5 126 174.5 H14 Q1.5 174.5 1.5 162 V32 Z"
          fill="var(--cream)"
          stroke="var(--tan)"
          strokeWidth="1.5"
        />
        <path
          d="M37 8 H103 L132 35 V160 Q132 168 124 168 H16 Q8 168 8 160 V35 Z"
          fill="none"
          stroke="var(--tan)"
          strokeWidth="0.8"
          strokeDasharray="2 3"
        />
        <circle cx="70" cy="28" r="7.5" fill="var(--linen)" stroke="var(--tan)" strokeWidth="2.5" />
        <circle cx="70" cy="28" r="3.2" fill="var(--olive-wash)" />
      </svg>
      {/* what it says */}
      <div className="absolute inset-x-0 bottom-[7%] top-[24%] flex flex-col items-center justify-center px-3 text-center">{children}</div>
    </div>
  );
}
