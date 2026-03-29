"use client";

import { useEffect, useState } from "react";

export function LuxuryCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) {
      return;
    }

    const handleMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
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

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
    };
  }, []);

  return (
    <div
      className={`luxury-cursor ${active ? "hover-active" : ""}`}
      style={{ transform: `translate3d(${position.x - 7}px, ${position.y - 7}px, 0)` }}
    />
  );
}
