import { BookOpenText, Newspaper, Sparkles } from "lucide-react";

import { BlogShowcase } from "@/components/site/blog-showcase";
import { GlassCard, PageHero, SectionHeader } from "@/components/site/liquid";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { BLOG_POSTS } from "@/lib/site-data";

export default function BlogPage() {
  return (
    <main className="overflow-x-hidden pb-20">
      <PageHero
        eyebrow="Journal"
        title="Insights, stories, and brand"
        goldWord="thinking"
        description="The VibeUp journal covers event strategy, cultural programming, production thinking, artist moments, and the broader ideas behind premium guest experience."
        align="center"
      />

      <section className="px-5 py-8 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            {
              icon: BookOpenText,
              label: "Event Strategy",
              body: "Thoughtful guidance for designing experiences that feel elevated and commercially effective.",
            },
            {
              icon: Newspaper,
              label: "Behind The Scenes",
              body: "A look at the operational and creative choices that shape the finished guest experience.",
            },
            {
              icon: Sparkles,
              label: "Culture & Growth",
              body: "Stories about community, artist programming, and how luxury event brands build long-term relevance.",
            },
          ].map((item) => (
            <GlassCard key={item.label} gold className="px-5 py-5">
              <item.icon className="mb-4 h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
              <p className="eyebrow mb-2">{item.label}</p>
              <p className="body-copy text-white/68">{item.body}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Editorial"
            title="Fresh writing from the"
            goldWord="team"
            subtitle="Use the filters to move between practical advice, post-event thinking, artist stories, and VibeUp company news."
          />
          <BlogShowcase posts={BLOG_POSTS} />
        </div>
      </section>

      <section className="px-5 pt-8 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <GlassCard warm className="px-6 py-8 text-center md:px-10 md:py-10">
            <p className="eyebrow mb-4">Newsletter</p>
            <h2 className="section-title">
              Receive journal releases and private event <em>updates</em>
            </h2>
            <p className="body-copy mx-auto mt-5 max-w-2xl">
              Stay close to new articles, ticket releases, cultural launches, and premium booking
              opportunities from the VibeUp team.
            </p>
            <div className="mt-8 flex justify-center">
              <NewsletterForm source="blog-newsletter" />
            </div>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
