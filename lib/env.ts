import "server-only";

import { getDefaultOrigin } from "@/lib/origins";

export function getServerEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
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
  return process.env.JWT_EXPIRES_IN || "7d";
}

export function getAdminNotificationEmail() {
  return "vibesup.event@gmail.com";
}
