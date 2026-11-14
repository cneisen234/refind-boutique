import {
  WORDMARK_VIEWBOX,
  REFIND_PATH,
  BOUTIQUE_PATH,
  WORDMARK_HEART_PATH,
  HEART_VIEWBOX,
  HEART_PATH,
} from "./logo-paths";

// The flier's wordmark: olive "Refind" with the rust "Boutique" signature
// tucked under it and the little heart trailing off the end.
//
// tone="brand" is the real thing: olive + rust, on cream.
// tone="mono" draws everything in currentColor, for places the brand pair
// can't sit (rust on olive is unreadable, so a dark band gets mono cream).

type WordmarkProps = {
  tone?: "brand" | "mono";
  /** Drop the trailing heart where the mark has to stay compact. */
  heart?: boolean;
  className?: string;
  /** Accessible name; pass "" when the mark sits inside a link that names it. */
  title?: string;
};

export function Wordmark({ tone = "brand", heart = true, className, title = "Refind Boutique" }: WordmarkProps) {
  const refind = tone === "brand" ? "var(--olive, #535129)" : "currentColor";
  const boutique = tone === "brand" ? "var(--rust, #864134)" : "currentColor";
  const labelled = title !== "";

  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      className={className}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? title : undefined}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
    >
      <path fill={refind} fillRule="evenodd" d={REFIND_PATH} />
      <path fill={boutique} fillRule="evenodd" d={BOUTIQUE_PATH} />
      {heart ? <path fill={boutique} fillRule="evenodd" d={WORDMARK_HEART_PATH} /> : null}
    </svg>
  );
}

/** The wordmark's hand-drawn heart on its own: dividers, "Brands we love", accents. */
export function Heart({ className, color = "var(--rust, #864134)" }: { className?: string; color?: string }) {
  return (
    <svg viewBox={HEART_VIEWBOX} className={className} aria-hidden="true" focusable="false">
      <path fill={color} fillRule="evenodd" d={HEART_PATH} />
    </svg>
  );
}
