const LOCAL_DEV_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "http://localhost:3002",
  "http://127.0.0.1:3002",
];

export function normalizeOrigin(value?: string | null) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function splitOriginList(value?: string) {
  if (!value) {
    return [];
  }

  return value
    .split(/[,\n]/)
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function addOrigin(target: Set<string>, value?: string | null) {
  const normalized = normalizeOrigin(value);

  if (!normalized) {
    return;
  }

  target.add(normalized);

  try {
    const url = new URL(normalized);
    const isLocalHost = ["localhost", "127.0.0.1"].includes(url.hostname);

    if (isLocalHost) {
      return;
    }

    if (url.hostname.startsWith("www.")) {
      target.add(`${url.protocol}//${url.hostname.slice(4)}`);
      return;
    }

    target.add(`${url.protocol}//www.${url.hostname}`);
  } catch {
    return;
  }
}

export function getAllowedOrigins() {
  const origins = new Set<string>();

  for (const origin of splitOriginList(process.env.ALLOWED_ORIGINS)) {
    addOrigin(origins, origin);
  }

  addOrigin(origins, process.env.NEXT_PUBLIC_APP_URL);
  addOrigin(origins, process.env.NEXT_PUBLIC_BASE_URL);

  if (process.env.VERCEL_URL) {
    addOrigin(origins, `https://${process.env.VERCEL_URL}`);
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    addOrigin(origins, `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  }

  for (const origin of LOCAL_DEV_ORIGINS) {
    origins.add(origin);
  }

  if (!origins.size) {
    origins.add("http://localhost:3000");
  }

  return Array.from(origins);
}

export function getDefaultOrigin() {
  return getAllowedOrigins()[0] || "http://localhost:3000";
}

export function isAllowedOrigin(origin?: string | null) {
  const normalized = normalizeOrigin(origin);

  if (!normalized) {
    return !origin;
  }

  return getAllowedOrigins().includes(normalized);
}

export function resolveCorsOrigin(origin?: string | null) {
  const normalized = normalizeOrigin(origin);

  if (normalized) {
    return normalized;
  }

  return getDefaultOrigin();
}
