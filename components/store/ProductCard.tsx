"use client";

import Image from "next/image";
import Zoom from "../Zoom";
import { useCart } from "./CartProvider";
import { money, type Product } from "@/lib/store";

/** One piece on the rack: its photo in the flier's tan frame, the price on a
 *  little tag (a markdown shows the regular price struck through), and "Add to
 *  bag" — one of a kind, so it's in the bag or it isn't. Sold pieces get the
 *  locked look Soady Poppers uses for sold-out items: muted, dashed, no action. */
export default function ProductCard({ product: p }: { product: Product }) {
  const { has, held, add, openCart, hydrated } = useCart();
  const inBag = hydrated && has(p.id);
  const onHold = hydrated && held(p.id);
  const unavailable = p.sold || onHold;

  return (
    <li className="flex flex-col">
      <Zoom src={p.img} alt={p.alt} className="block">
        <div
          className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius)]"
          style={{ border: "var(--outline-width) solid var(--tan)", background: "var(--linen)" }}
        >
          <Image
            src={p.img}
            alt={p.alt}
            fill
            sizes="(min-width: 1024px) 340px, (min-width: 640px) 46vw, 92vw"
            className="object-cover"
            style={p.sold ? { filter: "grayscale(0.55)", opacity: 0.75 } : undefined}
          />
          <span
            className="absolute right-3 top-3 flex items-baseline gap-1.5 rounded-[6px] px-2.5 py-1"
            style={{ background: "var(--cream)", border: "var(--outline-width) solid var(--tan)" }}
          >
            {p.wasCents && !p.sold ? (
              <s className="text-sm text-stem" aria-label={`Was ${money(p.wasCents)}`}>
                {money(p.wasCents)}
              </s>
            ) : null}
            <span className="font-heading text-base font-semibold text-rust">{money(p.priceCents)}</span>
          </span>
          {p.wasCents && !p.sold ? (
            <span className="label absolute left-3 top-3 rounded-[6px] px-2.5 py-1 text-sm" style={{ background: "var(--rust)", color: "var(--cream)" }}>
              Marked down
            </span>
          ) : null}
          {unavailable ? (
            <span className="label absolute inset-x-0 bottom-0 py-2 text-center text-base" style={{ background: "var(--olive)", color: "var(--cream)" }}>
              {p.sold ? "Sold" : "On hold for you"}
            </span>
          ) : null}
        </div>
      </Zoom>

      <div className="mt-4 flex flex-1 flex-col text-center">
        <p className="label text-sm text-stem">
          {p.category} · Size {p.size}
        </p>
        <h3 className="mt-1.5 text-[1.3rem] leading-snug">{p.name}</h3>
        <p className="mt-1 text-[0.98rem] text-stem">{p.details}</p>
        <div className="mt-auto pt-4">
          {unavailable ? (
            <span
              className="btn cursor-not-allowed"
              style={{ background: "var(--linen)", color: "var(--stem)", border: "var(--outline-width) dashed var(--tan)" }}
              aria-disabled="true"
            >
              {p.sold ? "Sold · One of a kind" : "On hold"}
            </span>
          ) : inBag ? (
            <button type="button" onClick={openCart} className="btn btn-text">
              In your bag · View
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                add(p.id);
                openCart();
              }}
              className="btn btn-outline"
            >
              Add to bag
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
