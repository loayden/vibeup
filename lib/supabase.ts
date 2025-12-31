
// Supabase client configuration using .env.local values
// Make sure these are added in your .env.local file:
// NEXT_PUBLIC_SUPABASE_URL=https://clkbegobbcgajtxrwkbe.supabase.co
// NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_secret_RN8ulpFZSQ4zcqcIn_fTWg_A3qhjnTh

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables are missing. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

export const supabase = createClient(
  supabaseUrl || "",
  supabaseAnonKey || ""
);
