import type { Metadata } from "next";
import Link from "next/link";
import { refind, mainAction } from "@/lib/refind";
import PageHero from "@/components/PageHero";
import { FlierPanel, BrushBanner } from "@/components/Flier";
import { HangTagSign, HoursList, OpenChip } from "@/components/OpenStatus";

// Visit: hours and how to find the shop (The Daily Scoop's visit page: details
// and hours side by side, then the map), with Refind's hang-tag open sign
// hanging off the map like it hangs off the outfit wall on the home page.

export const metadata: Metadata = {
  title: `Hours & Directions | ${refind.name}, ${refind.townShort}`,
  description: `${refind.name}, ${refind.address}, ${refind.cityStateZip}. Hours, directions, and how to reach the shop.`,
};

export default function Visit() {
  return (
    <>
      <PageHero label="Visit" title="Hours & directions">
        <p>
          {refind.address}, {refind.cityStateZip}
        </p>
      </PageHero>

      <section className="pb-16 md:pb-20">
        <div className="container-x grid gap-14 md:grid-cols-2 md:gap-8 lg:gap-12">
          <FlierPanel title="Hours">
            <div className="mb-4 flex justify-center empty:hidden">
              <OpenChip />
            </div>
            <HoursList />
          </FlierPanel>

          <FlierPanel title="Find us">
            <div className="text-center">
              <address className="text-xl not-italic leading-relaxed">
                {refind.name}
                <br />
                {refind.address}
                <br />
                {refind.cityStateZip}
              </address>
              <a href={refind.mapsHref} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-5">
                Get directions
              </a>
              <div className="dotted-rows mt-7 text-left">
                <p className="py-3">
                  <span className="label mr-2 text-base text-stem">Call or text</span>
                  <a href={refind.phoneHref} className="font-semibold text-rust hover:underline">
                    {refind.phone}
                  </a>
                </p>
                <p className="py-3" style={{ borderTop: "1.5px dotted var(--rust-rule)" }}>
                  <span className="label mr-2 text-base text-stem">Message</span>
                  <a href={refind.facebook} target="_blank" rel="noopener noreferrer" className="font-semibold text-rust hover:underline">
                    Facebook
                  </a>
                  <span className="text-stem"> · </span>
                  <a href={refind.instagram} target="_blank" rel="noopener noreferrer" className="font-semibold text-rust hover:underline">
                    Instagram
                  </a>
                </p>
                <p className="py-3" style={{ borderTop: "1.5px dotted var(--rust-rule)" }}>
                  <span className="label mr-2 text-base text-stem">Online orders</span>
                  Pick up in the shop.{" "}
                  <Link href="/shop" className="font-semibold text-rust hover:underline">
                    Shop online
                  </Link>
                </p>
              </div>
            </div>
          </FlierPanel>
        </div>
      </section>

      {/* ---- The map, with the open sign hanging off it ------------------- */}
      <section className="pb-20 md:pb-28">
        <div className="container-x relative">
          <HangTagSign className="absolute -top-5 right-[8%] z-10 w-[104px] sm:w-[128px] lg:w-[148px]" />
          <div
            className="overflow-hidden rounded-[var(--radius)]"
            style={{ border: "var(--outline-width) solid var(--tan)", background: "var(--linen)" }}
          >
            <iframe
              title={`Map to ${refind.name}, ${refind.address}, ${refind.townShort}`}
              src={refind.mapsEmbed}
              className="block aspect-[4/3] w-full sm:aspect-[16/7]"
              style={{ filter: "saturate(0.55) sepia(0.12)" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="mt-12 flex flex-col items-center text-center">
            <p className="text-stem">Have pieces to sell?</p>
            <Link href={mainAction.href} className="brush-link mt-3 inline-flex text-[1.2rem]">
              <BrushBanner className="h-11">{mainAction.label}</BrushBanner>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
