import "server-only";

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
  try {
    return new URL(getAppUrl()).origin;
  } catch {
    return "http://localhost:3000";
  }
}

export function getJwtExpiresIn() {
  return process.env.JWT_EXPIRES_IN || "7d";
}

export function getAdminNotificationEmail() {
  return "vibesup.event@gmail.com";
}
