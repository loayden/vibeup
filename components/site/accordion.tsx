"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { GlassCard } from "@/components/site/liquid";

type AccordionItem = {
  question: string;
  answer: string;
};

type LiquidAccordionProps = {
  items: readonly AccordionItem[];
};

export function LiquidAccordion({ items }: LiquidAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <GlassCard key={item.question} dark hover className="px-5 py-4">
            <button
              className="flex w-full items-center justify-between gap-5 text-left"
              onClick={() => setOpenIndex((current) => (current === index ? null : index))}
              data-cursor="hover"
            >
              <span className="font-serif text-[1.45rem] font-light tracking-[0.05em] text-white">
                {item.question}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-[var(--gold)] transition ${isOpen ? "rotate-180" : ""}`}
                strokeWidth={1.2}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -8 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="gold-divider-left mt-4 h-px w-24" />
                  <p className="body-copy pt-5">{item.answer}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </GlassCard>
        );
      })}
    </div>
  );
}
