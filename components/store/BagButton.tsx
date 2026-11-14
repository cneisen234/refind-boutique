"use client";

import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";
import { FlierIcon } from "../Flier";

/** The floating bag on the shop's pages (Soady Poppers' floating cart button):
 *  bottom-right, once something is in the bag. */
export function FloatingBag() {
  const { count, openCart, hydrated, isOpen } = useCart();
  const pathname = usePathname();
  if (!hydrated || count === 0 || isOpen || !pathname?.startsWith("/shop") || pathname.startsWith("/shop/checkout")) return null;
  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Your bag, ${count} ${count === 1 ? "piece" : "pieces"}`}
      className="fade-in-up fixed bottom-5 right-5 z-30 flex items-center gap-2.5 rounded-full py-3 pl-4 pr-5"
      style={{ background: "var(--olive)", color: "var(--cream)", filter: "drop-shadow(0 6px 12px rgba(41, 40, 22, 0.25))" }}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="var(--cream)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8.3 9V7.2a3.7 3.7 0 0 1 7.4 0V9" />
        <path d="M4.6 9.2h14.8l1.1 10.4a1.3 1.3 0 0 1-1.3 1.4H4.8a1.3 1.3 0 0 1-1.3-1.4Z" />
      </svg>
      <span className="label text-[1.15rem]">
        Bag · {count}
      </span>
    </button>
  );
}

/** The header's bag: the flier's handbag icon with a count. Shows on the shop's
 *  pages, and anywhere once something is in the bag. */
export default function BagButton() {
  const { count, openCart, hydrated } = useCart();
  const pathname = usePathname();
  if (!hydrated || (count === 0 && !pathname?.startsWith("/shop"))) return null;
  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Your bag, ${count} ${count === 1 ? "piece" : "pieces"}`}
      className="relative flex h-10 w-10 items-center justify-center rounded-full sm:h-11 sm:w-11"
      style={{ border: "var(--outline-width) solid var(--tan)", background: "var(--linen)" }}
    >
      <FlierIcon name="handbag" className="h-6 w-6" />
      {count > 0 ? (
        <span
          className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold"
          style={{ background: "var(--rust)", color: "var(--cream)" }}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}
