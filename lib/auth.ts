import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

import { getJwtExpiresIn, getServerEnv } from "@/lib/env";
import { isMissingSupabaseTableError } from "@/lib/supabase-errors";
import {
  createPublicServerClient,
  tryCreateAdminClient,
} from "@/lib/supabase-server";
import { normalizeEmail } from "@/lib/utils";
import type { TableRow } from "@/types/database";

const SESSION_COOKIE_NAME = "vibeup_session";

export type AuthProfile = TableRow<"profiles">;
export type AuthenticatedUser = {
  id: string;
  email: string;
};

type AuthSuccess = {
  ok: true;
  user: AuthenticatedUser;
  profile: AuthProfile;
};

type AuthFailure = {
  ok: false;
  error: "Unauthorized" | "Forbidden";
  status: 401 | 403;
};

type SessionPayload = {
  sub: string;
  email: string;
};

function getJwtSecret() {
  return new TextEncoder().encode(getServerEnv("JWT_SECRET"));
}

export function buildFallbackProfile(input: {
  id: string;
  email: string;
  fullName?: string | null;
}): AuthProfile {
  const now = new Date().toISOString();

  return {
    id: input.id,
    full_name: input.fullName?.trim() || "ZOYA Admin",
    email: normalizeEmail(input.email),
    phone: null,
    avatar_url: null,
    role: "customer",
    email_verified: true,
    marketing_opt_in: false,
    created_at: now,
    updated_at: now,
  };
}

export async function signSessionToken(payload: SessionPayload) {
  const expiresIn = getJwtExpiresIn();
  let jwt = new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt();

  if (expiresIn) {
    jwt = jwt.setExpirationTime(expiresIn);
  }

  return jwt.sign(getJwtSecret());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret());

  if (!payload.sub || typeof payload.email !== "string") {
    throw new Error("Invalid session token");
  }

  return {
    sub: payload.sub,
    email: payload.email,
  };
}

export function getAuthToken(request: NextRequest) {
  const header = request.headers.get("authorization");

  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }

  return request.cookies.get(SESSION_COOKIE_NAME)?.value || null;
}

export async function getAuthUser(request: NextRequest) {
  const token = getAuthToken(request);

  if (!token) {
    return { ok: false, error: "Unauthorized", status: 401 } satisfies AuthFailure;
  }

  try {
    const payload = await verifySessionToken(token);
    const supabase = tryCreateAdminClient();

    if (!supabase) {
      const fallbackProfile = buildFallbackProfile({
        id: payload.sub,
        email: payload.email,
      });

      return {
        ok: true,
        user: {
          id: fallbackProfile.id,
          email: fallbackProfile.email,
        },
        profile: fallbackProfile,
      } satisfies AuthSuccess;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", payload.sub)
      .single<AuthProfile>();

    if (isMissingSupabaseTableError(error)) {
      const fallbackProfile = buildFallbackProfile({
        id: payload.sub,
        email: payload.email,
      });

      return {
        ok: true,
        user: {
          id: fallbackProfile.id,
          email: fallbackProfile.email,
        },
        profile: fallbackProfile,
      } satisfies AuthSuccess;
    }

    if (error || !profile) {
      return { ok: false, error: "Unauthorized", status: 401 } satisfies AuthFailure;
    }

    if (normalizeEmail(profile.email) !== normalizeEmail(payload.email)) {
      return { ok: false, error: "Unauthorized", status: 401 } satisfies AuthFailure;
    }

    return {
      ok: true,
      user: {
        id: profile.id,
        email: profile.email,
      },
      profile,
    } satisfies AuthSuccess;
  } catch {
    return { ok: false, error: "Unauthorized", status: 401 } satisfies AuthFailure;
  }
}

export async function requireAuth(request: NextRequest) {
  return getAuthUser(request);
}

export async function requireAdmin(request: NextRequest) {
  const result = await requireAuth(request);

  if (!result.ok) {
    return result;
  }

  if (!["admin", "super_admin"].includes(result.profile.role)) {
    return { ok: false, error: "Forbidden", status: 403 } satisfies AuthFailure;
  }

  return result;
}

export async function requireStaff(request: NextRequest) {
  const result = await requireAuth(request);

  if (!result.ok) {
    return result;
  }

  if (!["staff", "admin", "super_admin"].includes(result.profile.role)) {
    return { ok: false, error: "Forbidden", status: 403 } satisfies AuthFailure;
  }

  return result;
}

export function applySessionCookie(response: NextResponse, token: string) {
  const expiresIn = getJwtExpiresIn();

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: expiresIn ? 60 * 60 * 24 * 7 : 60 * 60 * 24 * 365 * 10,
  });

  return response;
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });

  return response;
}

export async function signInWithSupabase(email: string, password: string) {
  const supabase = createPublicServerClient();

  return supabase.auth.signInWithPassword({
    email: normalizeEmail(email),
    password,
  });
}

export async function requestPasswordReset(email: string, redirectTo: string) {
  const supabase = createPublicServerClient();

  return supabase.auth.resetPasswordForEmail(normalizeEmail(email), {
    redirectTo,
  });
}

export async function resetPasswordWithRecoveryToken(
  tokenHash: string,
  password: string,
) {
  const supabase = createPublicServerClient();
  const verifyResult = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: "recovery",
  });

  if (verifyResult.error || !verifyResult.data.session) {
    return verifyResult;
  }

  const scopedClient = createPublicServerClient();
  const session = verifyResult.data.session;

  await scopedClient.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });

  return scopedClient.auth.updateUser({ password });
}
