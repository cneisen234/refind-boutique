"use client";

// The shopping bag for the demo store (the pattern of Megan's Sourdough's
// CartProvider: lines kept in localStorage, joined to the catalog on read, plus
// the drawer's open/closed state). Every piece at Refind is one of a kind, so a
// piece is either in the bag or not — no quantities.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProduct, type Product } from "@/lib/store";

const STORAGE_KEY = "refind-bag-v1";
const HELD_KEY = "refind-held-v1";

type CartValue = {
  items: Product[];
  count: number;
  subtotalCents: number;
  has: (id: string) => boolean;
  /** Pieces this browser already checked out (shown as "On hold"). */
  held: (id: string) => boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  /** Marks the bag's pieces as held for pickup and empties the bag. */
  checkout: () => void;
  hydrated: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartValue | null>(null);

function read(key: string): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
function write(key: string, ids: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    /* private mode etc. — the bag just won't persist */
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [heldIds, setHeldIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Read the saved bag once, after hydration, so the server and first client
    // render agree.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIds(read(STORAGE_KEY));
    setHeldIds(read(HELD_KEY));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) write(STORAGE_KEY, ids);
  }, [ids, hydrated]);
  useEffect(() => {
    if (hydrated) write(HELD_KEY, heldIds);
  }, [heldIds, hydrated]);

  // Pieces that have sold since they were bagged drop out on their own.
  const items = useMemo(() => ids.map(getProduct).filter((p): p is Product => !!p && !p.sold), [ids]);
  const add = useCallback((id: string) => {
    if (getProduct(id)?.sold) return;
    setIds((cur) => (cur.includes(id) ? cur : [...cur, id]));
  }, []);
  const remove = useCallback((id: string) => setIds((cur) => cur.filter((x) => x !== id)), []);
  const checkout = useCallback(() => {
    setHeldIds((cur) => [...new Set([...cur, ...ids])]);
    setIds([]);
  }, [ids]);

  const value = useMemo<CartValue>(
    () => ({
      items,
      count: items.length,
      subtotalCents: items.reduce((sum, p) => sum + p.priceCents, 0),
      has: (id) => ids.includes(id),
      held: (id) => heldIds.includes(id),
      add,
      remove,
      checkout,
      hydrated,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }),
    [items, ids, heldIds, add, remove, checkout, hydrated, isOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
