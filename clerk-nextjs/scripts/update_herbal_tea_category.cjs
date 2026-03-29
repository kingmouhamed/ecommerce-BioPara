require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateCategory() {
    const { data, error } = await supabase
        .from('categories')
        .update({ image: '/images/categories/herbal-tea.png' })
        .eq('slug', 'herbal-tea')
        .select();

    if (error) {
        console.error('Error updating category:', JSON.stringify(error, null, 2));
    } else {
        console.log('Category updated successfully:', data);
    }
}

updateCategory();
