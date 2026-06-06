import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  gold?: boolean;
  dark?: boolean;
  warm?: boolean;
  hover?: boolean;
};

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  goldWord: string;
  subtitle?: string;
  centered?: boolean;
};

type LiquidLinkButtonProps = {
  href: string;
  children: ReactNode;
  gold?: boolean;
  className?: string;
  external?: boolean;
};

type LiquidButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  gold?: boolean;
};

type PageHeroProps = {
  eyebrow: string;
  title: string;
  goldWord: string;
  description: string;
  align?: "left" | "center";
  actions?: ReactNode;
  media?: ReactNode;
};

function getGlassVariant(gold?: boolean, dark?: boolean, warm?: boolean) {
  if (gold) {
    return "glass-card glass-card-gold";
  }

  if (dark) {
    return "glass-card glass-card-dark";
  }

  if (warm) {
    return "glass-card glass-card-warm";
  }

  return "glass-card";
}

export function GlassCard({
  children,
  className = "",
  gold,
  dark,
  warm,
  hover = false,
}: GlassCardProps) {
  return (
    <div className={`${getGlassVariant(gold, dark, warm)} ${hover ? "glass-card-hover" : ""} ${className}`}>
      <div className="spec-line" />
      {children}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  goldWord,
  subtitle,
  centered = true,
}: SectionHeaderProps) {
  return (
    <div className={`${centered ? "text-center" : ""} mb-14`}>
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 className="section-title">
        {title} <em>{goldWord}</em>
      </h2>
      <div className={`${centered ? "mx-auto" : ""} mt-5 h-px w-12 gold-divider-centered`} />
      {subtitle ? (
        <p className={`body-copy mt-5 ${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function LiquidLinkButton({
  href,
  children,
  gold = false,
  className = "",
  external = false,
}: LiquidLinkButtonProps) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={`${gold ? "liquid-button-gold" : "liquid-button-ghost"} ${className}`}
    >
      {children}
    </Link>
  );
}

export function LiquidButton({
  gold = false,
  className = "",
  type = "button",
  ...props
}: LiquidButtonProps) {
  return (
    <button
      type={type}
      className={`${gold ? "liquid-button-gold" : "liquid-button-ghost"} ${className}`}
      {...props}
    />
  );
}

export function PageHero({
  eyebrow,
  title,
  goldWord,
  description,
  align = "left",
  actions,
  media,
}: PageHeroProps) {
  return (
    <section className="relative px-5 pb-10 pt-24 sm:px-10 sm:pb-20 sm:pt-32 lg:px-16 lg:pt-36">
      <div
        className={`mx-auto grid max-w-7xl gap-8 sm:gap-10 ${media ? "items-center lg:grid-cols-[1.05fr_0.95fr]" : ""}`}
      >
        <div className={align === "center" ? "text-center lg:col-span-2" : ""}>
          <p className={`eyebrow ${align === "center" ? "mx-auto" : ""} mb-5`}>{eyebrow}</p>
          <h1 className="display-title">
            {title} <em>{goldWord}</em>
          </h1>
          <div className={`mt-6 h-px w-24 ${align === "center" ? "mx-auto gold-divider-centered" : "gold-divider-left"}`} />
          <p
            className={`body-copy mt-5 max-w-2xl text-[0.88rem] leading-7 sm:mt-7 sm:text-[0.92rem] sm:leading-8 ${
              align === "center" ? "mx-auto text-center" : ""
            }`}
          >
            {description}
          </p>
          {actions ? (
            <div
              className={`mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4 [&>*]:w-full [&>*]:justify-center sm:[&>*]:w-auto ${
                align === "center" ? "justify-center" : "justify-start"
              }`}
            >
              {actions}
            </div>
          ) : null}
        </div>
        {media ? <div>{media}</div> : null}
      </div>
    </section>
  );
}
