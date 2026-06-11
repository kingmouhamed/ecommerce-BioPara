// upload_product_images.cjs
// يرفع جميع صور المنتجات من clerk-nextjs/public/images إلى Supabase Storage
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  'https://fvtkbnoodktzumzkxtkv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2dGtibm9vZGt0enVtemt4dGt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTE3MzAzMCwiZXhwIjoyMDg0NzQ5MDMwfQ.I5sb7VIQ6KsG-gZmmgplrAGacbeyxc6coZ5LJrBhYuo'
);

const BASE = path.join(__dirname, 'public', 'images');

// مجلدات المنتجات التي نريد رفعها
const FOLDERS = [
  { local: 'natural-honey',       remote: 'natural-honey' },
  { local: 'medicinal-herbs',     remote: 'medicinal-herbs' },
  { local: 'medicinal-oils',      remote: 'medicinal-oils' },
  { local: 'dietary-supplements', remote: 'dietary-supplements' },
  { local: 'herbal tea',          remote: 'herbal-tea' },
];

async function uploadFolder(localFolder, remoteFolder) {
  const localPath = path.join(BASE, localFolder);
  if (!fs.existsSync(localPath)) {
    console.log(`⚠️  مجلد غير موجود: ${localFolder}`);
    return 0;
  }

  const files = fs.readdirSync(localPath).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  let uploaded = 0;

  for (const file of files) {
    const filePath = path.join(localPath, file);
    const fileBuffer = fs.readFileSync(filePath);
    const remotePath = `${remoteFolder}/${file}`;
    const contentType = file.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

    const { error } = await supabase.storage
      .from('products')
      .upload(remotePath, fileBuffer, {
        contentType,
        upsert: true, // يستبدل إذا موجود
      });

    if (error) {
      console.error(`  ❌ ${file}: ${error.message}`);
    } else {
      console.log(`  ✅ ${remotePath}`);
      uploaded++;
    }
  }
  return uploaded;
}

async function main() {
  console.log('🚀 بدء رفع صور المنتجات إلى Supabase Storage...\n');
  let total = 0;

  for (const { local, remote } of FOLDERS) {
    console.log(`📁 ${local} → ${remote}`);
    const count = await uploadFolder(local, remote);
    total += count;
    console.log(`   ${count} صورة\n`);
  }

  console.log(`✅ إجمالي الصور المرفوعة: ${total}`);
  
  // تحقق من الصور المرفوعة
  const { data } = await supabase.storage.from('products').list('natural-honey');
  console.log(`\nمثال على صور العسل في Storage:`);
  if (data) data.slice(0, 5).forEach(f => console.log(`  - ${f.name}`));
}

main().catch(console.error);
