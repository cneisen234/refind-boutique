import type { Metadata } from "next";
import Link from "next/link";
import { refind, navLinks } from "@/lib/refind";
import HangTag from "@/components/HangTag";
import { Heart } from "@/components/Logo";
import { BrushBanner, HeartRule } from "@/components/Flier";
import { DaisySpray } from "@/components/Daisies";

// The 404 page: Refind's hang tag, priced "404", between the flier's daisies,
// then the way back to every page.

export const metadata: Metadata = {
  title: `Page not found | ${refind.name}`,
};

export default function NotFound() {
  const pages = navLinks.filter((l) => l.href !== "/");
  return (
    <section className="relative overflow-hidden pb-24 pt-24 md:pb-32 md:pt-28">
      <DaisySpray corner="tl" className="absolute -left-8 -top-6 w-[130px] sm:w-[200px] lg:w-[260px]" />
      <DaisySpray corner="tr" className="absolute -right-8 -top-6 hidden w-[200px] sm:block lg:w-[260px]" />

      <div className="container-x relative flex flex-col items-center text-center">
        <HangTag className="w-[168px] sm:w-[196px]">
          <span className="caps text-[2.4rem] leading-none text-olive sm:text-[2.8rem]">404</span>
          <Heart className="mt-2.5 h-3.5 w-auto" />
          <span className="label mt-2.5 text-[1rem] leading-tight text-stem sm:text-[1.1rem]">Page not found</span>
        </HangTag>

        <h1 className="caps mt-12 text-[2rem] md:text-[2.6rem]">We couldn’t find that page</h1>
        <HeartRule className="mt-8 w-full max-w-md" />

        <Link href="/" className="brush-link mt-10 inline-flex text-[1.25rem]">
          <BrushBanner className="h-12">Back to the home page</BrushBanner>
        </Link>
        <ul className="mt-8 flex flex-wrap justify-center gap-3">
          {pages.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="btn btn-outline">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
