"use client";

import { useState } from "react";

import { LiquidAccordion } from "@/components/site/accordion";
import type { FAQ_GROUPS } from "@/lib/site-data";

type FaqGroup = (typeof FAQ_GROUPS)[number];

type FaqShowcaseProps = {
  groups: readonly FaqGroup[];
};

export function FaqShowcase({ groups }: FaqShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState(groups[0]?.category || "General");
  const currentGroup = groups.find((group) => group.category === activeCategory) || groups[0];

  return (
    <div className="space-y-8">
      <div className="scrollbar-hide -mx-5 flex gap-2 overflow-x-auto px-5 pb-3 sm:mx-0 sm:flex-wrap sm:px-0">
        {groups.map((group) => (
          <button
            key={group.category}
            className={`${activeCategory === group.category ? "liquid-button-gold" : "liquid-button-ghost"} shrink-0`}
            onClick={() => setActiveCategory(group.category)}
            data-cursor="hover"
          >
            {group.category}
          </button>
        ))}
      </div>

      <LiquidAccordion items={currentGroup.items} />
    </div>
  );
}
