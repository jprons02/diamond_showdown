import { createBrowserClient } from "@supabase/ssr";

// After creating tables, run `npx supabase gen types typescript` to generate
// database types, then pass them as a generic: createBrowserClient<Database>(...)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
