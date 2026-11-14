import Link from "next/link";
import { refind, mainAction } from "@/lib/refind";
import { hoursRows } from "@/lib/time";
import { BrushBanner } from "./Flier";

/** The olive "Visit the shop" band that closes a page: address, hours,
 *  directions, and (optionally) the "We're buying" banner. */
export default function VisitBand({ buying = true }: { buying?: boolean }) {
  const rows = hoursRows();
  return (
    <section style={{ background: "var(--olive)", color: "var(--cream)" }}>
      <div className="container-x flex flex-col items-center py-20 text-center md:py-24">
        <h2 className="caps text-[1.9rem] md:text-[2.4rem]" style={{ color: "var(--cream)" }}>
          Visit the shop
        </h2>
        <address className="mt-4 text-xl not-italic leading-relaxed">
          {refind.address}, {refind.cityStateZip}
        </address>
        {rows.length ? (
          <dl className="mt-5 space-y-1" style={{ color: "var(--olive-wash)" }}>
            {rows.map((r) => (
              <div key={r.days} className="flex justify-center gap-4">
                <dt className="w-24 text-right">{r.days}</dt>
                <dd className="w-32 text-left" style={{ color: "var(--cream)" }}>
                  {r.time}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={refind.mapsHref} target="_blank" rel="noopener noreferrer" className="btn btn-cream">
            Get directions
          </a>
          <Link href="/visit" className="btn btn-cream-outline">
            Hours &amp; details
          </Link>
        </div>
        {buying ? (
          <>
            <p className="mt-10" style={{ color: "var(--olive-wash)" }}>
              Have pieces to sell?
            </p>
            <Link href={mainAction.href} className="brush-link mt-3 inline-flex text-[1.2rem]">
              <BrushBanner tone="cream" className="h-11">
                {mainAction.label}
              </BrushBanner>
            </Link>
          </>
        ) : null}
      </div>
    </section>
  );
}
