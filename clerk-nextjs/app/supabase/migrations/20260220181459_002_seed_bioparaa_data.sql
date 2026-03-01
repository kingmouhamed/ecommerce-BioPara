/*
  # BioParaا - Initial Data Seed

  1. Categories - Medicinal herb categories
  2. Products - Sample medicinal herbs with details
*/

-- Insert Categories
INSERT INTO categories (name, description, image_url, slug) VALUES
('الأعشاب المنشطة', 'أعشاب طبيعية لزيادة الطاقة والنشاط', '/images/products/category-energizing.jpg', 'energizing-herbs'),
('أعشاب الجهاز الهضمي', 'أعشاب لتحسين صحة الجهاز الهضمي', '/images/products/category-digestive.jpg', 'digestive-herbs'),
('أعشاب المناعة', 'أعشاب لتقوية جهاز المناعة', '/images/products/category-immunity.jpg', 'immunity-herbs'),
('أعشاب الاسترخاء', 'أعشاب للاسترخاء وتهدئة الأعصاب', '/images/products/category-relaxation.jpg', 'relaxation-herbs'),
('أعشاب صحة البشرة', 'أعشاب لتحسين صحة وجمال البشرة', '/images/products/category-skin.jpg', 'skin-health-herbs'),
('الزيوت العطرية', 'زيوت طبيعية عطرية وطبية', '/images/products/category-oils.jpg', 'essential-oils')
ON CONFLICT (slug) DO NOTHING;

-- Insert Products - Energizing Herbs
INSERT INTO products (name, description, long_description, price, category_id, image_url, benefits, usage_instructions, ingredients, sku, is_featured) 
SELECT 
  'الجينسنج الأحمر',
  'عشبة تقليدية لزيادة الطاقة والحيوية',
  'الجينسنج الأحمر الكوري يشتهر بفوائده في زيادة الطاقة والحيوية الجسدية والعقلية. يساعد في تحسين التركيز والقدرة على التحمل.',
  89.99,
  (SELECT id FROM categories WHERE slug = 'energizing-herbs'),
  '/images/products/product-ginseng.jpg',
  ARRAY['زيادة الطاقة', 'تحسين التركيز', 'تقوية المناعة'],
  'تناول ملعقة صغيرة مع الماء الدافئ يومياً',
  'جينسنج أحمر طبيعي 100%',
  'GINSENG-001',
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'GINSENG-001');

INSERT INTO products (name, description, long_description, price, category_id, image_url, benefits, usage_instructions, ingredients, sku) 
SELECT 
  'الماكا البيروفية',
  'مسحوق الماكا لزيادة الطاقة والحيوية الجنسية',
  'عشبة بيروفية تقليدية معروفة بفوائدها الصحية المتعددة وخاصة لزيادة الطاقة والحيوية.',
  64.99,
  (SELECT id FROM categories WHERE slug = 'energizing-herbs'),
  '/images/products/product-maca.jpg',
  ARRAY['زيادة الطاقة', 'تحسين الحيوية', 'تقوية الصحة الجنسية'],
  'ملعقة صغيرة في الماء الدافئ أو الحليب',
  'مسحوق الماكا النقي 100%',
  'MACA-001'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MACA-001');

-- Insert Products - Digestive Herbs
INSERT INTO products (name, description, long_description, price, category_id, image_url, benefits, usage_instructions, ingredients, sku, is_featured) 
SELECT 
  'شاي الزنجبيل والقرفة',
  'مزيج طبيعي لتحسين الهضم',
  'مزيج من الزنجبيل والقرفة الطبيعية يساعد في تحسين عملية الهضم وتقليل الانتفاخ والغازات.',
  34.99,
  (SELECT id FROM categories WHERE slug = 'digestive-herbs'),
  '/images/products/product-ginger-cinnamon.jpg',
  ARRAY['تحسين الهضم', 'تقليل الانتفاخ', 'تدفئة المعدة'],
  'كيس واحد في كوب ماء دافئ 3 مرات يومياً',
  'زنجبيل، قرفة، قرنفل',
  'GINGER-CINNAMON-001',
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'GINGER-CINNAMON-001');

INSERT INTO products (name, description, long_description, price, category_id, image_url, benefits, usage_instructions, ingredients, sku) 
SELECT 
  'أعشاب السنوة',
  'عشبة تقليدية لتهدئة المعدة',
  'السنوة من الأعشاب التقليدية المشهورة بفوائدها في تهدئة المعدة وتحسين الهضم.',
  29.99,
  (SELECT id FROM categories WHERE slug = 'digestive-herbs'),
  '/images/products/product-senna.jpg',
  ARRAY['تهدئة المعدة', 'تحسين الهضم', 'تقليل الحموضة'],
  'ملعقة صغيرة في الماء الدافئ مرتين يومياً',
  'أوراق السنوة الجافة',
  'SENNA-001'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'SENNA-001');

-- Insert Products - Immunity Herbs
INSERT INTO products (name, description, long_description, price, category_id, image_url, benefits, usage_instructions, ingredients, sku, is_featured) 
SELECT 
  'الإكيناسيا',
  'عشبة قوية لتقوية المناعة',
  'الإكيناسيا معروفة عالمياً بقدرتها على تقوية جهاز المناعة ومحاربة الأمراض.',
  59.99,
  (SELECT id FROM categories WHERE slug = 'immunity-herbs'),
  '/images/products/product-echinacea.jpg',
  ARRAY['تقوية المناعة', 'محاربة الأمراض', 'تقليل مدة الزكام'],
  'كبسولة واحدة مع الماء مرتين يومياً',
  'مستخلص الإكيناسيا 500mg',
  'ECHINACEA-001',
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ECHINACEA-001');

INSERT INTO products (name, description, long_description, price, category_id, image_url, benefits, usage_instructions, ingredients, sku) 
SELECT 
  'عسل الزعفران والأعشاب',
  'عسل طبيعي مخلوط بأعشاب معززة للمناعة',
  'عسل طبيعي نقي مخلوط بالزعفران والأعشاب الطبية لتقوية المناعة وتحسين الصحة العامة.',
  79.99,
  (SELECT id FROM categories WHERE slug = 'immunity-herbs'),
  '/images/products/product-honey.jpg',
  ARRAY['تقوية المناعة', 'مضاد للأكسدة', 'تحسين الصحة العامة'],
  'ملعقة صغيرة في الماء الدافئ كل صباح',
  'عسل نقي، زعفران، أعشاب',
  'HONEY-SAFFRON-001'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HONEY-SAFFRON-001');

-- Insert Products - Relaxation Herbs
INSERT INTO products (name, description, long_description, price, category_id, image_url, benefits, usage_instructions, ingredients, sku, is_featured) 
SELECT 
  'شاي البابونج والخزامى',
  'مزيج استرخاء طبيعي',
  'البابونج والخزامى معروفان بخصائصهما المهدئة والمريحة للأعصاب والعقل.',
  39.99,
  (SELECT id FROM categories WHERE slug = 'relaxation-herbs'),
  '/images/products/product-chamomile-lavender.jpg',
  ARRAY['تهدئة الأعصاب', 'تحسين النوم', 'تقليل القلق'],
  'كيس واحد في كوب ماء دافئ قبل النوم',
  'بابونج، خزامى، ميليسا',
  'CHAMOMILE-LAVENDER-001',
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CHAMOMILE-LAVENDER-001');

INSERT INTO products (name, description, long_description, price, category_id, image_url, benefits, usage_instructions, ingredients, sku) 
SELECT 
  'بلسم الليمون المجفف',
  'عشبة مهدئة وطاردة للقلق',
  'بلسم الليمون معروف بفعاليته في تقليل التوتر والقلق وتحسين الحالة المزاجية.',
  44.99,
  (SELECT id FROM categories WHERE slug = 'relaxation-herbs'),
  '/images/products/product-lemon-balm.jpg',
  ARRAY['تقليل التوتر', 'تحسين المزاج', 'تهدئة الأعصاب'],
  'ملعقة صغيرة في الماء الدافئ عند الحاجة',
  'أوراق بلسم الليمون الجافة',
  'LEMON-BALM-001'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'LEMON-BALM-001');

-- Insert Products - Skin Health
INSERT INTO products (name, description, long_description, price, category_id, image_url, benefits, usage_instructions, ingredients, sku, is_featured) 
SELECT 
  'شاي الوردة وفاكهة الورد',
  'شاي طبيعي لجمال وصحة البشرة',
  'مزيج من أوراق الورد وفاكهة الورد الطبيعية غنية بالفيتامينات والمضادات الأكسدة.',
  54.99,
  (SELECT id FROM categories WHERE slug = 'skin-health-herbs'),
  '/images/products/product-rose-hip.jpg',
  ARRAY['تحسين البشرة', 'مضاد للأكسدة', 'تقليل التجاعيد'],
  'كيس واحد في كوب ماء دافئ مرتين يومياً',
  'أوراق الورد، فاكهة الورد',
  'ROSE-HIP-001',
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ROSE-HIP-001');

INSERT INTO products (name, description, long_description, price, category_id, image_url, benefits, usage_instructions, ingredients, sku) 
SELECT 
  'قناع الكركم والعسل',
  'قناع طبيعي للبشرة',
  'مزيج الكركم والعسل الطبيعي يساعد في تنظيف وتجديد البشرة وتقليل الالتهابات.',
  49.99,
  (SELECT id FROM categories WHERE slug = 'skin-health-herbs'),
  '/images/products/product-turmeric-honey.jpg',
  ARRAY['تنظيف البشرة', 'تقليل الالتهابات', 'تجديد الجلد'],
  'ملعقتان صغيرتان على الوجه لمدة 15 دقيقة',
  'كركم، عسل، زيت جوز الهند',
  'TURMERIC-HONEY-001'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TURMERIC-HONEY-001');

-- Insert Products - Essential Oils
INSERT INTO products (name, description, long_description, price, category_id, image_url, benefits, usage_instructions, ingredients, sku, is_featured) 
SELECT 
  'زيت اللافندر العطري',
  'زيت اللافندر الأساسي النقي',
  'زيت اللافندر العطري النقي مستخلص من أفضل أنواع الخزامى، معروف بخصائصه المهدئة والعطرية الممتازة.',
  69.99,
  (SELECT id FROM categories WHERE slug = 'essential-oils'),
  '/images/products/product-lavender-oil.jpg',
  ARRAY['تهدئة الأعصاب', 'عطر طبيعي', 'تحسين النوم'],
  'قطرات قليلة في الناشر أو وسادتك',
  'زيت اللافندر 100% نقي - 30ml',
  'LAVENDER-OIL-001',
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'LAVENDER-OIL-001');

INSERT INTO products (name, description, long_description, price, category_id, image_url, benefits, usage_instructions, ingredients, sku) 
SELECT 
  'زيت النعناع المنثول',
  'زيت النعناع العطري والطبي',
  'زيت النعناع الأساسي غني بالمنثول الطبيعي، يساعد في تحسين التنفس وتنشيط الذهن.',
  64.99,
  (SELECT id FROM categories WHERE slug = 'essential-oils'),
  '/images/products/product-peppermint-oil.jpg',
  ARRAY['تحسين التنفس', 'تنشيط الذهن', 'تهدئة الصداع'],
  'قطرات قليلة في الناشر أو ماء مقطر',
  'زيت النعناع 100% نقي - 30ml',
  'PEPPERMINT-OIL-001'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PEPPERMINT-OIL-001');

-- Update stock quantities
UPDATE products SET stock_quantity = 50;

-- Set ratings and review counts for featured products
UPDATE products SET rating = 4.8, review_count = 24 WHERE is_featured = true;
UPDATE products SET rating = 4.5, review_count = 12 WHERE is_featured = false;
