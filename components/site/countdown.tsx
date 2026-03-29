"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type CountdownTimerProps = {
  targetDate: Date;
  label?: string;
};

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="glass-card glass-card-gold relative flex h-20 w-20 items-center justify-center rounded-[18px] md:h-24 md:w-24">
        <div className="spec-line" />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[2rem] font-light tracking-[0.04em] text-[var(--gold)] md:text-[2.5rem]"
          >
            {String(value).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
      <p className="eyebrow text-white/28">{label}</p>
    </div>
  );
}

export function CountdownTimer({ targetDate, label }: CountdownTimerProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const difference = Math.max(targetDate.getTime() - now, 0);
  const days = Math.floor(difference / 86_400_000);
  const hours = Math.floor((difference / 3_600_000) % 24);
  const minutes = Math.floor((difference / 60_000) % 60);
  const seconds = Math.floor((difference / 1_000) % 60);

  return (
    <div className="space-y-8">
      {label ? <p className="eyebrow text-center">{label}</p> : null}
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
        <CountdownBlock value={days} label="Days" />
        <CountdownBlock value={hours} label="Hours" />
        <CountdownBlock value={minutes} label="Minutes" />
        <CountdownBlock value={seconds} label="Seconds" />
      </div>
    </div>
  );
}
