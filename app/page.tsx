"use client";

import {
  ArrowRight,
  CalendarDays,
  Globe2,
  MapPin,
  Music4,
  Sparkles,
  Users2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { HomeHeroVisual } from "@/components/site/home-hero-visual";
import { GlassCard, LiquidLinkButton } from "@/components/site/liquid";
import { SwipeCarousel } from "@/components/site/swipe-carousel";
import { SITE, GALLERY_ITEMS, HERO_STATS, UPCOMING_EVENTS } from "@/lib/site-data";

const bedouinPhotos = [
  "/bedouin/vibeup-384.jpg",
  "/bedouin/vibeup-36.jpg",
  "/bedouin/vibeup-31.jpg",
  "/bedouin/vibeup-50.jpg",
  "/bedouin/vibeup-381.jpg",
  "/bedouin/vibeup-64.jpg",
  "/bedouin/vibeup-70.jpg",
  "/bedouin/vibeup-51.jpg",
];

const experiencePoints = [
  {
    icon: Users2,
    title: "Arrival That Feels Hosted",
    body: "Guests step into a white-dress-code world with wristbands, portraits, and warm hospitality from the first minute.",
  },
  {
    icon: Music4,
    title: "Music With Cultural Texture",
    body: "Deep house, live violin, percussion, and performance moments move the night from sunset elegance into high-energy celebration.",
  },
  {
    icon: Sparkles,
    title: "Food, Lounge, And Service",
    body: "Majlis seating, grilled stations, shawarma service, mobile bartending, and relaxed table moments keep the experience premium.",
  },
];

const flow = [
  {
    step: "01",
    title: "Sunset Arrival",
    body: "White styling, beach atmosphere, wristbands, portraits, and welcome drinks.",
  },
  {
    step: "02",
    title: "Majlis Social",
    body: "Low seating, carpets, lanterns, food vendors, and easy conversation zones.",
  },
  {
    step: "03",
    title: "Peak Energy",
    body: "DJ sets, live musicians, dance circles, stage moments, and crowd interaction.",
  },
  {
    step: "04",
    title: "Night Lounge",
    body: "Moonlit seating, private groups, premium service, and a slower luxury close.",
  },
];

const worldCupMatches = [
  { day: "Friday", matches: ["Canada vs Qatar", "Mexico vs Korea", "USA vs Australia"] },
  { day: "Saturday", matches: ["Scotland vs Morocco"] },
  { day: "Sunday", matches: ["Tunisia vs Japan", "Spain vs Saudi Arabia"] },
  { day: "Monday", matches: ["New Zealand vs Egypt"] },
  { day: "Tuesday", matches: ["France vs Iraq", "Jordan vs Algeria"] },
];

const arabNations = ["Egypt", "Tunisia", "Algeria", "Morocco", "Canada", "USA", "Mexico", "Jordan", "Iraq", "Saudi Arabia", "Qatar"];

export default function HomePage() {
  const featuredEvent = UPCOMING_EVENTS[0];

  return (
    <main className="relative overflow-x-hidden bg-[url('/bedouin/carpet.jpeg')] bg-cover bg-center bg-no-repeat sm:bg-fixed" style={{ backgroundSize: 'auto 100%' }}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,8,8,0.34)_0%,rgba(11,6,6,0.42)_42%,rgba(9,5,5,0.58)_100%)]" />

      <section className="relative z-10 min-h-[92vh] overflow-hidden bg-transparent">
        <HomeHeroVisual />
        <div className="absolute inset-0 z-0 sm:hidden">
          <video
            src="/bedouin/recap2final.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.30)_0%,rgba(0,0,0,0.22)_45%,rgba(0,0,0,0.52)_100%)]" />
        <div className="relative z-10 flex min-h-[92vh] items-end px-5 pb-10 pt-20 sm:px-10 sm:pb-14 lg:px-16">
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="max-w-3xl on-image-text">
              <p className="eyebrow mb-4 text-white/70">WHITE PARTY EXPERIENCE</p>
              <h1 className="display-title text-white">
                BEDOUIN <em className="text-white">WHITE PARTIES</em>
              </h1>
              <div className="mt-6 h-px w-24 bg-[linear-gradient(90deg,var(--gold),rgba(255,255,255,0.1))]" />
              <p className="body-copy mt-6 max-w-2xl text-[0.92rem] leading-8 text-white/88 sm:text-[1rem]">
                Not just parties, a lifestyle in white. Premium beach and desert-style gatherings
                with white dress code, majlis lounges, live music, elevated food, and a community
                that comes ready to celebrate.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <LiquidLinkButton href="#experience" gold className="w-full justify-center sm:w-auto">
                  Explore the Party <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
                </LiquidLinkButton>
                <LiquidLinkButton href="/events" className="w-full justify-center sm:w-auto">
                  See This September <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
                </LiquidLinkButton>
              </div>
            </div>

            <GlassCard dark className="overflow-hidden p-3">
              <div className="relative overflow-hidden rounded-[18px]">
                <Image
                  src="/bedouin/vibeup-31.jpg"
                  alt="BEDOUIN White Party lounge on the sand"
                  width={1100}
                  height={1300}
                  priority
                  className="h-[320px] w-full object-cover sm:h-[460px]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 52vw, 42vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.84))]" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="eyebrow mb-2 text-white/70">A CULTURAL BRIDGE ON THE SAND</p>
                  <p className="font-serif text-[1.9rem] font-light leading-tight text-white">
                    Every September, we bring the world together on California’s coast.
                  </p>
                </div>
              </div>
              <div className="grid gap-3 px-1 pb-2 pt-4 sm:grid-cols-3">
                <div className="glass-card glass-card-dark rounded-[18px] px-4 py-4">
                  <CalendarDays className="mb-3 h-4 w-4 text-white" strokeWidth={1.2} />
                  <p className="eyebrow mb-2">Annual Edition</p>
                  <p className="body-copy text-white/86">September 19-20, 2026</p>
                </div>
                <div className="glass-card glass-card-dark rounded-[18px] px-4 py-4">
                  <MapPin className="mb-3 h-4 w-4 text-white" strokeWidth={1.2} />
                  <p className="eyebrow mb-2">Location</p>
                  <p className="body-copy text-white/86">California Coast</p>
                </div>
                <div className="glass-card glass-card-dark rounded-[18px] px-4 py-4">
                  <Globe2 className="mb-3 h-4 w-4 text-white" strokeWidth={1.2} />
                  <p className="eyebrow mb-2">Guests In 2025</p>
                  <p className="body-copy text-white/86">1,500+ from diverse backgrounds</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 py-4 sm:px-10 lg:px-16">
        <div className="mx-auto overflow-x-auto scrollbar-hide">
          <div className="inline-flex gap-4 px-1">
            <span className="flex-shrink-0 rounded-full bg-white/10 px-4 py-1.5 text-xs text-white/80 whitespace-nowrap">
              September 19–20, 2026
            </span>
            <span className="flex-shrink-0 rounded-full bg-white/10 px-4 py-1.5 text-xs text-white/80 whitespace-nowrap">
              California Coast
            </span>
            <span className="flex-shrink-0 rounded-full bg-white/10 px-4 py-1.5 text-xs text-white/80 whitespace-nowrap">
              1,500+ Guests
            </span>
            <span className="flex-shrink-0 rounded-full bg-white/10 px-4 py-1.5 text-xs text-white/80 whitespace-nowrap">
              Annual Edition
            </span>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 py-6 sm:px-10 lg:px-16">
        <Link href="/events" className="block">
          <div className="bg-gradient-to-r from-green-950 to-black border border-green-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🏟</span>
              <p className="eyebrow text-green-400">WORLD CUP FAN FESTIVAL</p>
            </div>
            <p className="body-copy text-white/80 mb-3">Grand Theater Anaheim</p>
            <p className="text-sm text-green-400 font-medium">View Details →</p>
          </div>
        </Link>
      </section>

      <section id="experience" className="relative z-10 px-5 py-12 sm:px-10 sm:py-16 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="eyebrow mb-4">THE EXPERIENCE</p>
            <h2 className="section-title">
              Parties designed like a full cultural <em>escape</em>
            </h2>
            <p className="body-copy mt-5 text-white/66">
              BEDOUIN White Parties blend the clean visual impact of all-white styling with
              Arabian-inspired hospitality, beach energy, curated music, food stations, and lounge
              moments that make every guest feel part of the scene.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {experiencePoints.map((item) => (
              <GlassCard key={item.title} hover className="h-full rounded-xl bg-white/5 border border-white/10 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <item.icon className="h-5 w-5 text-white" strokeWidth={1.2} />
                  <h3 className="section-subtitle text-[1.35rem]">{item.title}</h3>
                </div>
                <p className="body-copy text-white/64">{item.body}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="eyebrow mb-4">ABOUT BEDOUIN</p>
            <h2 className="section-title">
              A cultural bridge on the <em>sand</em>
            </h2>
            <p className="body-copy mt-5 text-white/66">
              Every September, we bring the world together for an extraordinary celebration on
              California's most breathtaking coasts. Launching its inaugural edition in 2025, the
              BEDOUIN White Party made a massive wave, welcoming over 1,500 guests from diverse
              backgrounds and nationalities to celebrate unity and community.
            </p>
            <p className="body-copy mt-4 text-white/66">
              This is more than just a beach party. It is a vibrant, immersive cultural bridge
              where global diversity meets the rich tapestry of Middle Eastern heritage through
              music, art, shared experience, and hospitality.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/8 bg-white/[0.02] px-5 py-6">
              <p className="eyebrow mb-3">Our Vision</p>
              <p className="body-copy text-white/64">
                To become the premier cultural beach festival in the United States and a leading
                global destination that seamlessly blends diverse communities while celebrating
                Arabic heritage in a modern, inclusive, and upscale setting.
              </p>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.02] px-5 py-6">
              <p className="eyebrow mb-3">Our Mission</p>
              <p className="body-copy text-white/64">
                To create an inspiring annual gathering that unites people of all backgrounds
                through the universal languages of art and music while presenting the true
                essence, joy, and hospitality of Arabic culture.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <LiquidLinkButton href="/events" gold>
              Join Us This September <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
            </LiquidLinkButton>
            <LiquidLinkButton href="/contact-us">Get Notified</LiquidLinkButton>
          </div>
        </div>
      </section>

      <section id="recap" className="relative z-10 px-5 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow mb-4">2025 RECAP</p>
              <h2 className="section-title">
                Relive the <em>night</em>
              </h2>
              <p className="body-copy mt-5 text-white/66">
                A look back at the energy, the crowd, and the moments that made our first BEDOUIN
                White Party unforgettable.
              </p>
            </div>
            <LiquidLinkButton href="/events" gold>
              Watch The 2025 Recap <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
            </LiquidLinkButton>
          </div>

          <GlassCard dark className="overflow-hidden p-3">
            <div className="overflow-hidden rounded-xl">
              <video
                src={SITE.heroVideo}
                autoPlay
                loop
                muted
                playsInline
                controls
                preload="metadata"
                poster="/bedouin/vibeup-31.jpg"
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          </GlassCard>
          <p className="text-xs text-white/50 text-center mt-2">2025 BEDOUIN White Party Recap</p>
        </div>
      </section>

      <section className="relative z-10 px-5 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <p className="eyebrow mb-4">PARTY FLOW</p>
            <h2 className="section-title">
              Every detail has a <em>role</em>
            </h2>
          </div>
          <div className="space-y-6 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 xl:grid-cols-4">
            {flow.map((item, index) => (
              <div key={item.step} className="relative pl-8 md:pl-0">
                <div className="hidden md:block">
                  <GlassCard key={item.step} hover className="h-full px-5 py-6">
                    <p className="font-serif text-[1.7rem] font-light tracking-[0.05em] text-white">
                      {item.step}
                    </p>
                    <h3 className="mt-2 section-subtitle text-[1.35rem]">{item.title}</h3>
                    <p className="body-copy mt-4 text-white/64">{item.body}</p>
                  </GlassCard>
                </div>
                <div className="md:hidden">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-black text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </div>
                      {index < flow.length - 1 && (
                        <div className="w-px flex-1 bg-white/20 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                      <p className="body-copy text-white/60 text-sm">{item.body}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <p className="eyebrow mb-4">THIS SEPTEMBER</p>
            <h2 className="section-title">
              BEDOUIN White Party <em>Calendar</em>
            </h2>
          </div>

          <div className="bg-white/5 border border-amber-500/30 rounded-xl p-5 mx-5">
            <div className="absolute top-4 right-4 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded">
              Sept 19-20
            </div>
            <div className="mb-4">
              <p className="eyebrow mb-2">Annual Edition</p>
              <h3 className="font-serif text-[1.5rem] font-light tracking-[0.05em] text-white">
                BEDOUIN White Party 2026
              </h3>
              <p className="body-copy mt-3 text-white/68">
                Premium beach and desert-style gatherings with white dress code, majlis lounges, live music, elevated food, and a community that comes ready to celebrate.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
                <p className="eyebrow mb-1 text-xs">Date</p>
                <p className="body-copy text-white/68 text-sm">September 19-20, 2026</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
                <p className="eyebrow mb-1 text-xs">Venue</p>
                <p className="body-copy text-white/68 text-sm">California Coast</p>
              </div>
            </div>
            <LiquidLinkButton href="/events" gold className="mt-4 w-full justify-center">
              Get Notified →
            </LiquidLinkButton>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <p className="eyebrow mb-4">REAL MOMENTS</p>
            <h2 className="section-title">
              See the atmosphere before you <em>book</em>
            </h2>
            <p className="body-copy mt-5 text-white/66">
              Open the gallery to understand the mood, crowd, food, music, and service standard.
            </p>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 px-5">
            {bedouinPhotos.map((src, index) => (
              <div key={src} className="flex-none w-[75vw] snap-start rounded-xl overflow-hidden aspect-[3/4] relative">
                <Image
                  src={src}
                  alt={`BEDOUIN gallery preview ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 75vw, 33vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.7))]" />
              </div>
            ))}
            <div className="flex-none w-[75vw] snap-start rounded-xl overflow-hidden aspect-[3/4] bg-white/5 border border-white/10 flex items-center justify-center">
              <Link href="/gallery" className="text-amber-400 font-medium">See Full Gallery →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="bg-gradient-to-r from-amber-900/20 to-black border border-amber-500/20 rounded-xl px-6 py-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="eyebrow mb-3 text-amber-400">MORE THAN A PARTY</p>
                <h2 className="section-title text-[2.2rem] text-white">
                  An immersive production that connects culture, people, music, food, and timeless
                  <em>moments</em>
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <LiquidLinkButton href="/events" gold className="w-full justify-center sm:w-auto">
                  Discover Events
                </LiquidLinkButton>
                <LiquidLinkButton href="/contact-us" className="w-full justify-center sm:w-auto">
                  Contact Us
                </LiquidLinkButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
