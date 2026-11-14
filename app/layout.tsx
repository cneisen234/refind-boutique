import type { Metadata, Viewport } from "next";
import { Source_Serif_4, Yanone_Kaffeesatz, Catamaran } from "next/font/google";
import "./globals.css";
import { refind } from "@/lib/refind";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/store/CartProvider";
import CartDrawer from "@/components/store/CartDrawer";
import { FloatingBag } from "@/components/store/BagButton";
import OrderBar from "@/components/OrderBar";

// Each face is the measured match for a voice on the shop's flier.

// "WE'RE CURRENTLY PURCHASING" and every heading. The opsz axis lets large
// headings take the display cut, small ones the text cut.
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-source-serif",
});

// The cream capitals inside the dry-brush olive banners.
const yanone = Yanone_Kaffeesatz({
  subsets: ["latin"],
  variable: "--font-yanone",
});

// The flier's body text.
const catamaran = Catamaran({
  subsets: ["latin"],
  variable: "--font-catamaran",
});

export const metadata: Metadata = {
  title: `${refind.name} | Women's Resale Clothing in ${refind.townShort}`,
  description: refind.blurb,
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    title: `${refind.name} | ${refind.townShort}`,
    description: refind.blurb,
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#535129",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${yanone.variable} ${catamaran.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
          <OrderBar />
          <FloatingBag />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
