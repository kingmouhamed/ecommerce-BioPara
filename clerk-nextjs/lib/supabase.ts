import { createBrowserClient } from '@supabase/ssr'

// A factory function to create a new client when needed (e.g., for server-side operations)
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// A singleton client for shared use across the browser application (e.g., in contexts)
export const supabase = createSupabaseBrowserClient();
