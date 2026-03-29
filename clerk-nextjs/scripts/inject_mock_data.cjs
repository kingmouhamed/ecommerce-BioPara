const fs = require('fs');
const path = require('path');

const demoDataPath = path.join(__dirname, '../lib/data/demo-data.ts');
const mockDataPath = path.join(__dirname, '../lib/data/mockData.ts');

const newCategory = `  ,{
    "id": 5,
    "slug": "herbal-tea",
    "name": "شاي الأعشاب",
    "name_ar": "شاي الأعشاب",
    "description": "A selection of natural herbal teas for relaxation and health.",
    "description_ar": "تشكيلة من شاي الأعشاب الطبيعية للاسترخاء والصحة العامة.",
    "image": "/images/herbal tea/herb-tea-2.jpg",
    "created_at": new Date().toISOString(),
    "updated_at": new Date().toISOString()
  }`;

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

let nextIdDemo = 100;

function generateProductsString() {
    return productsData.map(p => {
        let slug = 'herbal-tea-' + p.name.toLowerCase().replace(/ /g, '-');
        return `  ,{
    "id": ${nextIdDemo++},
    "name": "${p.name}",
    "name_ar": "${p.name_ar}",
    "slug": "${slug}",
    "description": "Premium organic ${p.name.toLowerCase()} for relaxation and wellness. Made with 100% natural ingredients.",
    "description_ar": "${p.name_ar} عضوي وممتاز للاسترخاء والصحة العامة.",
    "price": ${p.price},
    "original_price": null,
    "currency": "MAD",
    "stock": 100,
    "images": [
      "/images/herbal tea/${p.file}"
    ],
    "image_url": "/images/herbal tea/${p.file}",
    "category_id": 5,
    "is_active": true,
    "featured": true,
    "created_at": new Date().toISOString(),
    "updated_at": new Date().toISOString()
  }`;
    }).join('\n');
}

function processFile(filePath, categoryRegex, productsRegex) {
    if (!fs.existsSync(filePath)) {
        console.log("File not found:", filePath);
        return;
    }
    let content = fs.readFileSync(filePath, 'utf8');

    // Prevent duplicates
    if (content.includes('"slug": "herbal-tea"')) {
        console.log("Herbal Tea category already exists in", filePath);
        return;
    }

    // Insert category
    content = content.replace(categoryRegex, newCategory + '\n];');

    // Insert products
    content = content.replace(productsRegex, generateProductsString() + '\n];');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Updated", filePath);
}

// demo-data.ts regexes
const demoCatRegex = /];\s*export const demoProducts/s; // the end of demoCategories array
// Actually, it's safer to just replace replacing the LAST `];` of the array.
// For demoCategories:
let demoContent = fs.readFileSync(demoDataPath, 'utf8');
if (!demoContent.includes('"slug": "herbal-tea"')) {
    demoContent = demoContent.replace(/export const demoCategories: Category\[\] = \[([\s\S]*?)\];/m, (match, p1) => {
        return `export const demoCategories: Category[] = [${p1}${newCategory}\n];`;
    });
    demoContent = demoContent.replace(/export const demoProducts: Product\[\] = \[([\s\S]*?)\];/m, (match, p1) => {
        return `export const demoProducts: Product[] = [${p1}${generateProductsString()}\n];`;
    });
    fs.writeFileSync(demoDataPath, demoContent);
    console.log("Updated demo-data.ts");
} else {
    console.log("demo-data.ts already updated.");
}

// For mockData.ts:
if (fs.existsSync(mockDataPath)) {
    let mockContent = fs.readFileSync(mockDataPath, 'utf8');
    if (!mockContent.includes("'slug': 'herbal-tea'") && !mockContent.includes('"slug": "herbal-tea"')) {
        mockContent = mockContent.replace(/export const mockCategories: Category\[\] = \[([\s\S]*?)\];/m, (match, p1) => {
            return `export const mockCategories: Category[] = [${p1}${newCategory}\n];`;
        });
        mockContent = mockContent.replace(/export const mockProducts: Product\[\] = \[([\s\S]*?)\];/m, (match, p1) => {
            return `export const mockProducts: Product[] = [${p1}${generateProductsString()}\n];`;
        });
        fs.writeFileSync(mockDataPath, mockContent);
        console.log("Updated mockData.ts");
    } else {
        console.log("mockData.ts already updated.");
    }
}
