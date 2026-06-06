"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

import { useDeviceProfile } from "@/components/site/use-device-profile";
import { useScrollThreshold } from "@/components/site/use-scroll-threshold";

type StickyBuyCTAProps = {
  href: string;
  label?: string;
  price?: number;
};

export function StickyBuyCTA({
  href,
  label = "Buy Tickets",
  price,
}: StickyBuyCTAProps) {
  const visible = useScrollThreshold(300);
  const { hasMounted, isMobile } = useDeviceProfile();
  const liteSurface = hasMounted && isMobile;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
                ...(liteSurface ? {} : { backdropFilter: "blur(20px)" }),
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
              {typeof price === "number" ? (
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.2rem",
                    color: "#ffffff",
                    fontWeight: 300,
                  }}
                >
                  From ${price}
                </span>
              ) : null}
            </Link>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
