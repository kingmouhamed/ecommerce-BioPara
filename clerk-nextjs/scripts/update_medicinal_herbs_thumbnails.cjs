require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateThumbnails() {
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', 2);

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    for (const product of products) {
        let newImages = [];

        // Keep the primary product image
        if (product.images && product.images.length > 0) {
            newImages.push(product.images[0]);
        } else {
            console.log(`Skipping product ${product.id} - no primary image`);
            continue;
        }

        // Add the new medicinal herb thumbnails
        newImages.push('/images/products/biopara-medicinal-herb-back.png');
        newImages.push('/images/products/biopara-medicinal-herb-lifestyle.png');

        const { error: updateError } = await supabase
            .from('products')
            .update({ images: newImages })
            .eq('id', product.id);

        if (updateError) {
            console.error(`Error updating product ${product.id}:`, updateError);
        } else {
            console.log(`Updated product ${product.id} thumbnails successfully!`);
        }
    }
    console.log('Done updating medicinal herbs thumbnails!');
}

updateThumbnails();
