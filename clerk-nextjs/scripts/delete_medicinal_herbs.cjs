require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deleteMedicinalHerbs() {
    // category_id 2 is 'herbs' (Medicinal Herbs)
    const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('category_id', 2);

    if (error) {
        console.error('Error deleting products:', error);
    } else {
        console.log('Successfully deleted all medicinal herbs products from database!', data);
    }
}

deleteMedicinalHerbs();
