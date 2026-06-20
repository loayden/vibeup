"use client";

import { useDeviceProfile } from "@/components/site/use-device-profile";
import { SITE } from "@/lib/site-data";

export function HomeHeroVisual() {
  const { shouldUseLiteMedia } = useDeviceProfile();

  return (
    !shouldUseLiteMedia ? (
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster="/bedouin/vibeup-31.jpg"
        preload="metadata"
        style={{ filter: "brightness(0.72) saturate(0.92)" }}
      >
        <source src={SITE.heroVideo} type="video/mp4" />
      </video>
    ) : null
  );
}
