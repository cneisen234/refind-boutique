"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { refind } from "@/lib/refind";
import { BrushBanner } from "./Flier";

// Phone-only floating bar (Soady Poppers' OrderBar): keeps "Shop online" one
// tap away on every page, with call or text as the secondary. Hidden on the
// shop itself, which has its own floating bag.

export default function OrderBar() {
  const pathname = usePathname();
  if (pathname?.startsWith("/shop")) return null;
  return (
    <>
      {/* In-flow spacer so the fixed bar never covers the footer's last line */}
      <div className="h-[76px] lg:hidden" style={{ background: "var(--olive-deep)" }} aria-hidden="true" />
      <div
        className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 px-4 py-3 lg:hidden"
        style={{
          background: "var(--cream)",
          borderTop: "var(--outline-width) solid var(--tan)",
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
        }}
      >
        <a href={refind.smsHref} className="text-sm font-semibold leading-tight text-rust">
          Call or text
          <br />
          {refind.phone}
        </a>
        <Link href="/shop" className="brush-link inline-flex text-[1.15rem]">
          <BrushBanner className="h-11">Shop online</BrushBanner>
        </Link>
      </div>
    </>
  );
}
