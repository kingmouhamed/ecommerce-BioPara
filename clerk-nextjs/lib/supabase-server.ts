import { createClient } from '@supabase/supabase-js';
import { Tables } from './supabase-client'; // Import types from existing client

// Create a mock client if environment variables are missing for development
const createMockClient = () => ({
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: { message: 'Database not configured' } }),
        then: () => Promise.resolve({ data: [], error: null, count: 0 })
      }),
      or: () => ({
        single: () => Promise.resolve({ data: null, error: { message: 'Database not configured' } }),
        then: () => Promise.resolve({ data: [], error: null, count: 0 })
      }),
      order: () => ({
        range: () => Promise.resolve({ data: [], error: null, count: 0 })
      }),
      range: () => Promise.resolve({ data: [], error: null, count: 0 })
    }),
    order: () => ({
      range: () => Promise.resolve({ data: [], error: null, count: 0 })
    })
  })
});

let supabaseAdmin: any;

// Initialize supabase client only when needed
function initializeSupabase() {
  if (supabaseAdmin) return supabaseAdmin;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl) {
    console.warn('⚠️ NEXT_PUBLIC_SUPABASE_URL not found - Using demo data mode');
    console.log('💡 To use database: Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
    supabaseAdmin = createMockClient();
  } else if (!supabaseServiceKey) {
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY not found - Using demo data mode');
    console.log('💡 To use database: Set SUPABASE_SERVICE_ROLE_KEY in .env.local');
    supabaseAdmin = createMockClient();
  } else {
    // Admin Client with Service Role Key - Bypasses RLS!
    // Use ONLY in Server actions, or Server-side API routes.
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabaseAdmin;
}

// Export a function to get the client
export function getSupabaseAdmin() {
  return initializeSupabase();
}

// For backward compatibility, export the client directly
// This will be initialized on first use
export { supabaseAdmin };
