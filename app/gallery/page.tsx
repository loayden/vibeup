import { Instagram } from "lucide-react";

import { GalleryShowcase } from "@/components/site/gallery-showcase";
import { GalleryVideoGrid } from "@/components/site/gallery-video-grid";
import { GlassCard, LiquidLinkButton, PageHero, SectionHeader } from "@/components/site/liquid";
import { GALLERY_ITEMS, GALLERY_VIDEOS, SITE } from "@/lib/site-data";

export default function GalleryPage() {
  return (
    <main className="overflow-x-hidden pb-20">
      <PageHero
        eyebrow="Gallery"
        title="See the rooms, guests, and"
        goldWord="craft"
        description="Browse real event moments, venue styling, performances, and behind-the-scenes production details."
        align="center"
      />

      <section className="px-5 py-8 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {[
            "Arrival, staging, and guest energy captured from real ZOYA productions.",
            "Venue styling, lighting, performance, and hospitality shown in one visual archive.",
            "Use the filters to compare event types, artists, venues, and production moments.",
          ].map((item, index) => (
            <GlassCard key={item} gold={index === 1} className="px-5 py-5">
              <p className="body-copy text-white/68">{item}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Gallery Filters"
            title="Filter the ZOYA"
            goldWord="archive"
            subtitle="Browse by event type to find the kind of atmosphere, styling, and production quality you want."
          />
          <GalleryShowcase items={GALLERY_ITEMS} />
        </div>
      </section>

      <section className="px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Video Highlights"
            title="Short films with the same luxury"
            goldWord="tempo"
            subtitle="Motion matters. These sequences show how the room breathes, how the performance lands, and how energy changes across the night."
          />

          <GalleryVideoGrid videos={GALLERY_VIDEOS} />
        </div>
      </section>

      <section className="px-5 pt-8 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <GlassCard gold className="px-6 py-8 text-center md:px-10 md:py-10">
            <Instagram className="mx-auto h-5 w-5 text-[var(--gold)]" strokeWidth={1.2} />
            <p className="eyebrow mt-4">Social Archive</p>
            <h2 className="section-title mt-4">
              Follow the visual <em>story</em>
            </h2>
            <p className="body-copy mx-auto mt-5 max-w-2xl">
              Follow the live stream of launches, recaps, rehearsal energy, and behind-the-scenes
              production detail on Instagram.
            </p>
            <div className="mt-8 flex justify-center">
              <LiquidLinkButton href={SITE.socials.instagram} gold external>
                Follow ZOYA on Instagram
              </LiquidLinkButton>
            </div>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
