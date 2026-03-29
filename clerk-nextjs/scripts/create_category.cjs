require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addCategory() {
    const newCategory = {
        name: 'Herbal Tea',
        name_ar: 'شاي الأعشاب',
        slug: 'herbal-tea',
        description: 'A selection of natural herbal teas for relaxation and health.',
        description_ar: 'تشكيلة من شاي الأعشاب الطبيعية للاسترخاء والصحة العامة.',
        image: '/images/categories/herbs.jpg' // Reusing herbs image for now
    };

    const { data, error } = await supabase
        .from('categories')
        .insert([newCategory])
        .select();

    if (error) {
        console.error('Full Error Object:', JSON.stringify(error, null, 2));
    } else {
        console.log('Category created successfully:', data);
    }
}

addCategory();
