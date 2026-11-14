import type { Metadata } from "next";
import { refind, liveSales } from "@/lib/refind";
import live from "@/data/live.json";
import PageHero from "@/components/PageHero";
import { FlierPanel, Sprig, HeartRule } from "@/components/Flier";

// Live Sales: Refind's Tuesday Facebook Live, built like the Mio Chamber's
// events page (a header, the dated list, a "follow us on Facebook" note) and
// told only in Refind's own words from its posts (data/live.json, with sources).
// It states the schedule; it never predicts a date.

export const metadata: Metadata = {
  title: `Facebook Live Sales | ${refind.name}, ${refind.townShort}`,
  description: `Every Tuesday at 7 PM, ${refind.name} + ${liveSales.partner} go live on Facebook with preloved + upcycled fashion. Claim your favorites right from the comments.`,
};

export default function Live() {
  return (
    <>
      <PageHero label="Every Tuesday · 7 PM" title="Facebook Live Sales" flowers />

      {/* ---- When ---------------------------------------------------------- */}
      <section className="pb-20 md:pb-24">
        <div className="container-x">
          <div
            className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-[var(--radius)] p-7 text-center sm:flex-row sm:text-left"
            style={{ background: "var(--linen)", border: "var(--outline-width) solid var(--tan)" }}
          >
            <div
              className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-[var(--radius-field)]"
              style={{ background: "var(--olive)", color: "var(--cream)" }}
            >
              <span className="label text-base">Every</span>
              <span className="caps text-[1.35rem] leading-none" style={{ color: "var(--cream)" }}>
                Tue
              </span>
              <span className="label mt-1 text-base">7 PM</span>
            </div>
            <div className="flex-1">
              <p className="caps text-[1.35rem]">Live on Facebook</p>
              <p className="mt-1 text-[1.08rem]">
                {refind.name} +{" "}
                <a href={liveSales.partnerHref} target="_blank" rel="noopener noreferrer" className="font-semibold text-rust hover:underline">
                  {liveSales.partner}
                </a>
              </p>
              <p className="mt-1 text-stem">Second Tuesday of every month: a themed live.</p>
            </div>
            <a href={refind.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-outline shrink-0">
              Watch on Facebook
            </a>
          </div>
        </div>
      </section>

      {/* ---- How it works -------------------------------------------------- */}
      <section className="pb-20 md:pb-24">
        <div className="container-x">
          <FlierPanel title="How it works" className="mx-auto max-w-2xl">
            <ul className="dotted-rows">
              {live.how.map((line) => (
                <li key={line} className="flex items-center gap-4 py-3">
                  <Sprig className="h-7 w-4 shrink-0" />
                  <span className="text-[1.08rem] leading-snug">{line}</span>
                </li>
              ))}
            </ul>
          </FlierPanel>
        </div>
      </section>

      {/* ---- Themed lives -------------------------------------------------- */}
      <section className="pb-20 md:pb-24">
        <div className="container-x">
          <HeartRule className="mx-auto max-w-2xl" />
          <div className="mt-8 text-center">
            <h2 className="caps text-[1.9rem] md:text-[2.4rem]">Themed lives</h2>
            <p className="mx-auto mt-3 max-w-lg text-lg text-stem">{live.themes}</p>
          </div>
          <p className="caps mt-12 text-center text-sm text-stem">Past themes</p>
          <ul className="mx-auto mt-4 grid max-w-3xl gap-4">
            {live.pastThemes.map((t) => (
              <li
                key={t.name}
                className="flex items-center gap-5 rounded-[var(--radius)] p-4 pr-6"
                style={{ background: "var(--linen)", border: "var(--outline-width) solid var(--tan)" }}
              >
                <div
                  className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-[var(--radius-field)]"
                  style={{ background: "var(--cream)", border: "var(--outline-width) solid var(--tan)" }}
                >
                  <span className="label text-sm text-rust">{t.month}</span>
                  <span className="font-heading text-2xl font-semibold leading-none text-olive">{t.day}</span>
                </div>
                <div>
                  <p className="font-heading text-[1.25rem] font-semibold text-olive">{t.name}</p>
                  {t.note ? <p className="text-stem">{t.note}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- Follow along --------------------------------------------------- */}
      <section style={{ background: "var(--olive)", color: "var(--cream)" }}>
        <div className="container-x flex flex-col items-center py-20 text-center md:py-24">
          <h2 className="caps text-[1.9rem] md:text-[2.4rem]" style={{ color: "var(--cream)" }}>
            Follow along
          </h2>
          <p className="label mt-3 text-xl" style={{ color: "var(--olive-wash)" }}>
            {refind.name} + {liveSales.partner}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href={refind.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-cream">
              Follow on Facebook
            </a>
            <a href={refind.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-cream-outline">
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
