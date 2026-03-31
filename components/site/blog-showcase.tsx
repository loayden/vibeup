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
          <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] lg:min-h-[360px]">
            <Image
              src={featuredPost.image}
              alt={featuredPost.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 48vw"
              className="object-cover transition duration-500 hover:scale-105"
            />
          </div>

          <div className="px-5 py-6 sm:px-6 sm:py-7 md:px-8">
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
              <LiquidLinkButton href={`/blog/${featuredPost.slug}`} gold className="w-full justify-center sm:w-auto">
                Read Feature
              </LiquidLinkButton>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {categories.map((category) => (
          <button
            key={category}
            className={`${activeCategory === category ? "liquid-button-gold" : "liquid-button-ghost"} shrink-0`}
            onClick={() => setActiveCategory(category)}
            data-cursor="hover"
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <GlassCard key={post.slug} hover className="h-full overflow-hidden p-3">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[18px] sm:aspect-[4/3]">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="eyebrow text-white/28">{post.date}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="liquid-button-gold w-full justify-center sm:w-auto"
                >
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
