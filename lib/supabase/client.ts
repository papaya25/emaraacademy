import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client for the admin login form and sign-out button.
 * Unlike lib/supabase.ts's client, this one stores the session in cookies
 * (not localStorage), so the server (middleware, Server Actions) sees it too.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
