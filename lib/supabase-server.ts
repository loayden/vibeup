import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getServerEnv } from "@/lib/env";

function getSupabaseUrl() {
  return getServerEnv("NEXT_PUBLIC_SUPABASE_URL");
}

function getAnonKey() {
  return getServerEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

function getServiceRoleKey() {
  return getServerEnv("SUPABASE_SERVICE_ROLE_KEY");
}

export function createPublicServerClient(): SupabaseClient {
  return createClient(getSupabaseUrl(), getAnonKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export function createAdminClient(): SupabaseClient {
  return createClient(getSupabaseUrl(), getServiceRoleKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export function tryCreateAdminClient(): SupabaseClient | null {
  try {
    return createAdminClient();
  } catch {
    return null;
  }
}
