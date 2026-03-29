"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/72 px-4 py-10 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-card glass-card-dark relative w-full max-w-5xl rounded-[26px] p-4 md:p-6"
            initial={{ opacity: 0, scale: 0.98, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 18 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="spec-line" />
            <button
              className="nav-mobile-button absolute right-4 top-4"
              onClick={onClose}
              aria-label="Close lightbox"
            >
              <X className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.4} />
            </button>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[20px]">
              <Image src={item.image} alt={item.title} fill className="object-cover" sizes="90vw" />
            </div>
            <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow mb-3">Gallery View</p>
                <h3 className="section-title text-[2rem]">
                  {item.title} <em>Moment</em>
                </h3>
                <p className="body-copy mt-3">{item.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="nav-mobile-button" onClick={onPrevious} aria-label="Previous image">
                  <ChevronLeft className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.4} />
                </button>
                <p className="eyebrow text-white/28">
                  {activeIndex + 1} / {items.length}
                </p>
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
