"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { GlassCard } from "@/components/site/liquid";
import type { SERVICES } from "@/lib/site-data";

type Service = (typeof SERVICES)[number];

type ServiceCatalogProps = {
  services: readonly Service[];
};

export function ServiceCatalog({ services }: ServiceCatalogProps) {
  const categories = ["All", ...new Set(services.map((service) => service.category))];
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [expandedService, setExpandedService] = useState<string>(services[0]?.title || "");

  const filteredServices =
    activeCategory === "All"
      ? services
      : services.filter((service) => service.category === activeCategory);

  return (
    <div className="space-y-8">
      <div className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {categories.map((category) => (
          <button
            key={category}
            className={`${activeCategory === category ? "liquid-button-gold" : "liquid-button-ghost"} shrink-0`}
            onClick={() => {
              setActiveCategory(category);
              const nextServices =
                category === "All"
                  ? services
                  : services.filter((service) => service.category === category);
              setExpandedService(nextServices[0]?.title || "");
            }}
            data-cursor="hover"
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredServices.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlassCard hover className="h-full overflow-hidden p-3">
              <div className="grid gap-0 xl:grid-cols-[0.42fr_0.58fr]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] xl:min-h-[280px]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 hover:scale-105"
                  />
                </div>

                <div className="px-5 pb-4 pt-5 md:px-6">
                  <button
                    type="button"
                    className="block w-full text-left"
                    onClick={() =>
                      setExpandedService((current) =>
                        current === service.title ? "" : service.title,
                      )
                    }
                  >
                    <p className="eyebrow mb-3">{service.category}</p>
                    <h3 className="font-serif text-[1.8rem] font-light tracking-[0.05em] text-white sm:text-[2rem]">
                      {service.title}
                    </h3>
                    <div className="gold-divider-left mt-4 h-px w-24" />
                    <p className="body-copy mt-5">{service.summary}</p>
                    <p className="eyebrow mt-5 text-[var(--gold)] md:hidden">
                      {expandedService === service.title ? "Hide details" : "View details"}
                    </p>
                  </button>

                  <div
                    className={`mt-6 space-y-3 ${expandedService === service.title ? "block" : "hidden"} md:block`}
                  >
                    {service.details.map((detail) => (
                      <div
                        key={detail}
                        className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-3"
                      >
                        <p className="body-copy text-white/60">{detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
