import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const raceSans = { variable: "--font-race-sans", fontFamily: "'Race Sans', sans-serif" };
const raceSerif = { variable: "--font-race-serif", fontFamily: "'Race Serif', serif" };

export const metadata: Metadata = {
  title: "VIBEUP",
  description:
    "Celebrate New Year’s Eve in style. Luxury black‑tie gala with dinner, live DJ, VIP experience, and midnight countdown,vibeup,VIBEUP,party,parties,arab party,usa arab party.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${raceSans.variable} ${raceSerif.variable} antialiased bg-gradient-to-br from-black/80 via-[#1a0730]/70 to-[#2d1b09]/80 py-16 text-amber-200`}
      >
        <Navbar />
        <div className="pt-16">
          <div className="text-amber-400">{children}</div>
        </div>
      </body>
    </html>
  );
}
