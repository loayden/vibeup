"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

type LightboxItem = {
  image: string;
  title: string;
  date: string;
};

type LightboxProps = {
  items: readonly LightboxItem[];
  index: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

export function Lightbox({
  items,
  index,
  onClose,
  onNext,
  onPrevious,
}: LightboxProps) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    if (index === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowRight") {
        onNext();
      }

      if (event.key === "ArrowLeft") {
        onPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, onClose, onNext, onPrevious]);

  const item = index === null ? null : items[index];
  const activeIndex = index ?? 0;

  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/78 px-0 py-0 backdrop-blur-md sm:px-4 sm:py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-card glass-card-dark relative flex h-[100dvh] min-h-0 w-full flex-col rounded-none p-4 sm:h-auto sm:max-h-[calc(100dvh-5rem)] sm:max-w-5xl sm:rounded-[26px] sm:p-6"
            style={{
              overflowY: "auto",
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
            }}
            initial={{ opacity: 0, scale: 0.98, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 18 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0].clientX;
              touchStartY.current = event.touches[0].clientY;
            }}
            onTouchEnd={(event) => {
              const dx = event.changedTouches[0].clientX - touchStartX.current;
              const dy = event.changedTouches[0].clientY - touchStartY.current;

              if (Math.abs(dy) > Math.abs(dx) && dy > 60) {
                onClose();
                return;
              }

              if (Math.abs(dx) > 40) {
                if (dx < 0) {
                  onNext();
                } else {
                  onPrevious();
                }
              }
            }}
          >
            <div className="spec-line" />
            <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex justify-center">
              <p className="eyebrow rounded-full border border-white/10 bg-black/25 px-3 py-2 text-white/35">
                {activeIndex + 1} / {items.length}
              </p>
            </div>
            <button
              className="nav-mobile-button absolute right-4 top-4 z-10"
              onClick={onClose}
              aria-label="Close lightbox"
            >
              <X className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.4} />
            </button>
            <div className="relative flex-1 overflow-hidden rounded-[20px] sm:aspect-[16/10] sm:flex-none">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 90vw"
              />
              <button
                type="button"
                className="absolute inset-y-0 left-0 w-1/2 sm:hidden"
                aria-label="Previous image"
                onClick={onPrevious}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 w-1/2 sm:hidden"
                aria-label="Next image"
                onClick={onNext}
              />
            </div>
            <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow mb-3">Gallery View</p>
                <h3 className="section-title text-[2rem]">
                  {item.title} <em>Moment</em>
                </h3>
                <p className="body-copy mt-3">{item.date}</p>
              </div>
              <div className="hidden items-center gap-3 sm:flex">
                <button className="nav-mobile-button" onClick={onPrevious} aria-label="Previous image">
                  <ChevronLeft className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.4} />
                </button>
                <button className="nav-mobile-button" onClick={onNext} aria-label="Next image">
                  <ChevronRight className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.4} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
