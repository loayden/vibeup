"use client"

import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";

function GoldFrameVideo({
  src,
  className,
  videosMuted,
  videoRefs,
}: {
  src: string;
  className?: string;
  videosMuted: boolean;
  videoRefs: React.MutableRefObject<HTMLVideoElement[]>;
}) {
  return (
    <div className={`relative border-[1px] border-amber-500/30 rounded-2xl overflow-hidden ${className || ""}`} style={{ 
      minWidth: 0, 
      minHeight: 0,
      background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.025) 100%)",
      backdropFilter: "blur(24px) saturate(160%)",
      boxShadow: "0 20px 56px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.14)"
    }}>
      <div
        className="absolute inset-x-5 top-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)" }}
      />
      <video
        ref={(el) => {
          if (el && !videoRefs.current.includes(el)) {
            videoRefs.current.push(el);
          }
        }}
        src={src}
        autoPlay
        loop
        muted={videosMuted}
        playsInline
        className="w-full h-full object-cover"
      />
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
    <section className="max-w-6xl mx-auto py-12 px-4 flex flex-col md:flex-row items-center gap-8">
      <div className="relative w-full md:w-1/2 aspect-square overflow-hidden flex items-center justify-center rounded-2xl" style={{
        minWidth: 0, 
        minHeight: 0,
        background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.025) 100%)",
        backdropFilter: "blur(24px) saturate(160%)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 20px 56px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.14)"
      }}>
        <div
          className="absolute inset-x-5 top-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)" }}
        />
        <img
          src={`/${images[currentIndex]}`}
          alt={images[currentIndex]}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <button
          onClick={prevImage}
          aria-label="Previous image"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, rgba(255,191,0,0.22), rgba(255,191,0,0.08))",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,191,0,0.35)",
            borderRadius: "9999px",
            padding: "12px 16px",
            color: "#FFBF00",
            cursor: "pointer",
            boxShadow: "0 0 28px rgba(255,191,0,0.12), inset 0 1px 0 rgba(255,255,255,0.14)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 0 32px rgba(255,191,0,0.20), inset 0 1px 0 rgba(255,255,255,0.14)"
            e.currentTarget.style.borderColor = "rgba(255,191,0,0.50)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 0 28px rgba(255,191,0,0.12), inset 0 1px 0 rgba(255,255,255,0.14)"
            e.currentTarget.style.borderColor = "rgba(255,191,0,0.35)"
          }}
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
        </button>
        <button
          onClick={nextImage}
          aria-label="Next image"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, rgba(255,191,0,0.22), rgba(255,191,0,0.08))",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,191,0,0.35)",
            borderRadius: "9999px",
            padding: "12px 16px",
            color: "#FFBF00",
            cursor: "pointer",
            boxShadow: "0 0 28px rgba(255,191,0,0.12), inset 0 1px 0 rgba(255,255,255,0.14)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 0 32px rgba(255,191,0,0.20), inset 0 1px 0 rgba(255,255,255,0.14)"
            e.currentTarget.style.borderColor = "rgba(255,191,0,0.50)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 0 28px rgba(255,191,0,0.12), inset 0 1px 0 rgba(255,255,255,0.14)"
            e.currentTarget.style.borderColor = "rgba(255,191,0,0.35)"
          }}
        >
          <ChevronRight size={20} strokeWidth={1.5} />
        </button>
      </div>
      <div className="w-full md:w-1/2" style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: "1rem",
        color: "rgba(255,255,255,0.70)",
        lineHeight: "1.8",
        letterSpacing: "0.03em"
      }}>
        {text || heading}
      </div>
    </section>
  );
}

function SquareVideoSection({
  src,
  title,
  description,
  videosMuted,
  videoRefs,
}: {
  src: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  videosMuted: boolean;
  videoRefs: React.MutableRefObject<HTMLVideoElement[]>;
}) {
  return (
    <section className="max-w-4xl mx-auto py-16 px-4 relative">
      <div className="relative z-10 aspect-square rounded-2xl overflow-hidden" style={{
        minWidth: 0, 
        minHeight: 0,
        background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.025) 100%)",
        backdropFilter: "blur(24px) saturate(160%)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 20px 56px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.14)"
      }}>
        <div
          className="absolute inset-x-5 top-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)" }}
        />
        <video
          ref={(el) => {
            if (el && !videoRefs.current.includes(el)) {
              videoRefs.current.push(el);
            }
          }}
          src={src}
          autoPlay
          loop
          muted={videosMuted}
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {description && (
        <div className="text-center mt-8" style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: "1rem",
          color: "rgba(255,255,255,0.70)",
          lineHeight: "1.8",
          letterSpacing: "0.03em",
          maxWidth: "600px",
          margin: "32px auto 0"
        }}>
          {description}
        </div>
      )}
    </section>
  );
}

function Separator() {
  return (
    <div style={{
      height: 1,
      background: "linear-gradient(90deg, transparent, rgba(255,191,0,0.4), transparent)",
      margin: "40px 0"
    }} />
  );
}

export default function MemoriesPage() {
  const [videosMuted, setVideosMuted] = useState(true);
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (!video) return;
      video.volume = 0.15;
      if (videosMuted) {
        video.muted = true;
      } else {
        video.muted = false;
        video.play().catch(() => {});
      }
    });
  }, [videosMuted]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (!video) return;

          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.6 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-white" style={{ fontFamily: "'Jost', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');
        body { background: #080808; }
        ::selection { background: #FFBF00; color: #080808; }
      `}</style>

      {/* Ambient Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div style={{
          position: "absolute", width: 700, height: 700, top: "-15%", right: "-10%",
          background: "radial-gradient(circle, rgba(255,191,0,0.08) 0%, transparent 65%)",
          filter: "blur(90px)", animation: "orbA 26s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", width: 550, height: 550, bottom: "5%", left: "-8%",
          background: "radial-gradient(circle, rgba(150,140,220,0.05) 0%, transparent 65%)",
          filter: "blur(80px)", animation: "orbB 32s ease-in-out infinite",
        }} />
        <style>{`
          @keyframes orbA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-28px,22px)} }
          @keyframes orbB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(32px,-18px)} }
        `}</style>
      </div>

      <main className="relative z-10 pt-24 pb-20">
        {/* Sound Toggle */}
        <button
          onClick={() => setVideosMuted(!videosMuted)}
          className="fixed bottom-8 right-8 z-[9999] transition-all duration-300"
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "9999px",
            background: "linear-gradient(135deg, rgba(255,191,0,0.22), rgba(255,191,0,0.08))",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,191,0,0.35)",
            boxShadow: "0 0 28px rgba(255,191,0,0.12), inset 0 1px 0 rgba(255,255,255,0.14)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFBF00"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,191,0,0.50)"
            e.currentTarget.style.boxShadow = "0 0 32px rgba(255,191,0,0.20), inset 0 1px 0 rgba(255,255,255,0.14)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,191,0,0.35)"
            e.currentTarget.style.boxShadow = "0 0 28px rgba(255,191,0,0.12), inset 0 1px 0 rgba(255,255,255,0.14)"
          }}
          aria-label="Toggle sound"
        >
          {videosMuted ? <VolumeX size={24} strokeWidth={1.5} /> : <Volume2 size={24} strokeWidth={1.5} />}
        </button>

        <div className="mx-auto max-w-7xl px-6">
          
          {/* Hero Section */}
          <section className="pb-20 border-b border-amber-500/20">
            {/* Eyebrow */}
            <p style={{
              fontFamily: "'Jost'",
              fontSize: "9px",
              letterSpacing: "0.45em",
              color: "rgba(255,255,255,0.20)"
            }} className="uppercase mb-4">
              Moments Captured
            </p>

            {/* Title */}
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 300,
              letterSpacing: "0.04em"
            }} className="mb-6">
              Stay Alive in Our <em style={{ color: "#FFBF00", fontStyle: "italic" }}>Memories</em>
            </h1>

            {/* Divider */}
            <div style={{
              height: 1,
              background: "linear-gradient(90deg, rgba(255,191,0,0.6), transparent)"
            }} className="mb-10 max-w-md" />

            {/* Hero Video */}
            <GoldFrameVideo
              src="/VIBEUP.mp4"
              className="mb-10 max-w-3xl"
              videosMuted={videosMuted}
              videoRefs={videoRefs}
            />

            {/* Hero Description */}
            <p style={{
              fontFamily: "'Jost'",
              fontSize: "1rem",
              letterSpacing: "0.06em",
              color: "rgba(255,255,255,0.65)",
              lineHeight: "1.8",
              maxWidth: "600px"
            }}>
              Let the moments we shared continue to live on in our hearts and memories, keeping the magic of this night alive forever.
            </p>
          </section>

          <Separator />

          {/* Featured Artist Section */}
          <section className="py-20">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
              <GoldFrameVideo
                src="/VIBEUP2.mp4"
                className="w-full md:w-1/2 aspect-square"
                videosMuted={videosMuted}
                videoRefs={videoRefs}
              />
              <div className="w-full md:w-1/2" style={{
                fontFamily: "'Jost'",
                fontSize: "1.05rem",
                color: "rgba(255,255,255,0.70)",
                lineHeight: "1.9",
                letterSpacing: "0.03em"
              }}>
                A big thank you to the National Arab Orchestra beautifully led by Maestro Michael Ibrahim, for an unforgettable Voices of Legend Um Kalthoum concert. And a heartfelt thanks to the superstar Eman Abdel Ghani for adding that special magic to the evening. We're truly grateful for your amazing performances! A night to remember.
              </div>
            </div>
          </section>

          <Separator />

          {/* Image Carousel 1 */}
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
                A big thank you to the National Arab Orchestra beautifully led by Maestro Michael Ibrahim, and the superstar Eman Abdel Ghani. A night to remember, filled with music, magic, and timeless legends.
              </>
            }
          />

          <Separator />

          {/* Interview Video */}
          <SquareVideoSection
            src="/VIBEUP1.mp4"
            title=""
            description={
              <>
                Right after the unforgettable night of Voices of Legends, we interviewed Maestro Michael Ibrahim and soprano Eman Abdel Ghani to share their thoughts, emotions, and the magic of bringing timeless Arabic classics back to life on stage. ✨
              </>
            }
            videosMuted={videosMuted}
            videoRefs={videoRefs}
          />

          <Separator />

          {/* Image Carousel 2 */}
          <SingleImageCarousel
            images={[
              "VIBEUP.jpg",
              "VIBEUP2.jpg",
              "VIBEUP3.jpg",
              "VIBEUP4.jpg",
              "VIBEUP5.jpg",
            ]}
            heading=""
            text={
              <>
                Excited to bring the Bedouin White Party to Huntington Beach 🏝️ for the first time in California and United States 🇺🇸 🌟 Let the magic begin! #BedouinWhiteParty
              </>
            }
          />

          <Separator />

          {/* Featured Video 2 */}
          <section className="py-20">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
              <GoldFrameVideo
                src="/VIBEUP4.mp4"
                className="w-full md:w-1/2 aspect-square"
                videosMuted={videosMuted}
                videoRefs={videoRefs}
              />
              <div className="w-full md:w-1/2" style={{
                fontFamily: "'Jost'",
                fontSize: "1.05rem",
                color: "rgba(255,255,255,0.70)",
                lineHeight: "1.9",
                letterSpacing: "0.03em"
              }}>
                The National Arab Orchestra beautifully led by Maestro Michael Ibrahim, for an unforgettable Voices of Legend Um Kalthoum concert. And a heartfelt thanks to the superstar Eman Abdel Ghani for adding that special magic to the evening. We're truly grateful for your amazing performances! A night to remember, filled with music, magic, and timeless legends 🎶
              </div>
            </div>
          </section>

          <Separator />

          {/* Artist Highlight Video */}
          <SquareVideoSection
            src="/VIBEUP9.mp4"
            title=""
            description={
              <>
                A heartfelt thank you to the incredible Abdel Karim Hamdan for lighting up the stage and giving us a performance filled with soul, passion, and unforgettable moments. ✨🎶
              </>
            }
            videosMuted={videosMuted}
            videoRefs={videoRefs}
          />

          <Separator />

          {/* Final Gallery */}
          <SingleImageCarousel
            images={[
              "VIBEUP21.jpeg",
              "VIBEUP22.jpeg",
              "VIBEUP23.jpeg",
              "VIBEUP24.jpeg",
              "VIBEUP25.jpeg",
              "VIBEUP26.jpeg",
              "VIBEUP27.jpeg",
            ]}
            heading={
              <>
                An unforgettable night ✨🥂
                From the first moment to the final countdown, this New Year's Gala was pure magic.
                A special thank you to our incredible stars, Abdelkarim Hamdan and Sherine Zaza, and to our amazing audience who made this night truly legendary. 🎆
              </>
            }
          />
        </div>
      </main>
    </div>
  );
}