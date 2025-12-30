import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Client للفرونت (Front-end)
 * يُستخدم في صفحات React/Next.js مباشرة
 * مفتاح anon آمن للاستخدام على العميل
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Supabase Client للباك (Server-side)
 * يُستخدم في API routes أو SSR
 * مفتاح service_role يمتلك صلاحيات كاملة
 * يجب عدم استخدامه على العميل
 */
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Supabase Anon Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);