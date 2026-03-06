require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
    const { data: products, error } = await supabase.from('products').select('*');
    if (error) {
        console.error('Error fetching:', error);
        return;
    }

    for (const product of products) {
        let newImages = [];

        // Start with the existing first image
        if (product.images && product.images.length > 0) {
            newImages.push(product.images[0]);
        } else if (product.image_url) {
            newImages.push(product.image_url);
        } else {
            newImages.push('/images/products/product-placeholder.jpg');
        }

        // Append the newly created generic thumbnails
        newImages.push('/images/products/biopara-bottle-back.png');
        newImages.push('/images/products/biopara-ingredients.png');

        // Update the DB
        const { error: updateError } = await supabase
            .from('products')
            .update({ images: newImages })
            .eq('id', product.id);

        if (updateError) {
            console.error(`Error updating product ${product.id}:`, updateError);
        } else {
            console.log(`Updated product ${product.id} successfully!`);
        }
    }
    console.log('Done mapping generic thumbnails to all products!');
}

main();
