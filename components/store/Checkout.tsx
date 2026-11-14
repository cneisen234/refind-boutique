"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useCart } from "./CartProvider";
import { findCoupon, money, MI_SALES_TAX, type Product } from "@/lib/store";
import { pickupDays, type PickupDay } from "@/lib/time";
import { refind } from "@/lib/refind";
import { BrushBanner, FlierPanel, HeartRule } from "../Flier";

// Demo checkout, with the steps of Megan's Sourdough's and Soady Poppers'
// checkouts: your details, a pickup day (only days the shop is open), a coupon
// checked as it's typed, card or pay-at-pickup, a live order summary, then a
// confirmation. It works like the real thing, but nothing is charged or sent:
// "placing" the order marks the pieces as on hold in this browser.

const field =
  "mt-1.5 w-full rounded-[var(--radius-field)] px-4 py-3 text-base outline-none transition-colors focus:border-[var(--olive)]";
const fieldStyle = { background: "var(--cream)", border: "var(--outline-width) solid var(--tan)", color: "var(--ink)" };

type Totals = { subtotal: number; discount: number; tax: number; total: number; couponLabel: string | null };

function totalsFor(items: Product[], code: string): Totals {
  const subtotal = items.reduce((s, p) => s + p.priceCents, 0);
  const coupon = code ? findCoupon(code) : null;
  const discount = coupon ? Math.round((subtotal * coupon.percentOff) / 100) : 0;
  const tax = Math.round((subtotal - discount) * MI_SALES_TAX);
  return { subtotal, discount, tax, total: subtotal - discount + tax, couponLabel: coupon ? `${coupon.code} · ${coupon.label}` : null };
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="py-8 first:pt-0">
      <h2 className="caps flex items-center gap-3 text-[1.35rem]">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-heading text-base"
          style={{ background: "var(--olive)", color: "var(--cream)", letterSpacing: 0 }}
        >
          {n}
        </span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Choice({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className="rounded-[var(--radius-field)] px-4 py-3 text-left transition-colors"
      style={{
        background: on ? "var(--olive-wash)" : "var(--cream)",
        border: `var(--outline-width) solid ${on ? "var(--olive)" : "var(--tan)"}`,
      }}
    >
      {children}
    </button>
  );
}

function Summary({ items, t }: { items: Product[]; t: Totals }) {
  return (
    <div>
      <ul className="dotted-rows">
        {items.map((p) => (
          <li key={p.id} className="flex items-center gap-4 py-3">
            <div className="relative h-16 w-[3.25rem] shrink-0 overflow-hidden rounded-[8px]" style={{ border: "var(--outline-width) solid var(--tan)" }}>
              <Image src={p.img} alt="" fill sizes="56px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="font-heading font-semibold leading-snug text-olive">{p.name}</p>
              <p className="text-sm text-stem">Size {p.size}</p>
            </div>
            <span className="text-right">
              {p.wasCents ? <s className="block text-sm text-stem">{money(p.wasCents)}</s> : null}
              <span className="font-heading font-semibold text-rust">{money(p.priceCents)}</span>
            </span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-1.5 text-[1.02rem]">
        <div className="flex justify-between">
          <dt className="text-stem">Subtotal</dt>
          <dd>{money(t.subtotal)}</dd>
        </div>
        {t.discount ? (
          <div className="flex justify-between">
            <dt className="text-stem">{t.couponLabel}</dt>
            <dd className="text-rust">−{money(t.discount)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt className="text-stem">Michigan sales tax (6%)</dt>
          <dd>{money(t.tax)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-stem">In-store pickup</dt>
          <dd>Free</dd>
        </div>
      </dl>
      <HeartRule className="mt-4" />
      <div className="mt-3 flex items-baseline justify-between">
        <span className="caps text-lg">Total</span>
        <span className="font-heading text-2xl font-semibold text-rust">{money(t.total)}</span>
      </div>
    </div>
  );
}

/** A demo order number, made when the order is placed (an event, not render). */
function orderNumber(): string {
  return `RB-${Math.floor(1000 + Math.random() * 9000)}`;
}

type Placed = { number: string; name: string; phone: string; items: Product[]; t: Totals; day: PickupDay; pay: "card" | "pickup" };

export default function Checkout() {
  const { items, hydrated, checkout } = useCart();
  const [days, setDays] = useState<PickupDay[]>([]);
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [pay, setPay] = useState<"card" | "pickup">("card");
  const [code, setCode] = useState("");
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState<Placed | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Pickup days depend on the clock, so they're worked out in the browser
  // after load (the server and first render agree on an empty list).
  useEffect(() => {
    const list = pickupDays();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDays(list);
    setDayKey((k) => k ?? list[0]?.key ?? null);
  }, []);

  const typed = code.trim();
  const coupon = typed ? findCoupon(typed) : null;
  const t = totalsFor(items, coupon ? typed : "");
  const day = days.find((d) => d.key === dayKey) ?? days[0];

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const phone = String(f.get("phone") ?? "").trim();
    if (!name || phone.replace(/\D/g, "").length < 10) {
      setError("Please add your name and a 10-digit phone number so we can text you when it’s ready.");
      return;
    }
    if (!day) {
      setError("Please choose a pickup day.");
      return;
    }
    setError(null);
    setPlacing(true);
    const order: Placed = { number: orderNumber(), name: name.split(" ")[0], phone, items, t, day, pay };
    window.setTimeout(() => {
      checkout();
      setPlaced(order);
      setPlacing(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 900);
  }

  if (!hydrated) return <div className="min-h-[40vh]" />;

  // ---- Confirmation ---------------------------------------------------------
  if (placed) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <BrushBanner className="text-[1.2rem]">Order {placed.number}</BrushBanner>
        <h1 className="caps mt-6 text-[2.2rem] md:text-[2.8rem]">Thank you, {placed.name}!</h1>
        <p className="mx-auto mt-3 max-w-md text-lg text-stem">
          Your pieces are on hold for pickup {placed.day.label === "Today" || placed.day.label === "Tomorrow" ? placed.day.label.toLowerCase() : `on ${placed.day.label}`}, {placed.day.sub}. We’ll text {placed.phone} when they’re ready.
        </p>
        <FlierPanel title="Your order" className="mt-14 text-left">
          <Summary items={placed.items} t={placed.t} />
          <p className="mt-4 text-sm text-stem">{placed.pay === "card" ? "Paid by card" : "Pay when you pick up"}</p>
        </FlierPanel>
        <div className="mt-10">
          <p className="caps text-base">Pick up at</p>
          <p className="mt-1 text-lg">
            {refind.name}, {refind.address}, {refind.cityStateZip}
          </p>
          <p className="text-stem">
            {placed.day.label === "Today" || placed.day.label === "Tomorrow" ? `${placed.day.label}, ` : ""}
            {placed.day.sub} · {placed.day.hours}
          </p>
        </div>
        <p className="mt-6 text-sm text-stem">This is a demo store: no payment was taken and no order was sent.</p>
        <Link href="/shop" className="btn btn-outline mt-8">
          Back to the racks
        </Link>
      </div>
    );
  }

  // ---- Empty bag ------------------------------------------------------------
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md text-center">
        <h1 className="caps text-[2rem]">Your bag is empty</h1>
        <p className="mt-3 text-lg text-stem">Every piece is one of a kind. Find yours on the racks.</p>
        <Link href="/shop" className="btn btn-outline mt-8">
          Shop the racks
        </Link>
      </div>
    );
  }

  // ---- Checkout -------------------------------------------------------------
  return (
    <div>
      <div className="text-center">
        <BrushBanner className="text-[1.2rem]">Checkout</BrushBanner>
        <h1 className="caps mt-6 text-[2.2rem] md:text-[2.8rem]">Your order</h1>
      </div>

      <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_24rem] lg:gap-12">
        <form onSubmit={onSubmit} noValidate className="dotted-rows-sections">
          <Step n={1} title="Your details">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-sm font-semibold">Name</span>
                <input name="name" autoComplete="name" className={field} style={fieldStyle} />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Phone (we’ll text you)</span>
                <input name="phone" type="tel" autoComplete="tel" className={field} style={fieldStyle} />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Email (for your receipt)</span>
                <input name="email" type="email" autoComplete="email" className={field} style={fieldStyle} />
              </label>
            </div>
          </Step>

          <Step n={2} title="Pickup">
            <p className="text-stem">
              In the shop at {refind.address}, {refind.cityStateZip}. Choose a day:
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {days.map((d) => (
                <Choice key={d.key} on={d.key === day?.key} onClick={() => setDayKey(d.key)}>
                  <span className="label block text-[1.1rem] text-olive">{d.label}</span>
                  <span className="block text-sm">{d.sub}</span>
                  <span className="block text-xs text-stem">{d.hours}</span>
                </Choice>
              ))}
            </div>
          </Step>

          <Step n={3} title="Payment">
            <div className="grid gap-2.5 sm:grid-cols-2">
              <Choice on={pay === "card"} onClick={() => setPay("card")}>
                <span className="font-semibold">Pay by card</span>
                <span className="block text-sm text-stem">Now, online</span>
              </Choice>
              <Choice on={pay === "pickup"} onClick={() => setPay("pickup")}>
                <span className="font-semibold">Pay at pickup</span>
                <span className="block text-sm text-stem">In the shop</span>
              </Choice>
            </div>
            {pay === "card" ? (
              <div className="mt-4 rounded-[var(--radius-field)] p-4" style={{ border: "var(--outline-width) dashed var(--tan)", background: "var(--linen)" }}>
                <p className="label text-sm text-rust">Demo store · no card is charged</p>
                <div className="mt-3 grid grid-cols-[1fr_5.5rem_4.5rem] gap-2" aria-hidden="true">
                  {["Card number", "MM / YY", "CVC"].map((ph) => (
                    <div key={ph} className="rounded-[var(--radius-field)] px-3 py-3 text-stem" style={{ border: "var(--outline-width) solid var(--tan)", background: "var(--cream)" }}>
                      {ph}
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-sm text-stem">In the live store, a secure card form goes here.</p>
              </div>
            ) : null}

            <label className="mt-6 block">
              <span className="text-sm font-semibold">Coupon code</span>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                autoComplete="off"
                className={`${field} uppercase`}
                style={fieldStyle}
                aria-describedby="coupon-status"
              />
            </label>
            <p id="coupon-status" className="mt-1.5 min-h-5 text-sm" aria-live="polite">
              {typed ? (
                coupon ? (
                  <span className="text-olive">✓ {coupon.code} applied: {coupon.label}</span>
                ) : (
                  <span className="text-rust">We don’t recognize that code.</span>
                )
              ) : (
                <span className="text-stem">Demo code: REFIND10</span>
              )}
            </p>
          </Step>

          {error ? (
            <p role="alert" className="mb-4 rounded-[var(--radius-field)] p-3 text-[0.98rem]" style={{ background: "var(--rust-wash)", color: "var(--rust-deep)" }}>
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={placing} className="brush-link flex w-full justify-center text-[1.35rem] disabled:opacity-70">
            <BrushBanner className="h-12">{placing ? "Placing your order…" : `Place order · ${money(t.total)}`}</BrushBanner>
          </button>
        </form>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <FlierPanel title="Your bag">
            <Summary items={items} t={t} />
          </FlierPanel>
        </aside>
      </div>
    </div>
  );
}
