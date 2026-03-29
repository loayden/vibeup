import { notFound } from "next/navigation";
import Image from "next/image";

import { GlassCard, LiquidLinkButton, PageHero } from "@/components/site/liquid";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { BLOG_POSTS } from "@/lib/site-data";

type BlogPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const articleContent: Record<
  string,
  {
    body: string[];
    takeaways: string[];
  }
> = {
  "plan-the-perfect-arab-cultural-event": {
    body: [
      "The best Arab cultural events do not start with decoration. They start with tone. Before a venue is selected or an artist is booked, the room needs a point of view. Is the event ceremonial, celebratory, intimate, social, family-facing, or nightlife-driven? Without that clarity, decisions become expensive and inconsistent.",
      "Programming matters just as much as styling. Premium cultural events need pace: an arrival mood, a build, a focal performance moment, and a close that feels satisfying. When everything peaks at the same time, guests feel noise. When the energy rises in stages, guests feel intention.",
      "Hospitality is another major differentiator. Guests remember how the room moved, how they were greeted, how easy it was to find their seats, and whether the evening felt cared for. Luxury is often most visible in logistics that do not call attention to themselves.",
      "Finally, marketing should reflect the event's emotional promise. Strong campaigns do not just show what is happening. They show what it feels like to be there, what kind of guest belongs in the room, and why the event is worth dressing up for.",
    ],
    takeaways: [
      "Start with tone before aesthetics.",
      "Structure the evening in emotional phases.",
      "Treat hospitality as part of the luxury product.",
      "Market the feeling, not only the facts.",
    ],
  },
  "behind-the-scenes-new-years-eve-gala-2025": {
    body: [
      "Large countdown events test every part of an event company at once. New Year's Eve Gala 2025 required a different kind of control because guests arrived with high expectations before they ever saw the room. The production needed to feel premium from the very first greeting.",
      "One of the biggest hidden challenges was timing. Dinner service, stage cues, sound transitions, speeches, artist movement, and the midnight reveal all had to land on time without making the room feel rigid. Guests should feel freedom. The team behind the scenes should feel the clock.",
      "The visual language was equally important. Lighting, table spacing, and sightlines were adjusted to make the room read elegantly both in person and on camera. Luxury events today are lived twice: once in the room and again in the media they generate.",
      "When the final countdown happened, the room felt emotionally full but still controlled. That balance is what the best live experiences deliver: high energy with no visible panic underneath.",
    ],
    takeaways: [
      "Countdown events are won through timing, not noise.",
      "The backstage clock protects the guest experience.",
      "A room has to look strong both live and on camera.",
      "Control is what makes energy feel premium.",
    ],
  },
};

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogArticlePage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const article = articleContent[slug] || articleContent["plan-the-perfect-arab-cultural-event"];
  const relatedPosts = BLOG_POSTS.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <main className="overflow-x-hidden pb-20">
      <PageHero
        eyebrow={post.category}
        title={post.title.split(" ").slice(0, -1).join(" ")}
        goldWord={post.title.split(" ").slice(-1).join(" ")}
        description={post.excerpt}
        media={
          <GlassCard className="overflow-hidden p-3">
            <div className="relative min-h-[520px] overflow-hidden rounded-[18px]">
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
            </div>
          </GlassCard>
        }
        actions={
          <>
            <LiquidLinkButton href="/blog" gold>
              Back To Journal
            </LiquidLinkButton>
            <LiquidLinkButton href="/contact-us">Work With VibeUp</LiquidLinkButton>
          </>
        }
      />

      <section className="px-6 py-8 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <GlassCard className="px-6 py-7 md:px-8">
            <div className="flex flex-wrap gap-4">
              <p className="eyebrow">{post.date}</p>
              <p className="eyebrow text-white/28">{post.readTime}</p>
              <p className="eyebrow text-white/28">{post.author}</p>
            </div>

            <div className="mt-6 space-y-6">
              {article.body.map((paragraph) => (
                <p key={paragraph.slice(0, 36)} className="body-copy text-[0.92rem] text-white/62">
                  {paragraph}
                </p>
              ))}
            </div>
          </GlassCard>

          <div className="space-y-6">
            <GlassCard gold className="px-6 py-6">
              <p className="eyebrow mb-4">Key Takeaways</p>
              <div className="space-y-3">
                {article.takeaways.map((item) => (
                  <div
                    key={item}
                    className="rounded-[18px] border border-[rgba(198,169,98,0.2)] bg-[rgba(198,169,98,0.05)] px-4 py-4"
                  >
                    <p className="body-copy text-white/70">{item}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard warm className="px-6 py-6">
              <p className="eyebrow mb-4">Stay Connected</p>
              <p className="body-copy">
                Get future journal articles, event launches, and booking updates without waiting
                for public release.
              </p>
              <div className="mt-6">
                <NewsletterForm source={`blog-${post.slug}`} />
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="eyebrow mb-3">Related Reading</p>
            <h2 className="section-title text-[2.4rem]">
              More from the <em>journal</em>
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {relatedPosts.map((item) => (
              <GlassCard key={item.slug} hover className="h-full overflow-hidden p-3">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1280px) 28vw, (min-width: 768px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="px-3 pb-3 pt-5">
                  <p className="eyebrow mb-3">{item.category}</p>
                  <h3 className="font-serif text-[1.8rem] font-light tracking-[0.05em] text-white">
                    {item.title}
                  </h3>
                  <p className="body-copy mt-5">{item.excerpt}</p>
                  <div className="mt-6">
                    <LiquidLinkButton href={`/blog/${item.slug}`}>Read Article</LiquidLinkButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
