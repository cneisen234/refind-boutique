import type { ReactNode } from "react";
import { BrushBanner, HeartRule } from "./Flier";
import { DaisySpray } from "./Daisies";

/** A page's opening: the flier's brush-banner label, the page title in the
 *  flier's caps, a line or two, and the heart rule. Centered, like the flier.
 *  `flowers` adds the flier's corner bouquets. */
export default function PageHero({
  label,
  title,
  children,
  flowers = false,
}: {
  label: string;
  title: string;
  children?: ReactNode;
  flowers?: boolean;
}) {
  return (
    <section className="relative overflow-hidden pb-12 pt-12 md:pb-16 md:pt-16">
      {flowers ? (
        <>
          <DaisySpray corner="tl" className="absolute -left-8 -top-6 w-[130px] sm:w-[200px] lg:w-[260px]" />
          <DaisySpray corner="tr" className="absolute -right-8 -top-6 hidden w-[200px] sm:block lg:w-[260px]" />
        </>
      ) : null}
      <div className="container-x relative flex flex-col items-center text-center">
        <BrushBanner className="text-[1.2rem]">{label}</BrushBanner>
        <h1 className="caps mt-6 text-[2.3rem] md:text-[3.2rem]">{title}</h1>
        {children ? <div className="mt-4 max-w-xl text-lg text-stem">{children}</div> : null}
        <HeartRule className="mt-10 w-full max-w-md" />
      </div>
    </section>
  );
}
