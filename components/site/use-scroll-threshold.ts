"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollThreshold(threshold: number) {
  const [passedThreshold, setPassedThreshold] = useState(false);
  const passedThresholdRef = useRef(false);

  useEffect(() => {
    let frameId: number | null = null;

    const update = () => {
      frameId = null;
      const nextValue = window.scrollY > threshold;

      if (passedThresholdRef.current !== nextValue) {
        passedThresholdRef.current = nextValue;
        setPassedThreshold(nextValue);
      }
    };

    const scheduleUpdate = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(update);
      }
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [threshold]);

  return passedThreshold;
}
