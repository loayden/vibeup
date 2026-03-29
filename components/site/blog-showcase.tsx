"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { GlassCard, LiquidLinkButton } from "@/components/site/liquid";
import type { BLOG_POSTS } from "@/lib/site-data";

type BlogPost = (typeof BLOG_POSTS)[number];

type BlogShowcaseProps = {
  posts: readonly BlogPost[];
};

export function BlogShowcase({ posts }: BlogShowcaseProps) {
  const categories = ["All", ...new Set(posts.map((post) => post.category))];
  const [activeCategory, setActiveCategory] = useState("All");

  const featuredPost = posts.find((post) => post.featured) || posts[0];
  const filteredPosts = posts.filter((post) => {
    if (post.slug === featuredPost.slug) {
      return false;
    }

    return activeCategory === "All" ? true : post.category === activeCategory;
  });

  return (
    <div className="space-y-10">
      <GlassCard hover className="overflow-hidden p-3">
        <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative min-h-[360px] overflow-hidden rounded-[18px]">
            <Image
              src={featuredPost.image}
              alt={featuredPost.title}
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover transition duration-500 hover:scale-105"
            />
          </div>

          <div className="px-6 py-7 md:px-8">
            <p className="eyebrow mb-3">Featured Article</p>
            <h3 className="section-title text-[2.4rem]">
              {featuredPost.title.split(" ").slice(0, -1).join(" ")}{" "}
              <em>{featuredPost.title.split(" ").slice(-1)}</em>
            </h3>
            <div className="gold-divider-left mt-5 h-px w-24" />
            <p className="body-copy mt-5">{featuredPost.excerpt}</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <p className="eyebrow">{featuredPost.category}</p>
              <p className="eyebrow text-white/28">{featuredPost.date}</p>
              <p className="eyebrow text-white/28">{featuredPost.readTime}</p>
            </div>
            <div className="mt-8">
              <LiquidLinkButton href={`/blog/${featuredPost.slug}`} gold>
                Read Feature
              </LiquidLinkButton>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            className={activeCategory === category ? "liquid-button-gold" : "liquid-button-ghost"}
            onClick={() => setActiveCategory(category)}
            data-cursor="hover"
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredPosts.map((post) => (
          <GlassCard key={post.slug} hover className="h-full overflow-hidden p-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(min-width: 1280px) 28vw, (min-width: 768px) 45vw, 100vw"
                className="object-cover transition duration-500 hover:scale-105"
              />
            </div>
            <div className="px-3 pb-3 pt-5">
              <div className="flex flex-wrap gap-3">
                <p className="eyebrow">{post.category}</p>
                <p className="eyebrow text-white/28">{post.readTime}</p>
              </div>
              <h3 className="mt-4 font-serif text-[1.8rem] font-light tracking-[0.05em] text-white">
                {post.title}
              </h3>
              <div className="gold-divider-left mt-4 h-px w-20" />
              <p className="body-copy mt-5">{post.excerpt}</p>
              <div className="mt-6 flex items-center justify-between gap-4">
                <p className="eyebrow text-white/28">{post.date}</p>
                <Link href={`/blog/${post.slug}`} className="eyebrow text-[var(--gold)]">
                  Read More
                </Link>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
