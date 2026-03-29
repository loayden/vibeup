import { Instagram, PlayCircle } from "lucide-react";

import { GalleryShowcase } from "@/components/site/gallery-showcase";
import { GlassCard, LiquidLinkButton, PageHero, SectionHeader } from "@/components/site/liquid";
import { GALLERY_ITEMS, GALLERY_VIDEOS, SITE } from "@/lib/site-data";

export default function GalleryPage() {
  return (
    <main className="overflow-x-hidden pb-20">
      <PageHero
        eyebrow="Gallery"
        title="A visual archive of atmosphere and"
        goldWord="craft"
        description="These frames show more than pretty rooms. They capture guest movement, editorial styling, production texture, and the kind of visual control that makes VibeUp events feel distinct."
        align="center"
      />

      <section className="px-6 py-8 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {[
            "Arrival moments, stage pacing, and guest-energy transitions are documented with the same care as the event itself.",
            "The gallery balances editorial beauty with operational reality so clients can see how premium atmosphere is actually built.",
            "Every image here is part of a broader production language: lighting, styling, performance, hospitality, and movement.",
          ].map((item, index) => (
            <GlassCard key={item} gold={index === 1} className="px-5 py-5">
              <p className="body-copy text-white/68">{item}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Gallery Filters"
            title="Moments from the VibeUp"
            goldWord="archive"
            subtitle="Filter by event type to explore headline rooms, behind-the-scenes builds, venue styling, and artist-focused moments."
          />
          <GalleryShowcase items={GALLERY_ITEMS} />
        </div>
      </section>

      <section className="px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Video Highlights"
            title="Short films with the same luxury"
            goldWord="tempo"
            subtitle="Motion matters. These sequences show how the room breathes, how the performance lands, and how energy changes across the night."
          />

          <div className="grid gap-6 lg:grid-cols-3">
            {GALLERY_VIDEOS.map((video) => (
              <GlassCard key={video.title} hover className="overflow-hidden p-3">
                <div className="overflow-hidden rounded-[18px]">
                  <video
                    src={video.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                <div className="px-3 pb-3 pt-5">
                  <div className="flex items-center gap-3">
                    <PlayCircle className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
                    <p className="eyebrow">Video Highlight</p>
                  </div>
                  <h3 className="mt-4 font-serif text-[1.8rem] font-light tracking-[0.05em] text-white">
                    {video.title}
                  </h3>
                  <p className="body-copy mt-5">{video.description}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pt-8 md:px-10 lg:px-16">
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
                Follow @vibeupevent
              </LiquidLinkButton>
            </div>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
