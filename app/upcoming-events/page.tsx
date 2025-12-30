"use client";

import { useRef, useEffect, useState } from "react";
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"] });

function GoldFrameVideo({ src, className }: { src: string; className?: string }) {
  return (
    <div className={`relative border-[1px] border-amber-400 ${className || ""}`}>
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
}

function TextSection() {
  return (
    <div className={`max-w-5xl mx-auto text-center py-10 px-4 ${playfair.className}`}>
      <h2 className="text-center text-6xl font-bold text-amber-400 mb-12">Memories</h2>
      <p className="mt-6">
        {/* Add any additional text here if needed */}
      </p>
    </div>
  );
}

function SingleImageCarousel({
  images,
  heading,
  text,
}: {
  images: string[];
  heading: React.ReactNode;
  text?: React.ReactNode;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="max-w-6xl mx-auto py-12 px-4 flex flex-col md:flex-row items-center gap-8 bg-black">
      <div className="relative w-full md:w-1/2 aspect-square border-[1px] border-amber-400/60 shadow-[0_0_60px_rgba(255,191,0,0.15)] overflow-hidden flex items-center justify-center">
        <img
          src={`/${images[currentIndex]}`}
          alt={images[currentIndex]}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <button
          onClick={prevImage}
          aria-label="Previous image"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl text-amber-400 opacity-80 hover:opacity-100 hover:scale-110 transition select-none z-10 bg-black bg-opacity-30 rounded-full p-1"
        >
          ←
        </button>
        <button
          onClick={nextImage}
          aria-label="Next image"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl text-amber-400 opacity-80 hover:opacity-100 hover:scale-110 transition select-none z-10 bg-black bg-opacity-30 rounded-full p-1"
        >
          →
        </button>
      </div>
      <div className="w-full md:w-1/2 text-amber-400 text-lg md:text-xl font-semibold leading-relaxed whitespace-pre-line">
        {text || heading}
      </div>
    </section>
  );
}

function PhotoScroller({
  images,
  heading,
}: {
  images: string[];
  heading: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [images]);

  const scrollNext = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-12 bg-black">
      <h2 className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-amber-400/15 tracking-widest uppercase text-center px-4 select-none pointer-events-none">
        {heading}
      </h2>

      <div
        ref={scrollRef}
        className="relative z-10 flex gap-6 overflow-x-auto px-8 scrollbar-hide"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {images.map((img) => (
          <div
            key={img}
            className="min-w-[280px] hover:scale-105 transition-transform duration-500 aspect-square border-[1px] border-amber-400/60 shadow-[0_0_60px_rgba(255,191,0,0.15)] overflow-hidden cursor-pointer flex-shrink-0 scroll-snap-align-start"
          >
            <img src={`/${img}`} alt={img} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <button
        onClick={() => scrollNext(scrollRef)}
        aria-label="Scroll photos next"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl text-amber-400 opacity-80 hover:opacity-100 hover:scale-110 transition select-none"
      >
        ➜
      </button>
    </section>
  );
}

function SquareVideoSection({
  src,
  title,
  description,
}: {
  src: string;
  title: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <section className="max-w-4xl mx-auto py-16 px-4 relative">
      <h3 className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-amber-400/15 tracking-widest uppercase text-center select-none pointer-events-none">
        {title}
      </h3>

      <div className="relative z-10 aspect-square border-[1px] border-amber-400/60 shadow-[0_0_60px_rgba(255,191,0,0.15)] overflow-hidden">
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {description && (
        <p className="text-center mt-6 text-gray-300 leading-relaxed max-w-3xl mx-auto whitespace-pre-line">
          {description}
        </p>
      )}
    </section>
  );
}

function Separator() {
  return (
    <hr className="my-8 border-0 h-[1px] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 shadow-[0_0_8px_rgba(255,191,0,0.6)]" />
  );
}

export default function UpcomingEventsPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.12;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className={`bg-black text-white ${inter.className}`}>
      <audio ref={audioRef} autoPlay loop preload="auto">
        <source src="/luxury-ambient.mp3" type="audio/mpeg" />
      </audio>

      <button
        onClick={() => {
          if (!audioRef.current) return;
          if (audioRef.current.paused) {
            audioRef.current.play();
          } else {
            audioRef.current.pause();
          }
        }}
        className="
          fixed bottom-6 right-6 z-[9999]
          w-12 h-12 rounded-full
          bg-black
          border border-amber-400
          text-amber-400
          flex items-center justify-center
          shadow-[0_0_20px_rgba(255,191,0,0.6)]
          hover:scale-110 transition
        "
        aria-label="Toggle sound"
      >
        🔊
      </button>
      {/* Hero Video with gold frame */}
      <section className="w-full py-16 px-4 relative">
        <div className="relative z-10 mx-auto aspect-square border-[1px] border-amber-400/60 shadow-[0_0_60px_rgba(255,191,0,0.15)] overflow-hidden"
          style={{ width: "80vw", maxWidth: "100%", minWidth: "240px" }}>
          <video
            src="/VIBEUP.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-center mt-6 text-4xl font-bold text-amber-400">
          BE WITH OUR MEMORIES
        </h1>
        <p className="text-center mt-4 text-sm text-gray-300 max-w-xl mx-auto">
          and come to galaevent
            This is it… the final call of the year.
            One night. One celebration. One unforgettable New Year Gala Dinner 2026. Luxury black & gold décor, live Arabic stars, a five-star gala dinner, DJ, shows, and a countdown you’ll never forget.
        </p>
      </section>

      <Separator />

      {/* Main Text Section */}
      <TextSection />

      {/* Second Video as side-by-side layout */}
      <section className="max-w-6xl mx-auto py-16 px-4 flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/2 aspect-square border-[1px] border-amber-400/60 shadow-[0_0_60px_rgba(255,191,0,0.15)] overflow-hidden">
          <video
            src="/VIBEUP2.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 text-amber-400 text-lg md:text-xl font-semibold leading-relaxed whitespace-pre-line">
          {`A big thank you to the National Arab Orchestra beautifully led by Maestro Michael Ibrahim, for an unforgettable Voices of Legend Um Kalthoum concert. And a heartfelt thanks to the superstar Eman Abdel Ghani for adding that special magic to the evening. We’re truly grateful for your amazing performances! A night to remember`}
        </div>
      </section>

      <Separator />

      {/* Single-image carousel with text next to it */}
      <SingleImageCarousel
        images={[
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
        ]}
        heading={
          <>
            A big thank you to the National Arab Orchestra beautifully led by Maestro
            Michael Ibrahim, and the superstar Eman Abdel Ghani. A night to
            remember, filled with music, magic, and timeless legends 
          </>
        }
      />

      <Separator />

      {/* Interview Video with title and description */}
      <SquareVideoSection
        src="/VIBEUP1.mp4"
        title="🎶 Behind the Music – Exclusive Interview 🎤"
        description={
          <>
            Right after the unforgettable night of Voices of Legends, we interviewed
            Maestro Michael Ibrahim and soprano Eman Abdel Ghani to share their
            thoughts, emotions, and the magic of bringing timeless Arabic classics
            back to life on stage. ✨
          </>
        }
      />

      <Separator />

      {/* Single-image carousel with text next to it */}
      <SingleImageCarousel
        images={[
              "VIBEUP.jpg",
          "VIBEUP2.jpg",
          "VIBEUP3.jpg",
          "VIBEUP4.jpg",
          "VIBEUP5.jpg",
        ]}
        heading={
          <>
           Here’s Part 4 of our amazing guests at Bedouin White Party 🌙🔥
          </>
        }
        text={
          <>
           “Excited to bring the Bedouin White Party to Huntington Beach 🏝️ for the first time in California and United states 🇺🇸 🌟 Let the magic begin! #BedouinWhiteParty
          </>
        }
      />

      <Separator />

      {/* Final Video with side-by-side layout */}
      <section className="max-w-6xl mx-auto py-16 px-4 flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/2 aspect-square border-[1px] border-amber-400/60 shadow-[0_0_60px_rgba(255,191,0,0.15)] overflow-hidden">
          <video
            src="/VIBEUP4.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 text-amber-400 text-lg md:text-xl font-semibold leading-relaxed whitespace-pre-line">
          The National Arab Orchestra beautifully led by Maestro Michael Ibrahim, for an unforgettable Voices of Legend Um Kalthoum concert. And a heartfelt thanks to the superstar Eman Abdel Ghani for adding that special magic to the evening. We’re truly grateful for your amazing performances!” A night to remember, filled with music, magic, and timeless legends 🎶
        </div>
      </section>
    </div>
  );
}