import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";

import { SiteFooter } from "@/components/site/footer";
import { LuxuryCursor } from "@/components/site/luxury-cursor";
import { Orbs } from "@/components/site/orbs";
import { Navbar } from "@/components/navbar";
import { SITE } from "@/lib/site-data";
import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  variable: "--font-jost",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: {
    default: SITE.name,
    template: `%s | ${SITE.shortName}`,
  },
  description: SITE.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jost.variable} ${cormorant.variable} antialiased`}>
        <LuxuryCursor />
        <Orbs />
        <Navbar />
        <div className="relative z-10 min-h-screen">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
