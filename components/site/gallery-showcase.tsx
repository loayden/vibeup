"use client";

import Image from "next/image";
import { useState } from "react";

import { Lightbox } from "@/components/site/lightbox";
import { GlassCard } from "@/components/site/liquid";
import type { GALLERY_ITEMS } from "@/lib/site-data";

type GalleryItem = (typeof GALLERY_ITEMS)[number];

type GalleryShowcaseProps = {
  items: readonly GalleryItem[];
};

export function GalleryShowcase({ items }: GalleryShowcaseProps) {
  const categories = [
    { key: "all", label: "All" },
    { key: "events", label: "Events" },
    { key: "behind-the-scenes", label: "Behind The Scenes" },
    { key: "venues", label: "Venues" },
    { key: "artists", label: "Artists" },
  ] as const;

  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]["key"]>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.key}
              className={activeCategory === category.key ? "liquid-button-gold" : "liquid-button-ghost"}
              onClick={() => setActiveCategory(category.key)}
              data-cursor="hover"
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="columns-1 gap-5 md:columns-2 xl:columns-3">
          {filteredItems.map((item, index) => (
            <div key={`${item.title}-${item.image}`} className="mb-5 break-inside-avoid">
              <button
                className="block w-full text-left"
                onClick={() => setLightboxIndex(index)}
                data-cursor="hover"
              >
                <GlassCard hover className="overflow-hidden p-3">
                  <div className="relative min-h-[280px] overflow-hidden rounded-[18px]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={960}
                      height={1200}
                      className="h-auto w-full object-cover transition duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(8,8,8,0.86))]" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="eyebrow mb-2">{item.date}</p>
                      <h3 className="font-serif text-[1.9rem] font-light tracking-[0.05em] text-white">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </GlassCard>
              </button>
            </div>
          ))}
        </div>
      </div>

      <Lightbox
        items={filteredItems}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNext={() =>
          setLightboxIndex((current) => {
            if (current === null) {
              return 0;
            }

            return current === filteredItems.length - 1 ? 0 : current + 1;
          })
        }
        onPrevious={() =>
          setLightboxIndex((current) => {
            if (current === null) {
              return 0;
            }

            return current === 0 ? filteredItems.length - 1 : current - 1;
          })
        }
      />
    </>
  );
}
