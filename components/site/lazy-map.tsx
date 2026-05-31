"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";

import { GlassCard, LiquidButton } from "@/components/site/liquid";

type LazyMapProps = {
  embedUrl: string;
  openUrl: string;
};

export function LazyMap({ embedUrl, openUrl }: LazyMapProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <GlassCard className="overflow-hidden p-3">
      <div className="overflow-hidden rounded-[18px]">
        {loaded ? (
          <iframe
            title="ZOYA Location"
            src={embedUrl}
            className="h-[360px] w-full border-0 sm:h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex min-h-[320px] flex-col items-center justify-center gap-5 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-5 text-center sm:min-h-[420px]">
            <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-[rgba(198,169,98,0.22)] bg-[rgba(198,169,98,0.08)]">
              <MapPin className="h-5 w-5 text-[var(--gold)]" strokeWidth={1.2} />
            </div>
            <div className="space-y-3">
              <p className="eyebrow">Map Preview</p>
              <p className="body-copy max-w-xl text-white/60">
                Load the interactive map only when you need it. This keeps the page lighter on
                mobile and faster on slow connections.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <LiquidButton gold className="w-full sm:w-auto" onClick={() => setLoaded(true)}>
                Load Map
              </LiquidButton>
              <a
                href={openUrl}
                target="_blank"
                rel="noreferrer"
                className="liquid-button-ghost w-full sm:w-auto"
              >
                Open In Maps
              </a>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
