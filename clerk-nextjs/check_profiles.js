import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfiles() {
    console.log('Fetching OpenAPI schema from Supabase...');
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });
        const schema = await response.json();
        console.log('Schema keys:', Object.keys(schema));
        if (schema.paths) {
            console.log('Available paths:', Object.keys(schema.paths));
        }
    } catch (e) {
        console.error('Error fetching schema:', e.message);
    }
}

checkProfiles();
