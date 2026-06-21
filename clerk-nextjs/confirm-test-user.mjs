import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, serviceKey);

async function confirmUser() {
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) throw listError;
  
  const user = users.find(u => u.email === 'testuser@biopara.com');
  if (user) {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      email_confirm: true
    });
    if (error) console.error("Error confirming:", error);
    else console.log("User confirmed successfully!");
  } else {
     console.log("User not found");
  }
}
confirmUser();
