import type { Metadata } from "next";
import { refind } from "@/lib/refind";
import Checkout from "@/components/store/Checkout";

export const metadata: Metadata = {
  title: `Checkout | ${refind.name}`,
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <section className="py-12 md:py-16">
      <div className="container-x">
        <Checkout />
      </div>
    </section>
  );
}
