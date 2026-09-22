import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client bound to the incoming request's session cookie.
 * Use in Server Components / Server Actions under /admin — RLS then sees the
 * signed-in admin as `authenticated`, matching the "authenticated can manage
 * everything" policies in supabase/schema.sql and the admin-panel migration.
 */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component render; middleware refreshes the
            // session cookie on navigation instead, so this is safe to ignore.
          }
        },
      },
    }
  );
}
