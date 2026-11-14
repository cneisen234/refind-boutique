"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { refind, navLinks, mainAction } from "@/lib/refind";
import { Wordmark, Heart } from "./Logo";
import { BrushBanner } from "./Flier";
import { DaisySpray } from "./Daisies";
import { OpenChip } from "./OpenStatus";
import BagButton from "./store/BagButton";

// Site header. Six links, so every one is a plain link (Pilot Light's
// docs/site-conventions.md §4); the "We're buying" banner isn't part of
// the menu. Behavior follows Fuel & Flex (the conventions' reference header):
// sticky, a rule appears once the page scrolls, and a full-screen phone menu
// that locks the page and closes on Escape.

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <>
      <header
        className="sticky top-0 z-50 transition-[border-color] duration-200"
        style={{
          background: "var(--cream)",
          borderBottom: `var(--outline-width) solid ${scrolled || isOpen ? "var(--tan)" : "transparent"}`,
        }}
      >
        <div className="container-x flex h-[84px] items-center justify-between gap-6 lg:h-[96px]">
          <Link href="/" onClick={close} aria-label={`${refind.name}, home`} className="shrink-0">
            <Wordmark title="" className="w-[132px] sm:w-[150px] lg:w-[184px]" />
          </Link>

          {/* Desktop links */}
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((l) => {
                const active = isActive(l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className="label relative flex flex-col items-center whitespace-nowrap px-2.5 py-2 text-[1.2rem] transition-colors hover:text-[var(--rust)] xl:px-3"
                      style={{ color: active ? "var(--rust)" : "var(--olive)" }}
                    >
                      {l.label}
                      <Heart
                        className="absolute -bottom-1.5 h-2.5 w-auto transition-opacity"
                        color={active ? "var(--rust)" : "transparent"}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Desktop: status + phone + the main action */}
          <div className="hidden items-center gap-4 lg:flex xl:gap-5">
            <div className="flex flex-col items-end gap-0.5 leading-tight">
              <OpenChip />
              <a href={refind.smsHref} className="whitespace-nowrap text-sm font-semibold hover:underline" style={{ color: "var(--rust)" }}>
                <span className="hidden xl:inline">Call or text </span>
                {refind.phone}
              </a>
            </div>
            <Link href={mainAction.href} className="brush-link text-[1.2rem]">
              <BrushBanner>{mainAction.label}</BrushBanner>
            </Link>
            <BagButton />
          </div>

          {/* Phone: status + menu button */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <OpenChip />
            <BagButton />
            <button
              type="button"
              onClick={() => setIsOpen((o) => !o)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="phone-menu"
              className="flex h-10 w-10 items-center justify-center rounded-full sm:h-11 sm:w-11"
              style={{ border: "var(--outline-width) solid var(--tan)", background: isOpen ? "var(--olive)" : "var(--linen)" }}
            >
              <span className="relative block h-3.5 w-5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="absolute left-0 block h-[1.5px] w-full rounded-full transition-all duration-200"
                    style={{
                      top: i === 0 ? 0 : i === 1 ? "6px" : "12px",
                      background: isOpen ? "var(--cream)" : "var(--olive)",
                      opacity: isOpen && i === 1 ? 0 : 1,
                      transform: isOpen ? (i === 0 ? "translateY(6px) rotate(45deg)" : i === 2 ? "translateY(-6px) rotate(-45deg)" : "none") : "none",
                    }}
                  />
                ))}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen phone menu */}
      <div
        id="phone-menu"
        className={`fixed inset-0 z-40 overflow-hidden transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        style={{ background: "var(--cream)" }}
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <DaisySpray corner="br" className="absolute -bottom-6 -right-6 w-56" />
        <div className="relative flex h-full flex-col px-6 pb-8 pt-[108px]">
          <nav aria-label="Main" className="flex-1">
            <ul className="space-y-1">
              {navLinks.map((l, i) => {
                const active = isActive(l.href);
                return (
                  <li key={l.href} className={isOpen ? "fade-in-up" : ""} style={{ animationDelay: `${i * 45}ms` }}>
                    <Link
                      href={l.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className="caps flex items-center gap-3 py-2 text-[1.85rem]"
                      style={{ color: active ? "var(--rust)" : "var(--olive)" }}
                    >
                      {l.label}
                      {active ? <Heart className="h-5 w-auto" /> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link href={mainAction.href} onClick={close} className="brush-link mt-8 inline-block text-[1.4rem]">
              <BrushBanner>{mainAction.label}</BrushBanner>
            </Link>
          </nav>
          <div className="space-y-1 text-base">
            <a href={refind.smsHref} className="block font-semibold" style={{ color: "var(--rust)" }}>
              Call or text {refind.phone}
            </a>
            <p style={{ color: "var(--stem)" }}>
              {refind.address}, {refind.cityStateZip}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
