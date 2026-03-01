import 'dotenv/config';

const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/categories?select=*`;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function check() {
    try {
        const res = await fetch(url, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`
            }
        });
        const data = await res.json();
        console.log("Categories Length:", data.length);
        console.log("Categories:", data);
    } catch (e) {
        console.error(e);
    }
}
check();
