import { TIME_ZONE, hours } from "@/lib/refind";

// The shop's local date, weekday and decimal hour, wherever the visitor is.
export function shopNow(date = new Date()): { day: number; dec: number; dateOfMonth: number; month: number; year: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    day: days.indexOf(get("weekday")),
    dec: Number(get("hour")) + Number(get("minute")) / 60,
    dateOfMonth: Number(get("day")),
    month: Number(get("month")),
    year: Number(get("year")),
  };
}

export function to12h(dec: number): string {
  const h = Math.floor(dec);
  const m = Math.round((dec - h) * 60);
  const hour = h % 12 || 12;
  const suffix = h >= 12 ? "PM" : "AM";
  return m === 0 ? `${hour} ${suffix}` : `${hour}:${m.toString().padStart(2, "0")} ${suffix}`;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** The week as display rows, Monday first, with runs of identical days grouped:
 *  [{ days: "Tue – Fri", time: "10 AM – 5 PM" }, …]. Empty while hours are unknown. */
export function hoursRows(): { days: string; time: string }[] {
  if (!hours) return [];
  const week = [1, 2, 3, 4, 5, 6, 0];
  const label = (d: number) => {
    const h = hours![d];
    return h ? `${to12h(h.open)} – ${to12h(h.close)}` : "Closed";
  };
  const rows: { from: number; to: number; time: string }[] = [];
  for (const d of week) {
    const time = label(d);
    const last = rows[rows.length - 1];
    if (last && last.time === time) last.to = d;
    else rows.push({ from: d, to: d, time });
  }
  return rows.map((r) => ({
    days: r.from === r.to ? DAY_NAMES[r.from] : `${SHORT[r.from]} – ${SHORT[r.to]}`,
    time: r.time,
  }));
}

export type Status = { open: boolean; line: string };

/** Open/closed right now, or null while the shop's hours aren't known. */
export function shopStatus(date = new Date()): Status | null {
  if (!hours) return null;
  const { day, dec } = shopNow(date);
  const today = hours[day];
  if (today && dec >= today.open && dec < today.close) {
    return { open: true, line: `Till ${to12h(today.close)} today` };
  }
  for (let i = 0; i < 8; i++) {
    const d = (day + i) % 7;
    const h = hours[d];
    if (!h) continue;
    if (i === 0 && dec < h.open) return { open: false, line: `Opens at ${to12h(h.open)}` };
    if (i === 1) return { open: false, line: `Opens ${to12h(h.open)} tomorrow` };
    if (i > 1) return { open: false, line: `Opens ${DAY_NAMES[d]} ${to12h(h.open)}` };
  }
  return { open: false, line: "" };
}

export type PickupDay = { key: string; label: string; sub: string; hours: string };

/**
 * The next `count` days the shop is open, for choosing a pickup day. Today
 * counts only while there's at least an hour left before closing.
 */
export function pickupDays(count = 6, date = new Date()): PickupDay[] {
  if (!hours) return [];
  const { day, dec, dateOfMonth, month, year } = shopNow(date);
  const out: PickupDay[] = [];
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (let i = 0; out.length < count && i < 21; i++) {
    const wd = (day + i) % 7;
    const h = hours[wd];
    if (!h) continue;
    if (i === 0 && dec > h.close - 1) continue;
    const d = new Date(Date.UTC(year, month - 1, dateOfMonth + i, 12));
    const sub = `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
    out.push({
      key: d.toISOString().slice(0, 10),
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : DAY_NAMES[wd].slice(0, 3),
      sub,
      hours: `${to12h(h.open)} – ${to12h(h.close)}`,
    });
  }
  return out;
}
