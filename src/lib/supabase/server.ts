import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// After creating tables, run `npx supabase gen types typescript` to generate
// database types, then pass them as a generic: createServerClient<Database>(...)

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll can be called from a Server Component where cookies
            // can't be set. This is safe to ignore when the middleware
            // handles session refresh.
          }
        },
      },
    },
  );
}

/** Server-side admin client with service role key — bypasses RLS */
export function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    },
  );
}
