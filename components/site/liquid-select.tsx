"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type LiquidSelectOption = {
  label: string;
  value: string;
};

type LiquidSelectProps = {
  id?: string;
  label?: string;
  options: readonly LiquidSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function LiquidSelect({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
}: LiquidSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const activeOption = useMemo(
    () => options.find((option) => option.value === value) || null,
    [options, value],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      {label ? <p className="eyebrow mb-3">{label}</p> : null}
      <button
        id={id}
        type="button"
        className="glass-input flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
      >
        <span className={activeOption ? "text-white/80" : "text-white/28"}>
          {activeOption?.label || placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[var(--gold)] transition-transform ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={1.3}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card glass-card-dark absolute left-0 right-0 top-[calc(100%+10px)] z-45 overflow-visible p-2"
          >
            <div className="spec-line" />
            <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-rgba" role="listbox">
              {options.map((option) => {
                const selected = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className="flex min-h-[52px] w-full items-center rounded-[16px] px-4 text-left transition-colors"
                    style={{
                      background: selected ? "rgba(198,169,98,0.08)" : "transparent",
                      color: selected ? "var(--gold)" : "var(--foreground)",
                    }}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        fontSize: "0.95rem",
                        letterSpacing: "0.04em",
                        fontWeight: 300,
                      }}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
