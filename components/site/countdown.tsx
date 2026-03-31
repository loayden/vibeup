"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useMemo, memo } from "react";

type CountdownTimerProps = {
  targetDate: Date;
  label?: string;
};

type DeviceNavigator = Navigator & {
  deviceMemory?: number;
};

// ✅ Memoize the block to prevent unnecessary re-renders
const CountdownBlock = memo(function CountdownBlock({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      <div
        className="glass-card glass-card-gold relative flex items-center justify-center rounded-[18px]"
        style={{
          width: "clamp(56px, 18vw, 96px)",
          height: "clamp(56px, 18vw, 96px)",
        }}
      >
        <div className="spec-line" />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[clamp(1.45rem,6vw,2.5rem)] font-light tracking-[0.04em] text-[var(--gold)]"
          >
            {String(value).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
      <p className="eyebrow text-[clamp(7px,2vw,9px)] text-white/28">{label}</p>
    </div>
  );
});

export const CountdownTimer = memo(function CountdownTimer({
  targetDate,
  label,
}: CountdownTimerProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    // ✅ Detect low-end devices and adjust update frequency
    const deviceMemory = (navigator as DeviceNavigator).deviceMemory;
    const isLowEndDevice = deviceMemory !== undefined && deviceMemory <= 2;

    // ✅ Use longer interval on low-end devices (5s instead of 1s) to reduce re-renders
    const updateInterval = isLowEndDevice ? 5000 : 1000;

    const intervalId = window.setInterval(() => setNow(Date.now()), updateInterval);
    return () => window.clearInterval(intervalId);
  }, []);

  // ✅ Use useMemo to prevent recalculation on every render
  const { days, hours, minutes, seconds } = useMemo(() => {
    const difference = Math.max(targetDate.getTime() - now, 0);
    return {
      days: Math.floor(difference / 86_400_000),
      hours: Math.floor((difference / 3_600_000) % 24),
      minutes: Math.floor((difference / 60_000) % 60),
      seconds: Math.floor((difference / 1_000) % 60),
    };
  }, [now, targetDate]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {label ? <p className="eyebrow text-center">{label}</p> : null}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6">
        <CountdownBlock value={days} label="Days" />
        <CountdownBlock value={hours} label="Hours" />
        <CountdownBlock value={minutes} label="Minutes" />
        <CountdownBlock value={seconds} label="Seconds" />
      </div>
    </div>
  );
});
