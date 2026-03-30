import "server-only";

import { getDefaultOrigin } from "@/lib/origins";

export function getServerEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function isMissingServerEnvError(error: unknown, name?: string) {
  if (!(error instanceof Error)) {
    return false;
  }

  if (!error.message.startsWith("Missing required environment variable: ")) {
    return false;
  }

  if (!name) {
    return true;
  }

  return error.message === `Missing required environment variable: ${name}`;
}

export function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000"
  );
}

export function getAllowedOrigin() {
  return getDefaultOrigin();
}

export function getJwtExpiresIn() {
  const value = process.env.JWT_EXPIRES_IN?.trim();

  if (!value) {
    return "7d";
  }

  if (["no expires", "no-expiry", "never", "none"].includes(value.toLowerCase())) {
    return null;
  }

  return value;
}

export function getAdminNotificationEmail() {
  return "vibesup.event@gmail.com";
}
