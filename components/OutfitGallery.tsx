"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Zoom from "./Zoom";
import { Heart } from "./Logo";

export type OutfitSlide = { img: string; alt: string; occasion: string };

// The outfit gallery: the carousel ported from Megan's Sourdough's gallery
// (swipe, arrow keys, dots, tap for the lightbox; slides lazy-load as they come
// into view), re-dressed in the flier, and paired with Refind's own idea: each
// slide is an occasion, so the occasions are the way to pick an outfit.

/** The flier's frame around the photo, crowned with the wordmark's heart. */
function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div
        className="rounded-[calc(var(--radius)+8px)] p-2.5"
        style={{ background: "var(--linen)", border: "var(--outline-width) solid var(--tan)" }}
      >
        <div className="overflow-hidden rounded-[var(--radius)]" style={{ boxShadow: "inset 0 0 0 1px var(--tan)" }}>
          {children}
        </div>
      </div>
      <div
        className="absolute -top-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full"
        style={{ background: "var(--cream)", border: "var(--outline-width) solid var(--tan)" }}
        aria-hidden="true"
      >
        <Heart className="h-5 w-auto" />
      </div>
    </div>
  );
}

function ArrowButton({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={dir === 1 ? "Next outfit" : "Previous outfit"}
      onClick={onClick}
      className={`absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full transition-transform hover:scale-105 ${dir === 1 ? "-right-3 sm:-right-5" : "-left-3 sm:-left-5"}`}
      style={{ background: "var(--olive)", color: "var(--cream)" }}
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={dir === 1 ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
      </svg>
    </button>
  );
}

export default function OutfitGallery({ slides, intro }: { slides: OutfitSlide[]; intro: ReactNode }) {
  const [active, setActive] = useState(0);
  const touchX = useRef<number | null>(null);
  const count = slides.length;
  const go = useCallback((dir: number) => setActive((a) => (a + dir + count) % count), [count]);

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,25rem)] lg:gap-16">
      <div className="flex flex-col items-center text-center">
        {intro}

        {/* The occasions — pick one to see its outfit */}
        <p className="caps mt-9 text-sm" style={{ color: "var(--stem)" }}>
          Where are you going?
        </p>
        <ul className="mt-4 flex max-w-xl flex-wrap justify-center gap-2.5">
          {slides.map((s, i) => {
            const on = i === active;
            return (
              <li key={s.img}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  className="label rounded-[var(--radius-button)] px-3.5 py-2 text-[1.15rem] transition-colors"
                  style={{
                    background: on ? "var(--olive)" : "transparent",
                    color: on ? "var(--cream)" : "var(--olive)",
                    border: `var(--outline-width) solid ${on ? "var(--olive)" : "var(--tan)"}`,
                  }}
                >
                  {s.occasion}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div
        className="relative mx-auto w-full max-w-[25rem] pt-5"
        role="group"
        aria-roledescription="carousel"
        aria-label="Outfits for the occasion"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
      >
        <div className="relative">
          <Frame>
            <div
              onTouchStart={(e) => {
                touchX.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                if (touchX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
                touchX.current = null;
              }}
            >
              <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${active * 100}%)` }}>
                {slides.map((s, i) => (
                  <div
                    key={s.img}
                    className="min-w-full"
                    aria-hidden={i !== active}
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${count}: ${s.occasion}`}
                  >
                    <Zoom src={s.img} alt={s.alt} focusable={i === active} className="block">
                      <div className="relative aspect-[3/4] w-full" style={{ background: "var(--cream)" }}>
                        <Image src={s.img} alt={s.alt} fill className="object-cover" sizes="(max-width: 640px) 92vw, 400px" />
                      </div>
                    </Zoom>
                  </div>
                ))}
              </div>
            </div>
          </Frame>
          <ArrowButton dir={-1} onClick={() => go(-1)} />
          <ArrowButton dir={1} onClick={() => go(1)} />
        </div>

        {/* Dots + counter */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="flex justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.img}
                type="button"
                aria-label={`Show ${s.occasion}`}
                aria-current={i === active}
                onClick={() => setActive(i)}
                className="h-2.5 rounded-full transition-all"
                style={{ width: i === active ? 22 : 10, background: i === active ? "var(--rust)" : "var(--tan)" }}
              />
            ))}
          </div>
          <p className="label text-base" style={{ color: "var(--stem)" }}>
            {active + 1} <span style={{ color: "var(--rust)" }}>/</span> {count}
          </p>
        </div>
      </div>
    </div>
  );
}
