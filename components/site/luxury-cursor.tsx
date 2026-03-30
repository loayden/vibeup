"use client";

import { useEffect, useRef, useState, memo } from "react";

export const LuxuryCursor = memo(function LuxuryCursor() {
  const [active, setActive] = useState(false);
  const positionRef = useRef({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ✅ Early return for touch devices
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) {
      return;
    }

    // ✅ Respect accessibility preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // ✅ Use requestAnimationFrame for efficient updates
    let animationFrameId: number | null = null;

    const handleMove = (event: MouseEvent) => {
      positionRef.current = { x: event.clientX, y: event.clientY };

      // ✅ Batch DOM updates with RAF
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(() => {
          if (elementRef.current) {
            elementRef.current.style.transform = `translate3d(${positionRef.current.x - 7}px, ${positionRef.current.y - 7}px, 0)`;
          }
          animationFrameId = null;
        });
      }
    };

    const updateHoverState = (target: EventTarget | null, value: boolean) => {
      const element = target as HTMLElement | null;

      if (
        element?.closest(
          'a, button, input, textarea, select, summary, [role="button"], [data-cursor="hover"]',
        )
      ) {
        setActive(value);
      }
    };

    const handleOver = (event: MouseEvent) => updateHoverState(event.target, true);
    const handleOut = (event: MouseEvent) => updateHoverState(event.target, false);

    // ✅ Use passive listeners for better performance
    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseover", handleOver, { passive: true });
    document.addEventListener("mouseout", handleOut, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={`luxury-cursor ${active ? "hover-active" : ""}`}
      style={{ transform: `translate3d(0, 0, 0)` }}
    />
  );
});
