"use client";

import Image from "next/image";

import { useDeviceProfile } from "@/components/site/use-device-profile";
import { SITE } from "@/lib/site-data";

export function HomeHeroVisual() {
  const { shouldUseLiteMedia } = useDeviceProfile();

  return (
    <>
      <Image
        src="/arabnights-1200.webp"
        alt="Hero background"
        fill
        className="absolute inset-0 object-cover"
        priority
        quality={75}
        sizes="100vw"
      />

      {!shouldUseLiteMedia ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster="/arabnights-1200.webp"
          preload="none"
          style={{ filter: "brightness(0.34) saturate(0.88)" }}
        >
          <source src={SITE.heroVideo} type="video/mp4" />
        </video>
      ) : null}
    </>
  );
}
