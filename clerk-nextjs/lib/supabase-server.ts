import { createClient } from '@supabase/supabase-js';
import { Tables } from './supabase-client'; // Import types from existing client

let supabaseAdmin: any;

function initializeSupabase() {
  if (supabaseAdmin) return supabaseAdmin;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    const missing = [
      !supabaseUrl && 'NEXT_PUBLIC_SUPABASE_URL',
      !supabaseServiceKey && 'SUPABASE_SERVICE_ROLE_KEY',
    ].filter(Boolean).join(', ');
    throw new Error(`Missing required environment variables: ${missing}. Set them in .env.local`);
  }

  // Admin Client with Service Role Key - Bypasses RLS.
  // Use ONLY in Server actions or Server-side API routes.
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseAdmin;
}

// Export a function to get the client
export function getSupabaseAdmin() {
  return initializeSupabase();
}

// For backward compatibility, export the client directly
// This will be initialized on first use
export { supabaseAdmin };
