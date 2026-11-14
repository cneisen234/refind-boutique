"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "./CartProvider";
import { money } from "@/lib/store";
import { BrushBanner, HeartRule } from "../Flier";

/** The bag: slides in from the right over a dimmed page (the drawer from
 *  Megan's Sourdough's storefront), in the flier's cream and tan. */
export default function CartDrawer() {
  const { items, subtotalCents, remove, isOpen, closeCart } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  return (
    <div className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen} inert={!isOpen}>
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        style={{ background: "rgba(41, 40, 22, 0.45)" }}
        onClick={closeCart}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ background: "var(--cream)", borderLeft: "var(--outline-width) solid var(--tan)" }}
      >
        <div className="flex items-center justify-between px-6 pb-4 pt-6">
          <BrushBanner as="h2" className="text-[1.3rem]">
            Your bag
          </BrushBanner>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close your bag"
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ border: "var(--outline-width) solid var(--tan)", color: "var(--olive)" }}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="caps text-xl">Your bag is empty</p>
            <p className="mt-2 text-stem">Every piece is one of a kind.</p>
            <Link href="/shop" onClick={closeCart} className="btn btn-outline mt-6">
              Shop the racks
            </Link>
          </div>
        ) : (
          <>
            <ul className="dotted-rows flex-1 overflow-y-auto px-6">
              {items.map((p) => (
                <li key={p.id} className="flex gap-4 py-4">
                  <div
                    className="relative h-24 w-[4.75rem] shrink-0 overflow-hidden rounded-[10px]"
                    style={{ border: "var(--outline-width) solid var(--tan)" }}
                  >
                    <Image src={p.img} alt="" fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="font-heading text-[1.08rem] font-semibold leading-snug text-olive">{p.name}</p>
                    <p className="text-sm text-stem">Size {p.size} · One of a kind</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="font-heading font-semibold text-rust">{money(p.priceCents)}</span>
                      <button type="button" onClick={() => remove(p.id)} className="text-sm font-semibold text-stem underline-offset-2 hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="px-6 pb-7 pt-2">
              <HeartRule />
              <div className="mt-4 flex items-baseline justify-between">
                <span className="caps text-base">Subtotal</span>
                <span className="font-heading text-xl font-semibold text-rust">{money(subtotalCents)}</span>
              </div>
              <p className="mt-1 text-sm text-stem">Tax is figured at checkout. Pick up in the shop.</p>
              <Link href="/shop/checkout" onClick={closeCart} className="brush-link mt-5 flex justify-center text-[1.3rem]">
                <BrushBanner className="h-12">Check out</BrushBanner>
              </Link>
              <button type="button" onClick={closeCart} className="btn btn-text mt-2 w-full">
                Keep shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
