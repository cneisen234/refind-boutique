"use client";

import { useSyncExternalStore } from "react";
import { shopStatus, shopNow, to12h, type Status } from "@/lib/time";
import { hours } from "@/lib/refind";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
import { Heart } from "./Logo";
import HangTag from "./HangTag";

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
 * Refind's open sign: the hang tag (components/HangTag.tsx) saying OPEN or
 * CLOSED in the flier's caps, the wordmark's heart, and when it opens or closes.
 */
export function HangTagSign({ className = "" }: { className?: string }) {
  const s = useClock<Status>(shopStatus);
  if (s === null) return null;
  const open = s?.open ?? false;
  const word = s ? (open ? "Open" : "Closed") : "· · ·";
  return (
    <HangTag className={className} role="status" live="polite">
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
    </HangTag>
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
