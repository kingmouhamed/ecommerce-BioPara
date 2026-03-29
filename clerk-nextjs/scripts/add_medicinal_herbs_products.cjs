require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Medicinal Herbs Category ID is 2
const categoryId = 2;

const herbsData = [
    { file: 'Aloe vera.jpg', name: 'Aloe Vera', name_ar: 'نبتة الألوفيرا', price: 60 },
    { file: 'Ashwagandha.jpg', name: 'Ashwagandha', name_ar: 'عشبة الأشواجاندا', price: 120 },
    { file: 'Echinacea.jpg', name: 'Echinacea', name_ar: 'عشبة الإشنسا', price: 90 },
    { file: 'Eucalyptus.jpg', name: 'Eucalyptus', name_ar: 'أوراق الكافور', price: 50 },
    { file: 'Foeniculum.jpg', name: 'Fennel (Foeniculum)', name_ar: 'بذور الشمر', price: 40 },
    { file: 'Ginseng.jpg', name: 'Ginseng Root', name_ar: 'جذور الجنسنغ', price: 150 },
    { file: 'Maca.jpg', name: 'Maca Root', name_ar: 'جذور الماكا', price: 130 },
    { file: 'Moringa.jpg', name: 'Moringa', name_ar: 'أوراق المورينجا', price: 70 },
    { file: 'Olive leaves.jpg', name: 'Olive Leaves', name_ar: 'أوراق الزيتون', price: 45 },
    { file: 'Saints.jpg', name: "St. John's Wort", name_ar: 'عشبة القديسين', price: 85 },
    { file: 'Sidr.jpg', name: 'Sidr Leaves', name_ar: 'أوراق السدر', price: 55 },
    { file: 'Thyme.jpg', name: 'Medicinal Thyme', name_ar: 'الزعتر الطبي', price: 50 }
];

async function addMedicinalHerbs() {
    let toInsert = herbsData.map(h => {
        let slug = 'medicinal-herbs-' + h.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return {
            name: h.name,
            name_ar: h.name_ar,
            slug: slug,
            description: `100% natural and high-quality ${h.name.toLowerCase()} for daily medicinal use.`,
            description_ar: `${h.name_ar} طبيعية 100% وعالية الجودة للاستخدامات الطبية اليومية.`,
            price: h.price,
            currency: 'MAD',
            stock: 80,
            images: [
                `/images/medicinal-herbs/${h.file}`,
                '/images/products/biopara-herb-back.png',
                '/images/products/biopara-herb-lifestyle.png'
            ],
            category_id: categoryId,
            is_active: true,
            featured: true
        };
    });

    const { data, error } = await supabase
        .from('products')
        .insert(toInsert)
        .select();

    if (error) {
        console.error('Error inserting medicinal herbs:', error);
    } else {
        console.log(`Successfully added ${data.length} products to Medicinal Herbs category!`);
    }
}

addMedicinalHerbs();
