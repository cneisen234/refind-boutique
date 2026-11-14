import type { Metadata } from "next";
import Link from "next/link";
import { refind, liveSales } from "@/lib/refind";
import PageHero from "@/components/PageHero";
import Photo from "@/components/Photo";
import VisitBand from "@/components/VisitBand";
import { Sprig, Arrow } from "@/components/Flier";

// About: the shop, in its own words (the motto and bio from its Facebook and
// Instagram) and the facts it has published — what it is, where, and the ways
// it shops and buys. The structure of Megan's Sourdough's About (header, the
// story beside a photo, a closing call to action), kept to what's verifiable.

export const metadata: Metadata = {
  title: `About | ${refind.name}, ${refind.townShort}`,
  description: `${refind.name} is a women's resale boutique at ${refind.address} in ${refind.town}. ${refind.intro}`,
};

// Each fact is one Refind has published (Facebook page, Instagram, the flier).
const facts: { text: string; href?: string; link?: string }[] = [
  { text: "Preloved & upcycled fashion" },
  { text: "In-store shopping and in-store pickup" },
  {
    text: "We buy women’s clothing, shoes, handbags & accessories: cash or store credit on the spot",
    href: "/sell",
    link: "What we’re looking for",
  },
  {
    text: `Live on Facebook every Tuesday at ${liveSales.timeLabel} with ${liveSales.partner}`,
    href: "/live",
    link: "How live sales work",
  },
];

export default function About() {
  return (
    <>
      <PageHero label="About" title={refind.motto} flowers>
        <p>{refind.intro}</p>
      </PageHero>

      <section className="pb-20 md:pb-28">
        <div className="container-x grid items-center gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <Photo
            src="/photos/instore-smocked-dress-vignette.webp"
            alt="A smocked floral dress on a form behind a vintage Beverage tray, a woven placemat and a carved wooden bow"
            sizes="(min-width: 768px) 460px, 92vw"
            className="mx-auto aspect-[3/4] w-full max-w-md"
            position="50% 30%"
          />
          <div className="text-center md:text-left">
            <h2 className="caps text-[1.9rem] md:text-[2.4rem]">The shop</h2>
            <p className="mt-4 text-lg">
              A women’s resale boutique at {refind.address} in {refind.town}.
            </p>
            <ul className="dotted-rows mt-6 text-left">
              {facts.map((f) => (
                <li key={f.text} className="flex gap-4 py-3.5">
                  <Sprig className="mt-0.5 h-7 w-4 shrink-0" />
                  <span className="text-[1.08rem] leading-snug">
                    {f.text}
                    {f.href ? (
                      <span className="mt-1.5 block">
                        <Link href={f.href} className="link-arrow text-[0.98rem]">
                          {f.link} <Arrow />
                        </Link>
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <a href={refind.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                Facebook
              </a>
              <a href={refind.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      <VisitBand />
    </>
  );
}
