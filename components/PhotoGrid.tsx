"use client";

import Image from "next/image";
import Zoom from "./Zoom";

export type GridPhoto = {
  src: string;
  alt: string;
  /** Optional line under the photo. */
  caption?: string;
  /** CSS aspect-ratio for the frame, e.g. "3/4". */
  aspect: string;
  /** object-position, to keep the subject in frame. */
  position?: string;
};

/** Photos in the flier's tan frames; tap any one for the full-size lightbox
 *  (the Zoom ported from Megan's Sourdough). */
export default function PhotoGrid({ photos, className = "", sizes }: { photos: GridPhoto[]; className?: string; sizes: string }) {
  return (
    <ul className={className}>
      {photos.map((p) => (
        <li key={p.src}>
          <Zoom src={p.src} alt={p.alt} className="block">
            <div
              className="relative overflow-hidden rounded-[var(--radius)]"
              style={{ aspectRatio: p.aspect, border: "var(--outline-width) solid var(--tan)", background: "var(--linen)" }}
            >
              <Image src={p.src} alt={p.alt} fill sizes={sizes} className="object-cover" style={p.position ? { objectPosition: p.position } : undefined} />
            </div>
          </Zoom>
          {p.caption ? <p className="label mt-3 text-center text-[1.1rem] text-olive">{p.caption}</p> : null}
        </li>
      ))}
    </ul>
  );
}
