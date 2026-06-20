"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

type StickyBuyCTAProps = {
  href: string;
  label?: string;
};

export function StickyBuyCTA({
  href,
  label = "Contact Support",
}: StickyBuyCTAProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 0, opacity: 1 }}
        className="safe-bottom fixed inset-x-0 bottom-0 z-45 px-4 md:hidden"
      >
        <div
          className="overflow-hidden rounded-[20px]"
          style={{ boxShadow: "0 -8px 32px rgba(69,52,18,0.14)" }}
        >
          <Link
            href={href}
            className="sticky-buy-cta-link flex min-h-[56px] w-full items-center justify-between px-5"
            style={{
              background:
                "linear-gradient(135deg, rgba(198,169,98,0.96), rgba(143,108,34,0.96))",
              border: "1px solid rgba(125,95,29,0.36)",
            }}
          >
            <span
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.28em",
                color: "#ffffff",
                textTransform: "uppercase",
              }}
            >
              {label}
            </span>
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
