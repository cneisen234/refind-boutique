import store from "@/data/store.json";

// The DEMO online store's catalog (data/store.json). Every piece is one of a
// kind, so the bag holds each item at most once.

export type Product = {
  id: string;
  name: string;
  category: string;
  priceCents: number;
  /** The regular price when the piece is marked down (shown struck through). */
  wasCents?: number;
  /** Sold: shown at the bottom of the racks, can't be added to the bag. */
  sold?: boolean;
  size: string;
  details: string;
  img: string;
  alt: string;
};

export const categories: string[] = store.categories;
export const products: Product[] = store.products;

const coupons: Record<string, { percentOff: number; label: string }> = store.coupons;

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/** A coupon code's discount, or null if the shop doesn't recognize it. */
export function findCoupon(code: string): { code: string; percentOff: number; label: string } | null {
  const key = code.trim().toUpperCase();
  const c = coupons[key];
  return c ? { code: key, ...c } : null;
}

export const MI_SALES_TAX = 0.06; // Michigan's 6% sales tax

export function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
