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
      <div className="flex flex-wrap gap-3">
        {groups.map((group) => (
          <button
            key={group.category}
            className={activeCategory === group.category ? "liquid-button-gold" : "liquid-button-ghost"}
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
