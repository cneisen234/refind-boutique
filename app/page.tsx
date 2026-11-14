import Link from "next/link";
import { refind, mainAction, liveSales } from "@/lib/refind";
import sell from "@/data/sell.json";
import outfits from "@/data/outfits.json";
import { Wordmark } from "@/components/Logo";
import { BrushBanner, FlierPanel, HeartRule, FlierIcon, Sprig, Arrow, type IconName } from "@/components/Flier";
import { DaisySpray } from "@/components/Daisies";
import Photo from "@/components/Photo";
import OutfitGallery from "@/components/OutfitGallery";
import { HangTagSign, OpenChip } from "@/components/OpenStatus";
import { hoursRows } from "@/lib/time";

// Home reads like the shop's flier come to life: the wordmark in its daisies,
// the outfit wall, the outfits she styles for an occasion, the flier's two
// buying panels, the shop itself, Tuesday's live sale, and how to get there.

export default function Home() {
  return (
    <>
      {/* ---- Hero: the flier's top, then the outfit wall ------------------- */}
      <section className="relative overflow-hidden pt-10 md:pt-14">
        <DaisySpray corner="tl" className="absolute -left-8 -top-6 w-[150px] sm:w-[220px] lg:w-[290px]" />
        <DaisySpray corner="tr" className="absolute -right-8 -top-6 hidden w-[220px] sm:block lg:w-[290px]" />

        <div className="container-x relative flex flex-col items-center text-center">
          <h1 className="w-full">
            <span className="sr-only">{refind.name}</span>
            <Wordmark title="" className="mx-auto w-[min(540px,78vw)]" />
          </h1>
          <HeartRule className="mt-7 w-full max-w-md" />
          <p className="caps mt-6 text-xl text-olive md:text-2xl">{refind.motto}</p>
          <p className="mt-3 max-w-md text-lg text-stem">
            {refind.intro} {refind.town}.
          </p>
          {/* Both actions share one height and type size so they sit on the same line. */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href={mainAction.href} className="brush-link inline-flex text-[1.25rem]">
              <BrushBanner className="h-12">{mainAction.label}</BrushBanner>
            </Link>
            <Link href="/shop" className="btn btn-text h-12 text-[1.25rem]">
              Shop the racks
            </Link>
          </div>
        </div>

        <div className="container-x relative mt-12 md:mt-16">
          {/* The open sign: a hang tag hanging off the outfit wall. */}
          <HangTagSign className="absolute -top-5 right-[7%] z-10 w-[104px] sm:w-[128px] lg:w-[148px]" />
          <Photo
            src="/photos/hero-outfit-wall.webp"
            alt="The outfit wall at Refind: blouses, a denim jacket over a prairie dress, cardigans and skirts hung between woven baskets and metal butterflies, with handbags and vintage bowls on the shelves above"
            sizes="(min-width: 1152px) 1088px, 94vw"
            className="aspect-[4/3] sm:aspect-[1920/996]"
            position="50% 40%"
            priority
          />
        </div>
      </section>

      {/* ---- Outfits for the occasion ------------------------------------- */}
      <section className="py-20 md:py-28">
        <div className="container-x">
          <OutfitGallery
            slides={outfits.slides}
            intro={
              <>
                <h2 className="caps text-[2rem] md:text-[2.6rem]">There’s a Refind look for that</h2>
                <p className="mx-auto mt-5 max-w-lg text-lg">{outfits.caption}</p>
              </>
            }
          />
        </div>
      </section>

      {/* ---- The flier: we're currently purchasing ------------------------ */}
      <section id="selling" className="pb-20 md:pb-28">
        <div className="container-x">
          <HeartRule className="mx-auto max-w-2xl" />
          <div className="mt-8 text-center">
            <h2 className="caps text-[2rem] md:text-[2.6rem]">We’re currently purchasing</h2>
          </div>

          <div className="mt-14 grid gap-14 md:grid-cols-2 md:gap-8 lg:gap-12">
            <FlierPanel title="What we’re looking for">
              <ul className="space-y-4">
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

            <FlierPanel title="What to expect">
              <ul className="dotted-rows">
                {sell.expect.map((line) => (
                  <li key={line} className="flex items-center gap-4 py-3">
                    <Sprig className="h-7 w-4 shrink-0" />
                    <span className="text-[1.08rem] leading-snug">{line}</span>
                  </li>
                ))}
              </ul>
            </FlierPanel>
          </div>

          <div className="mt-12 flex flex-col items-center text-center">
            <p className="text-stem">Call or text to book your appointment</p>
            <a href={refind.smsHref} className="mt-1 font-heading text-[2rem] font-semibold text-rust hover:underline md:text-[2.4rem]">
              {refind.phone}
            </a>
            <p className="mt-1 text-stem">
              or{" "}
              <a href={refind.facebook} target="_blank" rel="noopener noreferrer" className="font-semibold text-rust hover:underline">
                message us on Facebook
              </a>
            </p>
            <Link href="/sell#brands" className="link-arrow mt-6">
              The brands we love <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {/* ---- The shop ----------------------------------------------------- */}
      <section className="pb-20 md:pb-28">
        <div className="container-x">
          <div className="flex flex-col items-center text-center">
            <h2 className="caps text-[2rem] md:text-[2.6rem]">Come see for yourself</h2>
            <p className="mt-3 max-w-lg text-lg text-stem">
              Racks of women’s clothing, with vintage housewares and seasonal decor tucked in between.
            </p>
            <Link href="/shop" className="link-arrow mt-4">
              See what’s in the shop <Arrow />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-12 lg:grid-rows-[280px_280px]">
            <Photo
              src="/photos/instore-cabin-display.webp"
              alt="A cabin-themed corner: wildlife tapestries, a loon painting, fleece pullovers, duck pillows and boots on a wooden bench"
              sizes="(min-width: 1024px) 560px, 94vw"
              className="col-span-2 aspect-[4/3] lg:col-span-6 lg:row-span-2 lg:aspect-auto"
            />
            <Photo
              src="/photos/instore-smocked-dress-vignette.webp"
              alt="A smocked floral dress on a form behind a vintage Beverage tray, a woven placemat and a carved wooden bow"
              sizes="(min-width: 1024px) 280px, 47vw"
              className="aspect-[3/4] lg:col-span-3 lg:row-span-2 lg:aspect-auto"
            />
            <Photo
              src="/photos/instore-rattan-shelf.webp"
              alt="A rattan étagère filled with vintage mugs, plates, an owl canister, a beaded purse and a market basket"
              sizes="(min-width: 1024px) 280px, 47vw"
              className="aspect-[3/4] lg:col-span-3 lg:aspect-auto"
              position="50% 35%"
            />
            <Photo
              src="/photos/instore-floral-shelves.webp"
              alt="White shelves of small holiday floral arrangements in vintage mugs, above jars of candles and handmade goods"
              sizes="(min-width: 1024px) 280px, 94vw"
              className="col-span-2 aspect-[4/3] lg:col-span-3 lg:aspect-auto"
              position="50% 25%"
            />
          </div>
        </div>
      </section>

      {/* ---- Tuesday nights: the Facebook Live sale ----------------------- */}
      <section style={{ background: "var(--olive)", color: "var(--cream)" }}>
        <div className="container-x flex flex-col items-center py-20 text-center md:py-24">
          <BrushBanner tone="cream" className="text-[1.3rem]">
            Every Tuesday
          </BrushBanner>
          <h2 className="caps mt-6 text-[2rem] md:text-[2.6rem]" style={{ color: "var(--cream)" }}>
            Live on Facebook at {liveSales.timeLabel}
          </h2>
          <p className="mt-4 max-w-xl text-lg" style={{ color: "var(--olive-wash)" }}>
            {liveSales.how}
          </p>
          <p className="label mt-6 text-xl" style={{ color: "var(--cream)" }}>
            {refind.name} +{" "}
            <a href={liveSales.partnerHref} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
              {liveSales.partner}
            </a>
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href={refind.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-cream">
              Watch on Facebook
            </a>
            <Link href="/live" className="btn btn-cream-outline">
              How live sales work
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Visit -------------------------------------------------------- */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <DaisySpray corner="br" className="absolute -bottom-8 -right-8 hidden w-[260px] md:block" />
        <div className="container-x relative grid items-center gap-12 md:grid-cols-2">
          <div className="flex flex-col items-center text-center">
            <h2 className="caps text-[2rem] md:text-[2.6rem]">Visit the shop</h2>
            <address className="mt-5 text-xl not-italic leading-relaxed">
              {refind.address}
              <br />
              {refind.cityStateZip}
            </address>
            <p className="mt-3 text-lg">
              Call or text{" "}
              <a href={refind.phoneHref} className="font-semibold text-rust hover:underline">
                {refind.phone}
              </a>
            </p>
            {/* Both collapse while the shop's hours aren't known. */}
            <div className="mt-6 empty:hidden">
              <OpenChip />
            </div>
            {hoursRows().length ? (
              <dl className="mt-5 space-y-1">
                {hoursRows().map((r) => (
                  <div key={r.days} className="flex justify-center gap-4">
                    <dt className="w-24 text-right text-stem">{r.days}</dt>
                    <dd className="w-32 text-left">{r.time}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href={refind.mapsHref} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                Get directions
              </a>
              <Link href="/visit" className="link-arrow self-center px-2">
                Hours &amp; details <Arrow />
              </Link>
            </div>
          </div>
          <div
            className="overflow-hidden rounded-[var(--radius)]"
            style={{ border: "var(--outline-width) solid var(--tan)", background: "var(--linen)" }}
          >
            <iframe
              title={`Map to ${refind.name}, ${refind.address}, ${refind.townShort}`}
              src={refind.mapsEmbed}
              className="block aspect-[4/3] w-full"
              style={{ filter: "saturate(0.55) sepia(0.12)" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
