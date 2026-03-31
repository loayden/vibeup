"use client";

import { useRef, useState } from "react";

type SwipeCarouselProps = {
  items: readonly React.ReactNode[];
};

export function SwipeCarousel({ items }: SwipeCarouselProps) {
  const [current, setCurrent] = useState(0);
  const startX = useRef(0);

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(-${current * 100}%)`,
          willChange: "transform",
        }}
        onTouchStart={(event) => {
          startX.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          const delta = event.changedTouches[0].clientX - startX.current;

          if (delta < -40 && current < items.length - 1) {
            setCurrent((value) => value + 1);
          }

          if (delta > 40 && current > 0) {
            setCurrent((value) => value - 1);
          }
        }}
      >
        {items.map((item, index) => (
          <div key={index} className="w-full flex-shrink-0 px-1 scroll-snap-center" style={{ scrollSnapAlign: "center" }}>
            {item}
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-1.5">
        {items.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrent(index)}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: index === current ? 24 : 6,
              background:
                index === current ? "rgba(198,169,98,0.7)" : "rgba(255,255,255,0.20)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
