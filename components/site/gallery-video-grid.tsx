"use client";

import { PlayCircle } from "lucide-react";

import { GlassCard } from "@/components/site/liquid";
import { useDeviceProfile } from "@/components/site/use-device-profile";
import type { GALLERY_VIDEOS } from "@/lib/site-data";

type VideoItem = (typeof GALLERY_VIDEOS)[number];

type GalleryVideoGridProps = {
  videos: readonly VideoItem[];
};

export function GalleryVideoGrid({ videos }: GalleryVideoGridProps) {
  const { shouldUseLiteMedia } = useDeviceProfile();

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {videos.map((video) => (
        <GlassCard key={video.title} hover className="overflow-hidden p-3">
          <div className="overflow-hidden rounded-[18px]">
            <video
              src={video.src}
              autoPlay={!shouldUseLiteMedia}
              muted
              loop={!shouldUseLiteMedia}
              controls={shouldUseLiteMedia}
              playsInline
              preload={shouldUseLiteMedia ? "none" : "metadata"}
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
  );
}
