require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const productsData = [
    { file: 'anise-herb.jpg', name: 'Anise Herbal Tea', name_ar: 'شاي اليانسون', price: 45 },
    { file: 'camomile-herb.jpg', name: 'Chamomile Herbal Tea', name_ar: 'شاي البابونج', price: 55 },
    { file: 'cinnamon-herb.jpg', name: 'Cinnamon Herbal Tea', name_ar: 'شاي القرفة', price: 50 },
    { file: 'ginger-herb.jpg', name: 'Ginger Herbal Tea', name_ar: 'شاي الزنجبيل', price: 60 },
    { file: 'hibiscus-herb.jpg', name: 'Hibiscus Herbal Tea', name_ar: 'شاي الكركديه', price: 45 },
    { file: 'lavender-herb.jpg', name: 'Lavender Herbal Tea', name_ar: 'شاي الخزامى', price: 70 },
    { file: 'lemon-verbena-herb.jpg', name: 'Lemon Verbena Tea', name_ar: 'شاي اللويزة', price: 50 },
    { file: 'mint-herb.jpg', name: 'Mint Herbal Tea', name_ar: 'شاي النعناع', price: 40 },
    { file: 'rosemary-herb.jpg', name: 'Rosemary Herbal Tea', name_ar: 'شاي إكليل الجبل', price: 45 },
    { file: 'sage-herb.jpg', name: 'Sage Herbal Tea', name_ar: 'شاي المريمية', price: 50 },
    { file: 'thyme-herb.jpg', name: 'Thyme Herbal Tea', name_ar: 'شاي الزعتر', price: 45 },
    { file: 'turmeric-herb.jpg', name: 'Turmeric Herbal Tea', name_ar: 'شاي الكركم', price: 55 }
];

async function addProducts() {
    let toInsert = productsData.map(p => {
        let slug = 'herbal-tea-' + p.name.toLowerCase().replace(/ /g, '-');
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
            category_id: 5, // Herbal Tea
            is_active: true,
            featured: true
        };
    });

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

addProducts();
