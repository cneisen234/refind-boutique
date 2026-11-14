import type { Metadata } from "next";
import { refind } from "@/lib/refind";
import sell from "@/data/sell.json";
import PageHero from "@/components/PageHero";
import { FlierPanel, FlierIcon, Sprig, Flourish, type IconName } from "@/components/Flier";
import { Heart } from "@/components/Logo";

// Sell: the shop's "We're currently purchasing" flier as a page. Every line
// here is the flier's own wording (data/sell.json); the "What to expect" lines
// are grouped by step — booking, bringing your items, and the appointment.
// Nothing is added that the flier doesn't say.

export const metadata: Metadata = {
  title: `We’re Currently Purchasing | ${refind.name}, ${refind.townShort}`,
  description: `${refind.name} is currently purchasing women’s clothing (XS–XL+), shoes, handbags and accessories. Cash or store credit on the spot, by appointment, in ${refind.town}.`,
};

const [reviewed, cashOrCredit, notAll, folded, noBoxes, thirty] = sell.expect;

const steps: { title: string; lines: string[] }[] = [
  {
    title: "Book",
    lines: [`Call or text ${refind.phone}`, "or message us on Facebook to book your appointment"],
  },
  { title: "Bring", lines: [folded, noBoxes, thirty] },
  { title: "Your appointment", lines: [reviewed, cashOrCredit, notAll] },
];

export default function Sell() {
  return (
    <>
      <PageHero label="We’re buying" title="We’re currently purchasing" flowers>
        <p>Women’s clothing, shoes, handbags and accessories, by appointment.</p>
      </PageHero>

      {/* ---- Book, bring, get paid ----------------------------------------- */}
      <section className="pb-20 md:pb-24">
        <div className="container-x">
          <ol className="grid gap-14 md:grid-cols-3 md:gap-6 lg:gap-8">
            {steps.map((s, i) => (
              <li key={s.title}>
                <FlierPanel title={`${i + 1} · ${s.title}`} className="h-full">
                  <ul className={i === 0 ? "text-center" : "dotted-rows"}>
                    {i === 0 ? (
                      <li className="pt-1">
                        <a href={refind.smsHref} className="font-heading text-[1.6rem] font-semibold text-rust hover:underline">
                          {refind.phone}
                        </a>
                        <p className="mt-1 text-stem">Call or text</p>
                        <p className="mt-4">
                          or{" "}
                          <a href={refind.facebook} target="_blank" rel="noopener noreferrer" className="font-semibold text-rust hover:underline">
                            message us on Facebook
                          </a>{" "}
                          to book your appointment
                        </p>
                      </li>
                    ) : (
                      s.lines.map((line) => (
                        <li key={line} className="flex items-center gap-4 py-3">
                          <Sprig className="h-7 w-4 shrink-0" />
                          <span className="text-[1.05rem] leading-snug">{line}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </FlierPanel>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- What we're looking for --------------------------------------- */}
      <section className="pb-20 md:pb-24">
        <div className="container-x">
          <FlierPanel title="What we’re looking for" className="mx-auto max-w-3xl">
            <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {sell.lookingFor.map((item) => (
                <li key={item.text} className="flex items-center gap-4">
                  <FlierIcon name={item.icon as IconName} className="h-8 w-8 shrink-0" />
                  <span className="text-[1.08rem] leading-snug">
                    {item.text}
                    {item.note ? <span className="text-stem"> ({item.note})</span> : null}
                  </span>
                </li>
              ))}
            </ul>
          </FlierPanel>
        </div>
      </section>

      {/* ---- Brands we love ------------------------------------------------- */}
      <section id="brands" className="pb-20 md:pb-28">
        <div className="container-x">
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            <Flourish className="hidden h-4 w-24 sm:block lg:w-32" />
            <h2 className="caps flex items-center gap-3 text-[1.9rem] md:text-[2.4rem]">
              Brands we love <Heart className="h-7 w-auto md:h-8" />
            </h2>
            <Flourish flip className="hidden h-4 w-24 sm:block lg:w-32" />
          </div>
          <ul
            className="mx-auto mt-10 grid max-w-4xl grid-cols-2 overflow-hidden rounded-[var(--radius)] sm:grid-cols-3 lg:grid-cols-4"
            style={{ border: "var(--outline-width) solid var(--tan)", background: "var(--linen)" }}
          >
            {sell.brands.map((b, i) => (
              <li
                key={b.name}
                // 21 brands: in 2 or 4 columns the last one would sit alone beside
                // an empty gap, so it spans the row, centered, as on the flier.
                className={`flex min-h-[4.75rem] flex-col items-center justify-center px-3 py-4 text-center ${
                  i === sell.brands.length - 1 && sell.brands.length % 2 === 1 ? "col-span-2 sm:col-span-1 lg:col-span-4" : ""
                }`}
                style={{ borderRight: "1.5px dotted var(--rust-rule)", borderBottom: "1.5px dotted var(--rust-rule)", marginRight: "-1.5px", marginBottom: "-1.5px" }}
              >
                <span className="caps text-[0.98rem] text-olive">{b.name}</span>
                {b.note ? <span className="mt-0.5 text-sm text-stem">({b.note})</span> : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- Book your appointment ---------------------------------------- */}
      <section style={{ background: "var(--olive)", color: "var(--cream)" }}>
        <div className="container-x flex flex-col items-center py-20 text-center md:py-24">
          <h2 className="caps text-[1.9rem] md:text-[2.4rem]" style={{ color: "var(--cream)" }}>
            Book your appointment
          </h2>
          <p className="mt-3 text-lg" style={{ color: "var(--olive-wash)" }}>
            Call or text
          </p>
          <a href={refind.smsHref} className="mt-1 font-heading text-[2.2rem] font-semibold hover:underline md:text-[2.6rem]" style={{ color: "var(--cream)" }}>
            {refind.phone}
          </a>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={refind.smsHref} className="btn btn-cream">
              Text us
            </a>
            <a href={refind.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-cream-outline">
              Message us on Facebook
            </a>
          </div>
          <p className="mt-12 text-sm" style={{ color: "var(--olive-wash)" }}>
            {refind.name} · {refind.address}, {refind.cityStateZip}
          </p>
        </div>
      </section>
    </>
  );
}
