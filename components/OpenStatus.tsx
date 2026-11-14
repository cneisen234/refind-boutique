"use client";

import { useSyncExternalStore } from "react";
import { shopStatus, shopNow, to12h, type Status } from "@/lib/time";
import { hours } from "@/lib/refind";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
import { Heart } from "./Logo";

// Live, clock-driven bits, always in Fairview's time zone (the pattern from
// Luzerne Express's open sign). The server renders a neutral state and the
// client fills in, so the clock can never cause a hydration mismatch.

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 30_000);
  return () => clearInterval(id);
}

function useClock<T>(read: () => T | null): T | null | undefined {
  const snap = useSyncExternalStore(
    subscribe,
    () => JSON.stringify(read()),
    () => "",
  );
  // undefined = not hydrated yet; null = nothing to show.
  return snap === "" ? undefined : (JSON.parse(snap) as T | null);
}

/** Header chip: a dot and a word. Renders nothing until the shop's hours are known. */
export function OpenChip() {
  const s = useClock<Status>(shopStatus);
  if (s === null) return null;
  const open = s?.open ?? false;
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold" aria-live="polite">
      <span
        aria-hidden="true"
        className="h-2.5 w-2.5 rounded-full"
        style={{ background: s ? (open ? "var(--olive)" : "var(--rust)") : "var(--tan)" }}
      />
      <span style={{ color: "var(--ink)" }}>{s ? (open ? "Open now" : "Closed") : "Hours"}</span>
      {s?.line ? (
        <span className="hidden 2xl:inline" style={{ color: "var(--stem)" }}>
          · {s.line}
        </span>
      ) : null}
    </span>
  );
}

/**
 * Refind's open sign: a clothing hang tag, like the ones on every piece on her
 * racks. Cream card in the flier's thin tan frame, clipped top corners, a
 * grommet with a rust string running up out of it, OPEN or CLOSED in the
 * flier's caps, the wordmark's heart, and when it opens or closes.
 */
export function HangTagSign({ className = "" }: { className?: string }) {
  const s = useClock<Status>(shopStatus);
  if (s === null) return null;
  const open = s?.open ?? false;
  const word = s ? (open ? "Open" : "Closed") : "· · ·";
  return (
    // Positioned by the caller (absolute) or in flow (relative); either way it's
    // the containing block for the string and the lettering.
    <div className={`hang-tag ${/\b(absolute|fixed)\b/.test(className) ? "" : "relative"} ${className}`} role="status" aria-live="polite">
      {/* the string, running up from the grommet */}
      <svg viewBox="0 0 40 90" className="absolute bottom-[calc(100%-28px)] left-1/2 h-[64px] w-[28px] -translate-x-1/2 overflow-visible" aria-hidden="true">
        <path d="M20 88 C14 66 27 46 19 24 C15 13 22 5 20 0" fill="none" stroke="var(--rust)" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {/* the tag */}
      <svg viewBox="0 0 140 176" className="block w-full" aria-hidden="true">
        <path
          d="M34 1.5 H106 L138.5 32 V162 Q138.5 174.5 126 174.5 H14 Q1.5 174.5 1.5 162 V32 Z"
          fill="var(--cream)"
          stroke="var(--tan)"
          strokeWidth="1.5"
        />
        <path
          d="M37 8 H103 L132 35 V160 Q132 168 124 168 H16 Q8 168 8 160 V35 Z"
          fill="none"
          stroke="var(--tan)"
          strokeWidth="0.8"
          strokeDasharray="2 3"
        />
        <circle cx="70" cy="28" r="7.5" fill="var(--linen)" stroke="var(--tan)" strokeWidth="2.5" />
        <circle cx="70" cy="28" r="3.2" fill="var(--olive-wash)" />
      </svg>
      {/* what it says */}
      <div className="absolute inset-x-0 bottom-[7%] top-[24%] flex flex-col items-center justify-center px-3 text-center">
        <span
          className="caps text-[1.45rem] leading-none sm:text-[1.7rem]"
          style={{ color: s ? (open ? "var(--olive)" : "var(--rust)") : "var(--stem)" }}
        >
          {word}
        </span>
        <Heart className="mt-2 h-3.5 w-auto" />
        <span className="label mt-2 text-[0.95rem] leading-tight sm:text-[1.05rem]" style={{ color: "var(--stem)" }}>
          {s?.line || "Today’s hours"}
        </span>
      </div>
    </div>
  );
}

/** The week's hours, Monday first, with today's row picked out once the
 *  browser knows what day it is in Fairview. */
export function HoursList() {
  const today = useClock<number>(() => (hours ? shopNow().day : null));
  if (!hours) return null;
  const week = [1, 2, 3, 4, 5, 6, 0];
  return (
    <ul className="dotted-rows">
      {week.map((d) => {
        const h = hours![d];
        const on = today === d;
        return (
          <li
            key={d}
            className="flex items-center justify-between gap-4 px-3 py-2.5"
            style={on ? { background: "var(--olive-wash)", borderRadius: "var(--radius-field)" } : undefined}
          >
            <span className={on ? "font-semibold text-olive" : ""}>
              {DAY_NAMES[d]}
              {on ? <span className="label ml-2 text-sm text-rust">Today</span> : null}
            </span>
            <span className={h ? "" : "text-stem"}>{h ? `${to12h(h.open)} – ${to12h(h.close)}` : "Closed"}</span>
          </li>
        );
      })}
    </ul>
  );
}
