const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Supabase Configuration
const supabaseUrl = 'https://fvtkbnoodktzumzkxtkv.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2dGtibm9vZGt0enVtemt4dGt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTE3MzAzMCwiZXhwIjoyMDg0NzQ5MDMwfQ.I5sb7VIQ6KsG-gZmmgplrAGacbeyxc6coZ5LJrBhYuo';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log('🔄 Reading demo-data.ts...');
  const tsFilePath = path.join(__dirname, 'lib/data/demo-data.ts');
  let tsContent = fs.readFileSync(tsFilePath, 'utf-8');

  // Clean up and convert to executable CommonJS format dynamically
  let jsContent = tsContent
    .replace(/import\s+[\s\S]+?from\s+['"].+?['"]/g, '') // Remove imports
    .replace(/export\s+const\s+(\w+)\s*:\s*\w+\[\]\s*=/g, 'const $1 =') // Remove type annotations
    .replace(/export\s+const\s+(\w+)\s*=/g, 'const $1 =');

  jsContent += '\nmodule.exports = { demoCategories, demoProducts };';

  const tempFilePath = path.join(__dirname, 'temp_demo_data_eval.cjs');
  fs.writeFileSync(tempFilePath, jsContent, 'utf-8');

  const { demoCategories, demoProducts } = require(tempFilePath);
  fs.unlinkSync(tempFilePath);

  console.log(`📦 Loaded ${demoProducts.length} products and ${demoCategories.length} categories.`);

  // 1. Seed categories if they do not exist
  console.log('🌱 Checking categories in public.categories table...');
  const { data: existingCategories, error: fetchCatError } = await supabase
    .from('categories')
    .select('*');

  if (fetchCatError) {
    console.error('❌ Error fetching categories:', fetchCatError.message);
    return;
  }

  if (existingCategories.length === 0) {
    console.log('🌱 Categories table is empty. Seeding default categories...');
    const defaultCategories = [
      { name: 'أعشاب طبية', slug: 'herbs', description: 'أعشاب طبية طبيعية 100%' },
      { name: 'شاي الأعشاب', slug: 'herbal-tea', description: 'شاي مستخلص من أجود الأعشاب' },
      { name: 'مكملات غذائية', slug: 'supplements', description: 'مكملات غذائية طبيعية' },
      { name: 'زيوت طبية', slug: 'oils', description: 'زيوت عطرية وطبية طبيعية' },
      { name: 'عسل طبيعي', slug: 'honey', description: 'أنواع العسل الطبيعي الأصيل' }
    ];
    
    const { error: seedCatError } = await supabase
      .from('categories')
      .insert(defaultCategories);
      
    if (seedCatError) {
      console.error('❌ Error seeding categories:', seedCatError.message);
      return;
    }
    console.log('✅ Categories seeded successfully.');
  } else {
    console.log(`✅ Found ${existingCategories.length} existing categories.`);
  }

  // Refetch categories to get their generated UUIDs
  const { data: dbCategories } = await supabase
    .from('categories')
    .select('*');

  const categoryIdMap = {};
  dbCategories.forEach(cat => {
    categoryIdMap[cat.slug] = cat.id;
  });

  console.log('Mapped category UUIDs:', categoryIdMap);

  // 2. Clear existing products in Flutter Supabase DB
  console.log('🗑️ Deleting existing products from public.products...');
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .neq('name', '___NON_EXISTENT_PRODUCT___'); // Safely delete all

  if (deleteError) {
    console.error('❌ Error deleting products:', deleteError.message);
    return;
  }

  // Next.js category ID mapping
  // 1: supplements -> supplements
  // 2: herbs -> herbs
  // 3: oils -> oils
  // 4: honey -> honey
  // 5: herbal-tea -> herbal-tea
  const nextJsCatSlugMap = {
    1: 'supplements',
    2: 'herbs',
    3: 'oils',
    4: 'honey',
    5: 'herbal-tea'
  };

  const categoryNameMap = {
    'supplements': 'مكملات غذائية',
    'herbs': 'أعشاب طبية',
    'oils': 'زيوت طبية',
    'honey': 'عسل طبيعي',
    'herbal-tea': 'شاي أعشاب'
  };

  // Map products to Flutter database schema (excluding missing columns like 'images', 'is_featured', 'tags', 'original_price')
  const mappedProducts = demoProducts.map(p => {
    const slug = nextJsCatSlugMap[p.category_id] || 'herbs';
    const categoryName = categoryNameMap[slug] || 'أعشاب طبية';
    const categoryId = categoryIdMap[slug] || null;

    // Use Arabic name and description for Flutter App
    const name = p.name_ar || p.name;
    const description = p.description_ar || p.description || '';
    
    // Assign a mock rating and reviews count if not present
    const rating = p.rating || (4.0 + Math.random() * 0.9).toFixed(1);
    const reviewsCount = p.reviews_count || Math.floor(Math.random() * 150) + 10;

    return {
      name: name,
      description: description,
      price: p.price,
      category: categoryName,
      category_id: categoryId,
      image_url: p.image_url || (p.images && p.images[0]) || null,
      stock_quantity: p.stock || p.stock_quantity || 0,
      rating: parseFloat(rating),
      reviews_count: parseInt(reviewsCount, 10),
      is_active: true
    };
  });

  console.log(`📤 Inserting ${mappedProducts.length} mapped products into Supabase...`);

  // Insert in batches of 10 to avoid payload limits
  const batchSize = 10;
  let successCount = 0;

  for (let i = 0; i < mappedProducts.length; i += batchSize) {
    const batch = mappedProducts.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from('products')
      .insert(batch)
      .select();

    if (error) {
      console.error(`❌ Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error.message);
    } else {
      successCount += data.length;
      console.log(`✅ Batch ${Math.floor(i/batchSize) + 1} inserted successfully (${data.length} products).`);
    }
  }

  console.log(`\n🎉 Migration completed! Successfully migrated ${successCount}/${mappedProducts.length} products.`);

  // Generate SQL insert queries for manual backup
  console.log('✍️ Generating SQL backup file in spiritual_consultation/supabase/migrate_products.sql...');
  
  let sqlContent = `-- =========================================================\n`;
  sqlContent += `-- BioPara: 61 Products SQL Migration Seed File\n`;
  sqlContent += `-- Generated automatically by migration script\n`;
  sqlContent += `-- =========================================================\n\n`;
  
  // Seed Categories SQL
  sqlContent += `-- 1. Seed Categories if they do not exist\n`;
  sqlContent += `INSERT INTO public.categories (name, slug, description) VALUES\n`;
  sqlContent += `  ('أعشاب طبية', 'herbs', 'أعشاب طبية طبيعية 100%'),\n`;
  sqlContent += `  ('شاي الأعشاب', 'herbal-tea', 'شاي مستخلص من أجود الأعشاب'),\n`;
  sqlContent += `  ('مكملات غذائية', 'supplements', 'مكملات غذائية طبيعية'),\n`;
  sqlContent += `  ('زيوت طبية', 'oils', 'زيوت عطرية وطبية طبيعية'),\n`;
  sqlContent += `  ('عسل طبيعي', 'honey', 'أنواع العسل الطبيعي الأصيل')\n`;
  sqlContent += `ON CONFLICT (name) DO NOTHING;\n\n`;
  
  sqlContent += `-- 2. Clear and Insert Products\n`;
  sqlContent += `DELETE FROM public.products;\n\n`;

  mappedProducts.forEach(p => {
    const cleanName = p.name.replace(/'/g, "''");
    const cleanDesc = p.description.replace(/'/g, "''");
    const cleanCat = p.category.replace(/'/g, "''");
    const cleanImg = p.image_url ? `'${p.image_url.replace(/'/g, "''")}'` : 'NULL';
    
    // We select category_id dynamically using subquery to match category name/slug
    const catSlug = nextJsCatSlugMap[demoProducts.find(dp => (dp.name_ar || dp.name) === p.name).category_id] || 'herbs';
    const catIdSubquery = `(SELECT id FROM public.categories WHERE slug = '${catSlug}' LIMIT 1)`;

    sqlContent += `INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (\n`;
    sqlContent += `  '${cleanName}',\n`;
    sqlContent += `  '${cleanDesc}',\n`;
    sqlContent += `  ${p.price},\n`;
    sqlContent += `  '${cleanCat}',\n`;
    sqlContent += `  ${catIdSubquery},\n`;
    sqlContent += `  ${cleanImg},\n`;
    sqlContent += `  ${p.stock_quantity},\n`;
    sqlContent += `  ${p.rating},\n`;
    sqlContent += `  ${p.reviews_count},\n`;
    sqlContent += `  ${p.is_active}\n`;
    sqlContent += `);\n\n`;
  });

  const sqlOutputPath = path.join(__dirname, '../spiritual_consultation/supabase/migrate_products.sql');
  fs.writeFileSync(sqlOutputPath, sqlContent, 'utf-8');
  console.log(`✅ SQL backup file written to ${sqlOutputPath}`);
}

run().catch(err => {
  console.error('❌ Uncaught exception during migration:', err);
});
