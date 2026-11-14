import Link from "next/link";
import { refind, navLinks } from "@/lib/refind";
import { hoursRows } from "@/lib/time";
import { Wordmark } from "./Logo";

// Site footer: the wordmark in cream on the deepest olive, the header's six
// links under "Explore" (Pilot Light's docs/site-conventions.md §4), how to
// reach the shop, and where to follow along.

// The copyright year, cached with the page (Cache Components won't prerender a
// bare `new Date()`); it refreshes whenever the cache does.
async function copyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

const heading = "label mb-4 text-lg";

export default async function Footer() {
  const year = await copyrightYear();
  const rows = hoursRows();

  return (
    <footer className="mt-auto" style={{ background: "var(--olive-deep)", color: "var(--cream)" }}>
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1.2fr_1fr] md:gap-10">
        <div>
          <Link href="/" aria-label={`${refind.name}, home`} className="inline-block">
            <Wordmark tone="mono" title="" className="w-[210px]" />
          </Link>
          <p className="caps mt-6 text-sm" style={{ color: "var(--cream)" }}>
            {refind.motto}
          </p>
          <p className="mt-2 max-w-xs text-[0.95rem]" style={{ color: "var(--olive-wash)" }}>
            {refind.intro}
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className={heading} style={{ color: "var(--olive-wash)" }}>
            Explore
          </h2>
          <ul className="space-y-2">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={heading} style={{ color: "var(--olive-wash)" }}>
            Visit
          </h2>
          <address className="not-italic leading-relaxed">
            <a href={refind.mapsHref} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {refind.address}
              <br />
              {refind.cityStateZip}
            </a>
          </address>
          <p className="mt-4">
            Call or text{" "}
            <a href={refind.phoneHref} className="font-semibold hover:underline">
              {refind.phone}
            </a>
          </p>
          {rows.length ? (
            <dl className="mt-5 space-y-1 text-[0.95rem]">
              {rows.map((r) => (
                <div key={r.days} className="flex gap-3">
                  <dt className="w-24 shrink-0" style={{ color: "var(--olive-wash)" }}>
                    {r.days}
                  </dt>
                  <dd>{r.time}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        <div>
          <h2 className={heading} style={{ color: "var(--olive-wash)" }}>
            Follow along
          </h2>
          <ul className="space-y-2">
            <li>
              <a href={refind.facebook} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Facebook
              </a>
            </li>
            <li>
              <a href={refind.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(252, 244, 236, 0.16)" }}>
        <p className="container-x py-5 text-sm" style={{ color: "var(--olive-wash)" }}>
          &copy; {year} {refind.name} · {refind.townShort}
        </p>
      </div>
    </footer>
  );
}
