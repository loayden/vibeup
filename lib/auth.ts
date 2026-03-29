import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

import { getJwtExpiresIn, getServerEnv } from "@/lib/env";
import { createAdminClient, createPublicServerClient } from "@/lib/supabase-server";
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

export async function signSessionToken(payload: SessionPayload) {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(getJwtExpiresIn())
    .sign(getJwtSecret());
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
    const supabase = createAdminClient();

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", payload.sub)
      .single<AuthProfile>();

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
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
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
