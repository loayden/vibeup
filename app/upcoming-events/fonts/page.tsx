"use client";

import { useRef } from "react";
import localFont from "next/font/local";

const playfair = localFont({
  src: [
    { path: "./fonts/PlayfairDisplay-Regular.woff2", weight: "400" },
    { path: "./fonts/PlayfairDisplay-SemiBold.woff2", weight: "600" },
    { path: "./fonts/PlayfairDisplay-Bold.woff2", weight: "700" },
  ],
  display: "swap",
});

const inter = localFont({
  src: [
    { path: "../fonts/Inter-Medium.woff2", weight: "500" },
    { path: "../fonts/Inter-SemiBold.woff2", weight: "600" },
  ],
  display: "swap",
});

export default function UpcomingEventsPage() {
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);

  const scrollNext = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className={`bg-black text-white ${inter.className}`}>
      {/* HERO VIDEO */}
      <div className="relative border-4 border-amber-400">
        <video
          src="/VIBEUP.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-[90vh] object-cover"
        />
      </div>

      {/* TEXT SECTION */}
      <div className="max-w-5xl mx-auto text-center py-24 px-6">
        <p className={`text-[26px] md:text-3xl leading-loose text-gray-300 tracking-wide ${playfair.className}`}>
          This is it… the final call of the year. 🔥
          <br />
          <br />
          One night. One celebration. One unforgettable New Year Gala Dinner
          2026.
          <br />
          Luxury black & gold décor, live Arabic stars, a five-star gala dinner,
          DJ, shows, and a countdown you’ll never forget.
        </p>
      </div>

      {/* SECOND VIDEO */}
      <div className="max-w-6xl mx-auto border border-amber-400 mb-24">
        <video
          src="/VIBEUP2.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-[70vh] object-cover"
        />
      </div>

      {/* SCROLLING PHOTOS */}
      <section className="relative py-24 bg-black">
        <h2 className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-amber-400/15 tracking-widest uppercase text-center px-6">
          A big thank you to the National Arab Orchestra beautifully led by Maestro
          Michael Ibrahim, and the superstar Eman Abdel Ghani. A night to
          remember, filled with music, magic, and timeless legends 🎶
        </h2>

        <div
          ref={scrollRef1}
          className="relative z-10 flex gap-6 overflow-x-auto px-12 scrollbar-hide"
        >
          {[
            "VIBEUP6.jpg",
            "VIBEUP7.jpg",
            "VIBEUP8.jpg",
            "VIBEUP9.jpg",
            "VIBEUP10.jpg",
            "VIBEUP11.jpg",
            "VIBEUP12.jpg",
            "VIBEUP13.jpg",
            "VIBEUP14.jpg",
            "VIBEUP15.jpg",
            "VIBEUP16.jpg",
            "VIBEUP17.jpg",
            "VIBEUP18.jpg",
          ].map((img) => (
            <div
              key={img}
              className="min-w-[280px] hover:scale-105 transition-transform duration-500 aspect-square border border-amber-400/60 shadow-[0_0_60px_rgba(255,191,0,0.15)] overflow-hidden"
            >
              <img src={`/${img}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <button
          onClick={() => scrollNext(scrollRef1)}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-5xl text-amber-400 opacity-80 hover:opacity-100 hover:scale-110 transition"
        >
          ➜
        </button>
      </section>

      {/* INTERVIEW VIDEO */}
      <section className="max-w-4xl mx-auto py-32 px-6 relative">
        <h3 className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-amber-400/15 tracking-widest uppercase text-center">
          🎶 Behind the Music – Exclusive Interview 🎤
        </h3>

        <div className="relative z-10 aspect-square border border-amber-400/60 shadow-[0_0_60px_rgba(255,191,0,0.15)]">
          <video
            src="/VIBEUP1.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        <p className="text-center mt-10 text-gray-300 leading-relaxed">
          Right after the unforgettable night of Voices of Legends, we interviewed
          Maestro Michael Ibrahim and soprano Eman Abdel Ghani to share their
          thoughts, emotions, and the magic of bringing timeless Arabic classics
          back to life on stage. ✨
        </p>
      </section>

      {/* SECOND PHOTO SCROLLER */}
      <section className="relative py-32 bg-black">
        <h2 className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-amber-400/15 tracking-widest uppercase text-center">
          ✨ The vibes are real ✨
          <br />
          Here’s Part 4 of our amazing guests at Bedouin White Party 🌙🔥
        </h2>

        <div
          ref={scrollRef2}
          className="relative z-10 flex gap-6 overflow-x-auto px-12 scrollbar-hide"
        >
          {[
            "VIBEUP.jpg",
            "VIBEUP2.jpg",
            "VIBEUP3.jpg",
            "VIBEUP4.jpg",
            "VIBEUP5.jpg",
          ].map((img) => (
            <div
              key={img}
              className="min-w-[280px] hover:scale-105 transition-transform duration-500 aspect-square border border-amber-400/60 shadow-[0_0_60px_rgba(255,191,0,0.15)] overflow-hidden"
            >
              <img src={`/${img}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <button
          onClick={() => scrollNext(scrollRef2)}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-5xl text-amber-400 opacity-80 hover:opacity-100 hover:scale-110 transition"
        >
          ➜
        </button>
      </section>

      {/* FINAL VIDEO */}
      <section className="max-w-4xl mx-auto py-32 px-6 relative">
        <h3 className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-amber-400/15 tracking-widest uppercase text-center">
          Thank you to @arabmaestro Maestro Michael Ibrahim and the National Arab
          Orchestra
        </h3>

        <div className="relative z-10 aspect-square border border-amber-400/60 shadow-[0_0_60px_rgba(255,191,0,0.15)]">
          <video
            src="/VIBEUP4.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </div>
  );
}