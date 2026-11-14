"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import { categories, products, type Product } from "@/lib/store";

// The racks (the controls of Soady Poppers' storefront, in Refind's look):
// a bar that stays under the header with search, sort and the category
// buttons; sold pieces always sink to the bottom; changing the controls jumps
// back to the top of the results.

type Sort = "featured" | "low" | "high";
const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "low", label: "Price: low to high" },
  { value: "high", label: "Price: high to low" },
];

// Sold pieces sink below everything still available (stable sort keeps the
// order within each group).
const soldLast = (a: Product, b: Product) => Number(!!a.sold) - Number(!!b.sold);

export default function Storefront() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const top = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter(
      (p) =>
        (filter === "All" || p.category === filter) &&
        (!q || `${p.name} ${p.details} ${p.category}`.toLowerCase().includes(q)),
    );
    if (sort === "low") list = [...list].sort((a, b) => a.priceCents - b.priceCents);
    if (sort === "high") list = [...list].sort((a, b) => b.priceCents - a.priceCents);
    return [...list].sort(soldLast);
  }, [filter, query, sort]);

  // When the results change, bring the shopper back to the top of them (not on first load).
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const el = top.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [filter, sort, query]);

  const tabs = ["All", ...categories];
  const fieldStyle = { background: "var(--cream)", border: "var(--outline-width) solid var(--tan)", color: "var(--ink)" };

  return (
    <div ref={top} className="scroll-mt-[150px]">
      {/* Controls: stay under the header while browsing */}
      <div
        className="relative z-20 -mx-5 px-5 py-4 md:sticky md:top-[84px] md:-mx-8 md:px-8 lg:top-[96px]"
        style={{ background: "var(--cream)", borderBottom: "var(--outline-width) solid var(--tan)" }}
      >
        <div className="flex items-center gap-2 md:gap-3">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search the racks</span>
            <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" viewBox="0 0 20 20" fill="none" stroke="var(--stem)" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <circle cx="8.5" cy="8.5" r="5.5" />
              <path d="m13 13 4 4" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full rounded-[var(--radius-field)] py-2.5 pl-10 pr-4 text-base outline-none focus:border-[var(--olive)]"
              style={fieldStyle}
            />
          </label>
          <label className="relative w-[9.5rem] shrink-0 md:w-56">
            <span className="sr-only">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="w-full appearance-none rounded-[var(--radius-field)] py-2.5 pl-4 pr-10 text-base outline-none focus:border-[var(--olive)]"
              style={fieldStyle}
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2" viewBox="0 0 20 20" fill="none" stroke="var(--olive)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m5 8 5 5 5-5" />
            </svg>
          </label>
        </div>
        <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0 md:pb-0" role="group" aria-label="Filter the racks">
          {tabs.map((t) => {
            const on = t === filter;
            const n = t === "All" ? products.length : products.filter((p) => p.category === t).length;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(t)}
                className="label shrink-0 whitespace-nowrap rounded-[var(--radius-button)] px-3 py-1.5 text-[1.05rem] transition-colors"
                style={{
                  background: on ? "var(--olive)" : "transparent",
                  color: on ? "var(--cream)" : "var(--olive)",
                  border: `var(--outline-width) solid ${on ? "var(--olive)" : "var(--tan)"}`,
                }}
              >
                {t} <span style={{ opacity: 0.7 }}>({n})</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-stem" aria-live="polite">
        {shown.length} {shown.length === 1 ? "piece" : "pieces"}
        {query.trim() ? ` matching “${query.trim()}”` : ""}
      </p>

      {shown.length ? (
        <ul className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </ul>
      ) : (
        <div className="mx-auto mt-12 max-w-sm text-center">
          <p className="caps text-xl">Nothing on the racks matches</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("All");
            }}
            className="btn btn-outline mt-6"
          >
            Show everything
          </button>
        </div>
      )}
    </div>
  );
}
