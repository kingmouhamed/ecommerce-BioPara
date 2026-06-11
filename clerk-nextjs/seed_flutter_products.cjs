// seed_flutter_products.js
// ينفذ هذا السكريبت إدراج المنتجات في قاعدة بيانات Supabase
// node seed_flutter_products.js

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://fvtkbnoodktzumzkxtkv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2dGtibm9vZGt0enVtemt4dGt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTE3MzAzMCwiZXhwIjoyMDg0NzQ5MDMwfQ.I5sb7VIQ6KsG-gZmmgplrAGacbeyxc6coZ5LJrBhYuo'
);

const products = [
  // ── مكملات غذائية ─────────────────────────────────────────
  { name: 'أشواجاندا', description: 'مكمل أشواجاندا الممتاز لدعم صحتك العامة وتعزيز نشاطك اليومي. مستخرج من جذور الأشواجاندا الهندية الأصيلة.', price: 123, category: 'مكملات غذائية', stock_quantity: 42, rating: 4.8, reviews_count: 124 },
  { name: 'بيوتين', description: 'مكمل بيوتين الممتاز لدعم صحة الشعر والأظافر والبشرة. تركيز عالي 10000 mcg.', price: 224, category: 'مكملات غذائية', stock_quantity: 58, rating: 4.7, reviews_count: 89 },
  { name: 'كولاجين بحري', description: 'مكمل كولاجين الممتاز لدعم صحة البشرة والمفاصل والشعر. مستخرج من زعانف السمك.', price: 204, category: 'مكملات غذائية', stock_quantity: 33, rating: 4.6, reviews_count: 67 },
  { name: 'جلوتاثيون', description: 'مكمل إل-جلوتاثيون الممتاز - مضاد أكسدة قوي لتفتيح البشرة وحماية الكبد.', price: 141, category: 'مكملات غذائية', stock_quantity: 12, rating: 4.5, reviews_count: 45 },
  { name: 'مغنيسيوم', description: 'مكمل مغنيسيوم الممتاز لدعم صحة العضلات والنوم والجهاز العصبي.', price: 191, category: 'مكملات غذائية', stock_quantity: 35, rating: 4.6, reviews_count: 78 },
  { name: 'مستكة رومية', description: 'مكمل مستكة الممتاز لعلاج قرحة المعدة والقولون وتطهير الفم. من جزيرة خيوس اليونانية.', price: 145, category: 'مكملات غذائية', stock_quantity: 17, rating: 4.8, reviews_count: 92 },
  { name: 'فيتامينات متعددة', description: 'مكمل فيتامينات متعددة الممتاز - 23 فيتاميناً ومعدناً أساسياً في كبسولة واحدة يومياً.', price: 92, category: 'مكملات غذائية', stock_quantity: 19, rating: 4.4, reviews_count: 56 },
  { name: 'أوميغا 3 سمك', description: 'مكمل أوميغا 3 من زيت السمك الممتاز لصحة القلب والمخ والمفاصل.', price: 148, category: 'مكملات غذائية', stock_quantity: 21, rating: 4.7, reviews_count: 103 },
  { name: 'أوميغا 3 نباتي', description: 'مكمل أوميغا 3 النباتي الممتاز من بذور الكتان - مناسب للنباتيين.', price: 244, category: 'مكملات غذائية', stock_quantity: 34, rating: 4.5, reviews_count: 61 },
  { name: 'بروبيوتيك', description: 'مكمل بروبيوتيك الممتاز - 50 مليار CFU من 12 سلالة بكتيرية لصحة الجهاز الهضمي.', price: 144, category: 'مكملات غذائية', stock_quantity: 37, rating: 4.6, reviews_count: 88 },
  { name: 'شيلاجيت', description: 'مكمل شيلاجيت الممتاز من جبال الهيمالايا لزيادة الطاقة والتستوستيرون.', price: 130, category: 'مكملات غذائية', stock_quantity: 47, rating: 4.9, reviews_count: 134 },
  { name: 'فيتامين D3 مع K2', description: 'مكمل فيتامين D3 مع K2 الممتاز لتقوية العظام والمناعة. 5000 IU يومياً.', price: 171, category: 'مكملات غذائية', stock_quantity: 26, rating: 4.8, reviews_count: 97 },
  { name: 'زنك', description: 'مكمل زنك الممتاز لتعزيز المناعة وصحة الجلد والخصوبة. جلوكونات الزنك عالي الامتصاص.', price: 68, category: 'مكملات غذائية', stock_quantity: 15, rating: 4.5, reviews_count: 43 },

  // ── أعشاب طبية ────────────────────────────────────────────
  { name: 'ألوفيرا (صبار)', description: 'جل الصبار الطبيعي النقي من نباتات عمرها 3 سنوات. يهدئ الجلد ويدعم الهضم.', price: 180, category: 'أعشاب طبية', stock_quantity: 49, rating: 4.7, reviews_count: 112 },

  // ── شاي أعشاب ─────────────────────────────────────────────
  { name: 'شاي يانسون', description: 'شاي يانسون طبيعي ومهدئ للجهاز الهضمي والصدر، غني بالزيوت الطيارة والنكهة الدافئة.', price: 55, category: 'شاي أعشاب', stock_quantity: 40, rating: 4.8, reviews_count: 72 },
  { name: 'بابونج عضوي', description: 'أعشاب البابونج طبيعية وعضوية من أجود المصادر. مهدئ طبيعي للأعصاب والمعدة.', price: 249, category: 'شاي أعشاب', stock_quantity: 27, rating: 4.8, reviews_count: 98 },
  { name: 'قرفة سيلان', description: 'أعشاب القرفة الأصيلة من سيلان. تنظم سكر الدم وتحسن الهضم.', price: 47, category: 'شاي أعشاب', stock_quantity: 56, rating: 4.5, reviews_count: 67 },
  { name: 'زنجبيل طازج', description: 'أعشاب الزنجبيل طبيعية وعضوية - مضاد التهابات قوي، يخفف الغثيان والآلام.', price: 235, category: 'شاي أعشاب', stock_quantity: 35, rating: 4.7, reviews_count: 89 },
  { name: 'كركديه', description: 'أعشاب الكركديه طبيعية وعضوية. تخفض ضغط الدم وتحسن الكوليسترول وغنية بفيتامين C.', price: 86, category: 'شاي أعشاب', stock_quantity: 45, rating: 4.6, reviews_count: 76 },
  { name: 'خزامى (لافندر)', description: 'أعشاب لافندر طبيعية وعضوية من جبال الأطلس. تخفف القلق والتوتر وتحسن النوم.', price: 107, category: 'شاي أعشاب', stock_quantity: 52, rating: 4.8, reviews_count: 104 },
  { name: 'لويزة (فيرفين)', description: 'أعشاب اللويزة المغربية الأصيلة. العشب المفضل في كل بيت مغربي لتهدئة المعدة والصداع.', price: 192, category: 'شاي أعشاب', stock_quantity: 51, rating: 4.9, reviews_count: 156 },
  { name: 'نعناع مغربي', description: 'أعشاب النعناع المغربي الأصيل. منشط طبيعي، يحسن الهضم ويخفف الصداع.', price: 110, category: 'شاي أعشاب', stock_quantity: 30, rating: 4.7, reviews_count: 87 },
  { name: 'إكليل الجبل (روزماري)', description: 'أعشاب إكليل الجبل طبيعية. يحفز الذاكرة والتركيز ويقوي الشعر.', price: 96, category: 'شاي أعشاب', stock_quantity: 17, rating: 4.5, reviews_count: 54 },
  { name: 'مريمية', description: 'أعشاب المريمية طبيعية وعضوية. تنظم الدورة الشهرية وتخفف أعراض انقطاع الطمث.', price: 205, category: 'شاي أعشاب', stock_quantity: 27, rating: 4.6, reviews_count: 72 },
  { name: 'زعتر بري', description: 'أعشاب الزعتر البري من جبال الريف. غني بالزيوت الطيارة المضادة للميكروبات.', price: 143, category: 'شاي أعشاب', stock_quantity: 52, rating: 4.7, reviews_count: 93 },
  { name: 'كركم ذهبي', description: 'أعشاب الكركم طبيعية وعضوية. مضاد التهابات قوي يدعم المفاصل والكبد والهضم.', price: 125, category: 'شاي أعشاب', stock_quantity: 33, rating: 4.8, reviews_count: 118 },

  // ── زيوت طبية ──────────────────────────────────────────────
  { name: 'زيت اللوز الحلو', description: 'زيت اللوز العضوي النقي المعصور بالبرد. مرطب ممتاز للجلد والشعر غني بفيتامين E.', price: 69, category: 'زيوت طبية', stock_quantity: 39, rating: 4.5, reviews_count: 63 },
  { name: 'زيت أرغان المغربي', description: 'زيت أرغان العضوي النقي من فاس - الذهب السائل المغربي. يغذي الشعر والبشرة.', price: 215, category: 'زيوت طبية', stock_quantity: 14, rating: 4.9, reviews_count: 187 },
  { name: 'زيت الحبة السوداء', description: 'زيت حبة البركة العضوي النقي المعصور بالبرد. يعزز المناعة ويعالج الحساسية.', price: 132, category: 'زيوت طبية', stock_quantity: 17, rating: 4.8, reviews_count: 143 },
  { name: 'زيت الخروع', description: 'زيت الخروع العضوي النقي الجامايكي. يكثف الشعر ويسرع نموه ويقوي الرموش.', price: 197, category: 'زيوت طبية', stock_quantity: 22, rating: 4.6, reviews_count: 98 },
  { name: 'زيت الزنجبيل', description: 'زيت الزنجبيل العضوي النقي. يدفئ المفاصل ويخفف آلام الظهر والعضلات عند التدليك.', price: 181, category: 'زيوت طبية', stock_quantity: 15, rating: 4.5, reviews_count: 57 },
  { name: 'زيت الثوم', description: 'زيت الثوم العضوي النقي. مضاد حيوي طبيعي، يخفض ضغط الدم ويعزز المناعة.', price: 71, category: 'زيوت طبية', stock_quantity: 52, rating: 4.4, reviews_count: 45 },
  { name: 'زيت الخزامى', description: 'زيت خزامى العضوي النقي 100% المقطر ببخار الماء. يهدئ التوتر ويعالج جروح الجلد.', price: 64, category: 'زيوت طبية', stock_quantity: 48, rating: 4.8, reviews_count: 112 },
  { name: 'زيت المسك', description: 'زيت المسك العضوي النقي بعطره الشرقي الأصيل. يستخدم في العطور والعلاج الروحي.', price: 170, category: 'زيوت طبية', stock_quantity: 59, rating: 4.7, reviews_count: 87 },
  { name: 'زيت الزيتون البكر', description: 'زيت الزيتون العضوي النقي البكر الممتاز المعصور بالبرد. حموضة أقل من 0.3%.', price: 212, category: 'زيوت طبية', stock_quantity: 33, rating: 4.7, reviews_count: 104 },
  { name: 'زيت الورد', description: 'زيت الورد العضوي النقي من بتلات الورد البلغارية. أكثر الزيوت فعالية لتجديد البشرة.', price: 202, category: 'زيوت طبية', stock_quantity: 21, rating: 4.9, reviews_count: 134 },
  { name: 'زيت السدر', description: 'زيت سدر العضوي النقي. يقوي بصيلات الشعر ويعالج قشرة الرأس ويكثف الشعر.', price: 158, category: 'زيوت طبية', stock_quantity: 36, rating: 4.6, reviews_count: 76 },
  { name: 'زيت الحبة السوداء الممتاز', description: 'زيت حبة السوداء الممتاز المركز بتركيز أقوى. للمناعة القصوى ومكافحة الالتهابات.', price: 132, category: 'زيوت طبية', stock_quantity: 17, rating: 4.9, reviews_count: 178 },

  // ── عسل طبيعي ──────────────────────────────────────────────
  { name: 'عسل الطلح (أكاسيا)', description: 'عسل طلح طبيعي نقي 100%. شفاف منخفض الغلايسيميك، مناسب لمرضى السكر ويبقى سائلاً طويلاً.', price: 120, category: 'عسل طبيعي', stock_quantity: 20, rating: 4.6, reviews_count: 87 },
  { name: 'عسل الحبة السوداء', description: 'عسل الحبة السوداء طبيعي نقي 100%. يجمع بين خصائص العسل والحبة السوداء - تراث نبوي.', price: 231, category: 'عسل طبيعي', stock_quantity: 59, rating: 4.8, reviews_count: 143 },
  { name: 'عسل الخروب', description: 'عسل الخروب طبيعي نقي 100%. داكن اللون قوي الطعم، يقوي الجهاز الهضمي ويعالج الإمساك.', price: 94, category: 'عسل طبيعي', stock_quantity: 30, rating: 4.5, reviews_count: 67 },
  { name: 'عسل الداغموس', description: 'عسل الداغموس الجبلي النادر من جبال الأطلس. يستخدم تقليدياً لتقوية الظهر وعلاج الروماتيزم.', price: 91, category: 'عسل طبيعي', stock_quantity: 28, rating: 4.7, reviews_count: 98 },
  { name: 'عسل الكافور', description: 'عسل كافور طبيعي نقي 100%. يعالج التهابات الجهاز التنفسي والحمى والأنفلونزا.', price: 184, category: 'عسل طبيعي', stock_quantity: 34, rating: 4.6, reviews_count: 76 },
  { name: 'عسل الأزهار', description: 'عسل الأزهار البرية الطبيعي نقي 100%. من تنوع أزهار المرج المغربي في فصل الربيع.', price: 136, category: 'عسل طبيعي', stock_quantity: 52, rating: 4.5, reviews_count: 89 },
  { name: 'عسل الغابة', description: 'عسل الغابة البكر من النحل البري في غابات الأطلس الكبير. نكهة غنية بمزيج الأزهار.', price: 128, category: 'عسل طبيعي', stock_quantity: 26, rating: 4.8, reviews_count: 112 },
  { name: 'عسل المانوكا', description: 'عسل مانوكا طبيعي نقي 100% من نيوزيلندا. يعالج جروح الجلد ويقاوم البكتيريا المقاومة.', price: 184, category: 'عسل طبيعي', stock_quantity: 59, rating: 4.9, reviews_count: 187 },
  { name: 'عسل زهر البرتقال', description: 'عسل زهر البرتقال الطبيعي من حدائق الصويرة. أبيض اللون خفيف الملمس مناسب للأطفال.', price: 173, category: 'عسل طبيعي', stock_quantity: 54, rating: 4.7, reviews_count: 103 },
  { name: 'عسل السدر', description: 'عسل سدر طبيعي نقي 100% من جبال الأطلس. يقوي المناعة ويعالج الأنيميا ويرفع الطاقة.', price: 119, category: 'عسل طبيعي', stock_quantity: 16, rating: 4.8, reviews_count: 134 },
  { name: 'عسل الزعتر', description: 'عسل الزعتر البري الطبيعي من حقول الزعتر. يعالج التهابات الجهاز التنفسي والسعال.', price: 198, category: 'عسل طبيعي', stock_quantity: 58, rating: 4.8, reviews_count: 121 },
  { name: 'عسل البرية', description: 'عسل الأزهار البرية الطبيعي المتعدد المصادر. غني بالإنزيمات والبوليفينول ومضادات الأكسدة.', price: 199, category: 'عسل طبيعي', stock_quantity: 50, rating: 4.7, reviews_count: 94 },
];

async function seed() {
  console.log('🌿 جاري إدراج المنتجات في Supabase...');
  
  // حذف المنتجات القديمة
  const { error: deleteError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.log('حذف المنتجات القديمة:', deleteError.message);
  }

  // إدراج المنتجات الجديدة على دفعات
  const batchSize = 10;
  let totalInserted = 0;
  
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const { data, error } = await supabase.from('products').insert(batch).select();
    
    if (error) {
      console.error(`❌ خطأ في الدفعة ${i/batchSize + 1}:`, error.message);
    } else {
      totalInserted += data.length;
      console.log(`✅ دفعة ${i/batchSize + 1}: تم إدراج ${data.length} منتج`);
    }
  }

  console.log(`\n✅ إجمالي المنتجات المُدرجة: ${totalInserted}`);
  
  // تحقق نهائي
  const { data: counts } = await supabase
    .from('products')
    .select('category')
    .order('category');
  
  if (counts) {
    const grouped = counts.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📊 المنتجات حسب التصنيف:');
    Object.entries(grouped).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} منتج`);
    });
  }
}

seed().catch(console.error);
