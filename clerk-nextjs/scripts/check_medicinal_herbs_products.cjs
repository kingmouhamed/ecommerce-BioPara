require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkProducts() {
    const { data: categories, error: catError } = await supabase.from('categories').select('*');
    if (catError) {
        console.error('Categories error:', catError);
    } else {
        console.log('Categories:', categories);
    }

    const { data: products, error: prodError } = await supabase
        .from('products')
        .select('id, name, slug, category_id, images');

    if (prodError) {
        console.error('Products error:', prodError);
    } else {
        const matches = products.filter(p =>
            p.images && p.images.some(img => typeof img === 'string' && img.includes('medicinal-herbs'))
        );
        console.log(`Found ${matches.length} products with 'medicinal-herbs' in images:`);
        console.log(matches.map(m => m.name));

        const catId = categories.find(c => c.slug === 'herbs')?.id;
        const catMatches = products.filter(p => p.category_id === catId);
        console.log(`Found ${catMatches.length} products in 'herbs' category:`);
        console.log(catMatches.map(m => m.name));
    }
}

checkProducts();
