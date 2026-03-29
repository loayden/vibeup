import { randomUUID } from "crypto";

export function sanitizeText(value: string, maxLength = 5000) {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeMultilineText(value: string, maxLength = 5000) {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n/g, "\n")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeOptionalText(
  value: string | null | undefined,
  maxLength = 5000,
) {
  if (!value) {
    return null;
  }

  const sanitized = sanitizeText(value, maxLength);
  return sanitized.length > 0 ? sanitized : null;
}

export function normalizeEmail(email: string) {
  return sanitizeText(email, 320).toLowerCase();
}

export function normalizeSlug(value: string) {
  return sanitizeText(value, 140)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateOrderNumber() {
  const token = randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  return `VU-${token}`;
}

export function generateTicketNumber() {
  return `TKT-${randomUUID().replace(/-/g, "").toUpperCase()}`;
}

export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function absoluteUrl(path: string) {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000";

  return new URL(path, base).toString();
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function parseInteger(value: string | null, fallback: number) {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function parseBoolean(value: string | null) {
  return value === "true";
}

export function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

export function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}
