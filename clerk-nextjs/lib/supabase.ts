import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

export async function createClerkSupabaseClient(): Promise<SupabaseClient> {
  const { getToken } = auth();
  const token = await getToken({ template: 'supabase' });

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
}
