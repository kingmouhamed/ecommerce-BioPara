import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'testuser@biopara.com',
    password: 'Password123!',
    options: {
      data: {
        full_name: 'Test User',
      },
    },
  });

  if (error) {
    console.error('Error creating user:', error.message);
  } else {
    console.log('Test user created successfully:', data.user?.email);
  }
}

createTestUser();
