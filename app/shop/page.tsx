import type { Metadata } from "next";
import Link from "next/link";
import { refind, liveSales } from "@/lib/refind";
import PageHero from "@/components/PageHero";
import VisitBand from "@/components/VisitBand";
import PhotoGrid, { type GridPhoto } from "@/components/PhotoGrid";
import Storefront from "@/components/store/Storefront";
import { FlierPanel, HeartRule } from "@/components/Flier";

// Shop: the online store (a DEMO — see data/store.json) with the racks up
// front, then the shop itself (the structure of The Daily Scoop's gift-shop
// page: the gallery, then how to come get it), Tuesday's Facebook Live, and
// a visit band.

export const metadata: Metadata = {
  title: `Shop | ${refind.name}, ${refind.townShort}`,
  description: `${refind.intro} In the shop at ${refind.address}, ${refind.townShort}, and on Facebook Live every Tuesday.`,
};

const shop: GridPhoto[] = [
  {
    src: "/photos/instore-cabin-display.webp",
    alt: "A cabin-themed corner: wildlife tapestries, a loon painting, fleece pullovers, duck pillows and boots on a wooden bench",
    aspect: "4/3",
  },
  {
    src: "/photos/instore-rattan-shelf.webp",
    alt: "A rattan étagère filled with vintage mugs, plates, an owl canister, a beaded purse and a market basket",
    aspect: "4/3",
    position: "50% 35%",
  },
  {
    src: "/photos/instore-smocked-dress-vignette.webp",
    alt: "A smocked floral dress on a form behind a vintage Beverage tray, a woven placemat and a carved wooden bow",
    aspect: "4/3",
    position: "50% 30%",
  },
  {
    src: "/photos/instore-floral-shelves.webp",
    alt: "White shelves of small holiday floral arrangements in vintage mugs, above jars of candles and handmade goods",
    aspect: "4/3",
    position: "50% 20%",
  },
  {
    src: "/photos/instore-fall-boots.webp",
    alt: "A denim jacket and handbag on a form beside tall leather boots, leopard flats and a yellow pumpkin on a white table",
    aspect: "4/3",
    position: "50% 45%",
  },
  {
    src: "/photos/hero-outfit-wall.webp",
    alt: "The outfit wall: blouses, a denim jacket over a prairie dress, cardigans and skirts hung between woven baskets and metal butterflies",
    aspect: "4/3",
  },
];

export default function Shop() {
  return (
    <>
      <PageHero label="Shop" title="On the racks">
        <p>
          {refind.intro} In the shop at {refind.address}, {refind.town}.
        </p>
      </PageHero>

      {/* ---- The racks: the (demo) online store ---------------------------- */}
      <section className="pb-20 md:pb-24">
        <div className="container-x">
          <Storefront />
          <p className="mt-14 text-center text-stem">
            Every piece is one of a kind. Order online and pick it up in the shop.
          </p>
        </div>
      </section>

      {/* ---- The shop itself ---------------------------------------------- */}
      <section className="pb-20 md:pb-24">
        <div className="container-x">
          <HeartRule className="mx-auto max-w-2xl" />
          <h2 className="caps mt-8 text-center text-[1.9rem] md:text-[2.4rem]">Inside the shop</h2>
          <PhotoGrid
            photos={shop}
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 46vw, 92vw"
            className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          />
        </div>
      </section>

      {/* ---- Shopping from home -------------------------------------------- */}
      <section className="pb-20 md:pb-28">
        <div className="container-x">
          <HeartRule className="mx-auto max-w-2xl" />
          <h2 className="caps mt-8 text-center text-[1.9rem] md:text-[2.4rem]">Shop from home</h2>
          <div className="mx-auto mt-14 max-w-xl">
            <FlierPanel title="Every Tuesday at 7 PM">
              <div className="text-center">
                <p className="text-[1.08rem] leading-relaxed">{liveSales.how}</p>
                <p className="label mt-4 text-[1.1rem] text-olive">
                  Live on Facebook · {refind.name} + {liveSales.partner}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a href={refind.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                    Watch on Facebook
                  </a>
                  <Link href="/live" className="btn btn-text">
                    How live sales work
                  </Link>
                </div>
              </div>
            </FlierPanel>
          </div>
        </div>
      </section>

      <VisitBand />
    </>
  );
}
