require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const productsData = [
    { file: 'anise-herb.jpg', name: 'Anise Herbal Tea', name_ar: 'شاي اليانسون', price: 45 },
    { file: 'camomile-herb.jpg', name: 'Chamomile Herbal Tea', name_ar: 'شاي البابونج', price: 55 },
    { file: 'cinnamon-herb.jpg', name: 'Cinnamon Herbal Tea', name_ar: 'شاي القرفة', price: 50 },
    { file: 'ginger-herb.jpg', name: 'Ginger Herbal Tea', name_ar: 'شاي الزنجبيل', price: 60 },
    { file: 'herb-tea-2.jpg', name: 'Mixed Herbal Tea', name_ar: 'شاي أعشاب مشكلة', price: 55 },
    { file: 'hibiscus-herb.jpg', name: 'Hibiscus Herbal Tea', name_ar: 'شاي الكركديه', price: 45 },
    { file: 'lavender-herb.jpg', name: 'Lavender Herbal Tea', name_ar: 'شاي الخزامى', price: 70 },
    { file: 'lemon-verbena-herb.jpg', name: 'Lemon Verbena Tea', name_ar: 'شاي اللويزة', price: 50 },
    { file: 'mint-herb.jpg', name: 'Mint Herbal Tea', name_ar: 'شاي النعناع', price: 40 },
    { file: 'rosemary-herb.jpg', name: 'Rosemary Herbal Tea', name_ar: 'شاي إكليل الجبل', price: 45 },
    { file: 'sage-herb.jpg', name: 'Sage Herbal Tea', name_ar: 'شاي المريمية', price: 50 },
    { file: 'thyme-herb.jpg', name: 'Thyme Herbal Tea', name_ar: 'شاي الزعتر', price: 45 },
    { file: 'turmeric-herb.jpg', name: 'Turmeric Herbal Tea', name_ar: 'شاي الكركم', price: 55 }
];

async function setupHerbalTea() {
    console.log("Checking if 'Herbal Tea' category exists...");
    let { data: catData, error: catFetchError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', 'herbal-tea')
        .single();

    let categoryId = catData ? catData.id : null;

    if (!catData) {
        console.log("Category not found, creating it...");
        const newCategory = {
            name: 'Herbal Tea',
            name_ar: 'شاي الأعشاب',
            slug: 'herbal-tea',
            description: 'A selection of natural herbal teas for relaxation and health.',
            description_ar: 'تشكيلة من شاي الأعشاب الطبيعية للاسترخاء والصحة العامة.',
            image: '/images/herbal tea/herb-tea-2.jpg'
        };

        const { data: newCatData, error: catInsertError } = await supabase
            .from('categories')
            .insert([newCategory])
            .select()
            .single();

        if (catInsertError) {
            console.error('Error creating category:', catInsertError);
            return;
        }
        console.log("Category created successfully:", newCatData);
        categoryId = newCatData.id;
    } else {
        console.log("Category found. ID:", categoryId);
    }

    console.log("Checking existing products to avoid duplicates...");
    const { data: existingProducts } = await supabase
        .from('products')
        .select('slug, name_ar')
        .eq('category_id', categoryId);

    const existingSlugs = existingProducts ? existingProducts.map(p => p.slug) : [];

    const toInsert = productsData.map(p => {
        let slug = 'herbal-tea-' + p.name.toLowerCase().replace(/ /g, '-');
        if (existingSlugs.includes(slug)) {
            // Modify slug slightly to avoid unique constraint if needed, but we'll just skip duplicates
            return null;
        }
        return {
            name: p.name,
            name_ar: p.name_ar,
            slug: slug,
            description: `Premium organic ${p.name.toLowerCase()} for relaxation and wellness.`,
            description_ar: `${p.name_ar} عضوي وممتاز للاسترخاء والصحة العامة.`,
            price: p.price,
            currency: 'MAD',
            stock: 100,
            images: [
                `/images/herbal tea/${p.file}`,
                '/images/products/biopara-herb-back.png',
                '/images/products/biopara-herb-lifestyle.png'
            ],
            category_id: categoryId,
            is_active: true,
            featured: true
        };
    }).filter(p => p !== null);

    if (toInsert.length === 0) {
        console.log("All products already exist in this category. No new inserts.");
        return;
    }

    console.log(`Inserting ${toInsert.length} products into 'Herbal Tea' (ID: ${categoryId})...`);

    const { data, error } = await supabase
        .from('products')
        .insert(toInsert)
        .select();

    if (error) {
        console.error('Error inserting products:', error);
    } else {
        console.log(`Successfully added ${data.length} products to Herbal Tea category!`);
    }
}

setupHerbalTea();
