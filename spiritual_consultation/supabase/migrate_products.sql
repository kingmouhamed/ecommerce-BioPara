-- =========================================================
-- BioPara: 61 Products SQL Migration Seed File
-- Generated automatically by migration script
-- =========================================================

-- 1. Seed Categories if they do not exist
INSERT INTO public.categories (name, slug, description) VALUES
  ('أعشاب طبية', 'herbs', 'أعشاب طبية طبيعية 100%'),
  ('شاي الأعشاب', 'herbal-tea', 'شاي مستخلص من أجود الأعشاب'),
  ('مكملات غذائية', 'supplements', 'مكملات غذائية طبيعية'),
  ('زيوت طبية', 'oils', 'زيوت عطرية وطبية طبيعية'),
  ('عسل طبيعي', 'honey', 'أنواع العسل الطبيعي الأصيل')
ON CONFLICT (name) DO NOTHING;

-- 2. Clear and Insert Products
DELETE FROM public.products;

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'مكمل أشواجاندا',
  'مكمل أشواجاندا الممتاز لدعم صحتك العامة وتعزيز نشاطك اليومي.',
  123,
  'مكملات غذائية',
  (SELECT id FROM public.categories WHERE slug = 'supplements' LIMIT 1),
  '/images/dietary-supplements/ashwagandha.jpg',
  42,
  4.6,
  19,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'مكمل بيوتين',
  'مكمل بيوتين الممتاز لدعم صحتك العامة وتعزيز نشاطك اليومي.',
  224,
  'مكملات غذائية',
  (SELECT id FROM public.categories WHERE slug = 'supplements' LIMIT 1),
  '/images/dietary-supplements/biotin.jpg',
  58,
  4.7,
  79,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'مكمل كولاجين',
  'مكمل كولاجين الممتاز لدعم صحتك العامة وتعزيز نشاطك اليومي.',
  204,
  'مكملات غذائية',
  (SELECT id FROM public.categories WHERE slug = 'supplements' LIMIT 1),
  '/images/dietary-supplements/collagen.jpg',
  33,
  4.2,
  13,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'مكمل إل-جلوتاثيون',
  'مكمل إل-جلوتاثيون الممتاز لدعم صحتك العامة وتعزيز نشاطك اليومي.',
  141,
  'مكملات غذائية',
  (SELECT id FROM public.categories WHERE slug = 'supplements' LIMIT 1),
  '/images/dietary-supplements/l-glutathione.jpg',
  12,
  4.6,
  14,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'مكمل مغنيسيوم',
  'مكمل مغنيسيوم الممتاز لدعم صحتك العامة وتعزيز نشاطك اليومي.',
  191,
  'مكملات غذائية',
  (SELECT id FROM public.categories WHERE slug = 'supplements' LIMIT 1),
  '/images/dietary-supplements/magnesium.jpg',
  35,
  4.7,
  50,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'مكمل مستكة',
  'مكمل مستكة الممتاز لدعم صحتك العامة وتعزيز نشاطك اليومي.',
  145,
  'مكملات غذائية',
  (SELECT id FROM public.categories WHERE slug = 'supplements' LIMIT 1),
  '/images/dietary-supplements/mastic-gum.jpg',
  17,
  4,
  86,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'مكمل فيتامينات متعددة',
  'مكمل فيتامينات متعددة الممتاز لدعم صحتك العامة وتعزيز نشاطك اليومي.',
  92,
  'مكملات غذائية',
  (SELECT id FROM public.categories WHERE slug = 'supplements' LIMIT 1),
  '/images/dietary-supplements/multivitamins.jpg',
  19,
  4.4,
  148,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'مكمل Omega 3 Fish',
  'مكمل Omega 3 Fish الممتاز لدعم صحتك العامة وتعزيز نشاطك اليومي.',
  148,
  'مكملات غذائية',
  (SELECT id FROM public.categories WHERE slug = 'supplements' LIMIT 1),
  '/images/dietary-supplements/omega-3-fish-oil.jpg',
  21,
  4.5,
  101,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'مكمل مكمل أوميغا 3',
  'مكمل مكمل أوميغا 3 الممتاز لدعم صحتك العامة وتعزيز نشاطك اليومي.',
  244,
  'مكملات غذائية',
  (SELECT id FROM public.categories WHERE slug = 'supplements' LIMIT 1),
  '/images/dietary-supplements/omega3-supplement.jpg',
  34,
  4.5,
  128,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'مكمل بروبيوتيك',
  'مكمل بروبيوتيك الممتاز لدعم صحتك العامة وتعزيز نشاطك اليومي.',
  144,
  'مكملات غذائية',
  (SELECT id FROM public.categories WHERE slug = 'supplements' LIMIT 1),
  '/images/dietary-supplements/probiotic.jpg',
  37,
  4.8,
  46,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'مكمل شيلاجيت',
  'مكمل شيلاجيت الممتاز لدعم صحتك العامة وتعزيز نشاطك اليومي.',
  130,
  'مكملات غذائية',
  (SELECT id FROM public.categories WHERE slug = 'supplements' LIMIT 1),
  '/images/dietary-supplements/shilajit.jpg',
  47,
  4.4,
  157,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'مكمل فيتامين D3 + K2',
  'مكمل فيتامين D3 + K2 الممتاز لدعم صحتك العامة وتعزيز نشاطك اليومي.',
  171,
  'مكملات غذائية',
  (SELECT id FROM public.categories WHERE slug = 'supplements' LIMIT 1),
  '/images/dietary-supplements/vitamin-d3-k2.jpg',
  26,
  4.6,
  118,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'مكمل زنك',
  'مكمل زنك الممتاز لدعم صحتك العامة وتعزيز نشاطك اليومي.',
  68,
  'مكملات غذائية',
  (SELECT id FROM public.categories WHERE slug = 'supplements' LIMIT 1),
  '/images/dietary-supplements/zinc.jpg',
  15,
  4.6,
  123,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'أعشاب اليانسون',
  'أعشاب اليانسون طبيعية وعضوية، مثالية للاستخدام اليومي.',
  180,
  'أعشاب طبية',
  (SELECT id FROM public.categories WHERE slug = 'herbs' LIMIT 1),
  '/images/medicinal-herbs/Ashwagandha.jpg',
  49,
  4.8,
  35,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'أعشاب البابونج',
  'أعشاب البابونج طبيعية وعضوية، مثالية للاستخدام اليومي.',
  249,
  'أعشاب طبية',
  (SELECT id FROM public.categories WHERE slug = 'herbs' LIMIT 1),
  '/images/medicinal-herbs/camomile-herb.jpg',
  27,
  4.3,
  153,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'أعشاب القرفة',
  'أعشاب القرفة طبيعية وعضوية، مثالية للاستخدام اليومي.',
  47,
  'أعشاب طبية',
  (SELECT id FROM public.categories WHERE slug = 'herbs' LIMIT 1),
  '/images/medicinal-herbs/camomile-herb.jpg',
  56,
  4.2,
  61,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'أعشاب الزنجبيل',
  'أعشاب الزنجبيل طبيعية وعضوية، مثالية للاستخدام اليومي.',
  235,
  'أعشاب طبية',
  (SELECT id FROM public.categories WHERE slug = 'herbs' LIMIT 1),
  '/images/medicinal-herbs/ginger-herb.jpg',
  35,
  4.8,
  78,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'أعشاب الكركديه',
  'أعشاب الكركديه طبيعية وعضوية، مثالية للاستخدام اليومي.',
  86,
  'أعشاب طبية',
  (SELECT id FROM public.categories WHERE slug = 'herbs' LIMIT 1),
  '/images/medicinal-herbs/ginger-herb.jpg',
  45,
  4.7,
  117,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'أعشاب لافندر (خزامى)',
  'أعشاب لافندر (خزامى) طبيعية وعضوية، مثالية للاستخدام اليومي.',
  107,
  'أعشاب طبية',
  (SELECT id FROM public.categories WHERE slug = 'herbs' LIMIT 1),
  '/images/medicinal-herbs/Eucalyptus.jpg',
  52,
  4.6,
  125,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'أعشاب اللويزة',
  'أعشاب اللويزة طبيعية وعضوية، مثالية للاستخدام اليومي.',
  192,
  'أعشاب طبية',
  (SELECT id FROM public.categories WHERE slug = 'herbs' LIMIT 1),
  '/images/medicinal-herbs/Foeniculum.jpg',
  51,
  4.1,
  62,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'أعشاب النعناع',
  'أعشاب النعناع طبيعية وعضوية، مثالية للاستخدام اليومي.',
  110,
  'أعشاب طبية',
  (SELECT id FROM public.categories WHERE slug = 'herbs' LIMIT 1),
  '/images/medicinal-herbs/Ginseng.jpg',
  30,
  4.5,
  128,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'أعشاب إكليل الجبل',
  'أعشاب إكليل الجبل طبيعية وعضوية، مثالية للاستخدام اليومي.',
  96,
  'أعشاب طبية',
  (SELECT id FROM public.categories WHERE slug = 'herbs' LIMIT 1),
  '/images/medicinal-herbs/Maca.jpg',
  17,
  4.6,
  11,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'أعشاب المريمية',
  'أعشاب المريمية طبيعية وعضوية، مثالية للاستخدام اليومي.',
  205,
  'أعشاب طبية',
  (SELECT id FROM public.categories WHERE slug = 'herbs' LIMIT 1),
  '/images/medicinal-herbs/Saints.jpg',
  27,
  4.3,
  58,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'أعشاب الزعتر',
  'أعشاب الزعتر طبيعية وعضوية، مثالية للاستخدام اليومي.',
  143,
  'أعشاب طبية',
  (SELECT id FROM public.categories WHERE slug = 'herbs' LIMIT 1),
  '/images/medicinal-herbs/Thyme.jpg',
  52,
  4.4,
  26,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'أعشاب الكركم',
  'أعشاب الكركم طبيعية وعضوية، مثالية للاستخدام اليومي.',
  125,
  'أعشاب طبية',
  (SELECT id FROM public.categories WHERE slug = 'herbs' LIMIT 1),
  '/images/medicinal-herbs/Moringa.jpg',
  33,
  4.7,
  153,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'زيت Almond العضوي',
  'زيت Almond العضوي النقي، مستخلص بعناية للحفاظ على فوائده.',
  69,
  'زيوت طبية',
  (SELECT id FROM public.categories WHERE slug = 'oils' LIMIT 1),
  '/images/medicinal-oils/almond-oil.jpg',
  39,
  4.2,
  142,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'زيت أرغان العضوي',
  'زيت أرغان العضوي النقي، مستخلص بعناية للحفاظ على فوائده.',
  215,
  'زيوت طبية',
  (SELECT id FROM public.categories WHERE slug = 'oils' LIMIT 1),
  '/images/medicinal-oils/argan-oil.jpg',
  14,
  4.1,
  113,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'زيت حبة البركة العضوي',
  'زيت حبة البركة العضوي النقي، مستخلص بعناية للحفاظ على فوائده.',
  132,
  'زيوت طبية',
  (SELECT id FROM public.categories WHERE slug = 'oils' LIMIT 1),
  '/images/medicinal-oils/black-seed-oil.jpg',
  17,
  4.4,
  137,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'زيت خروع العضوي',
  'زيت خروع العضوي النقي، مستخلص بعناية للحفاظ على فوائده.',
  197,
  'زيوت طبية',
  (SELECT id FROM public.categories WHERE slug = 'oils' LIMIT 1),
  '/images/medicinal-oils/castor-oil.jpg',
  22,
  4.1,
  113,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'زيت Ginger العضوي',
  'زيت Ginger العضوي النقي، مستخلص بعناية للحفاظ على فوائده.',
  181,
  'زيوت طبية',
  (SELECT id FROM public.categories WHERE slug = 'oils' LIMIT 1),
  '/images/medicinal-oils/ginger-oil.jpg',
  15,
  4.8,
  105,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'زيت Gratic العضوي',
  'زيت Gratic العضوي النقي، مستخلص بعناية للحفاظ على فوائده.',
  71,
  'زيوت طبية',
  (SELECT id FROM public.categories WHERE slug = 'oils' LIMIT 1),
  '/images/medicinal-oils/gratic-oil.jpg',
  52,
  4.6,
  71,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'زيت Lanvender العضوي',
  'زيت Lanvender العضوي النقي، مستخلص بعناية للحفاظ على فوائده.',
  64,
  'زيوت طبية',
  (SELECT id FROM public.categories WHERE slug = 'oils' LIMIT 1),
  '/images/medicinal-oils/lanvender-oil.jpg',
  48,
  4.9,
  53,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'زيت Musk العضوي',
  'زيت Musk العضوي النقي، مستخلص بعناية للحفاظ على فوائده.',
  170,
  'زيوت طبية',
  (SELECT id FROM public.categories WHERE slug = 'oils' LIMIT 1),
  '/images/medicinal-oils/musk-oil.jpg',
  59,
  4.4,
  140,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'زيت زيتون العضوي',
  'زيت زيتون العضوي النقي، مستخلص بعناية للحفاظ على فوائده.',
  212,
  'زيوت طبية',
  (SELECT id FROM public.categories WHERE slug = 'oils' LIMIT 1),
  '/images/medicinal-oils/olive-oil.jpg',
  33,
  4.3,
  76,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'زيت Rose العضوي',
  'زيت Rose العضوي النقي، مستخلص بعناية للحفاظ على فوائده.',
  202,
  'زيوت طبية',
  (SELECT id FROM public.categories WHERE slug = 'oils' LIMIT 1),
  '/images/medicinal-oils/rose-oil.jpg',
  21,
  4.5,
  58,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'زيت سدر العضوي',
  'زيت سدر العضوي النقي، مستخلص بعناية للحفاظ على فوائده.',
  158,
  'زيوت طبية',
  (SELECT id FROM public.categories WHERE slug = 'oils' LIMIT 1),
  '/images/medicinal-oils/sidr-oil.jpg',
  36,
  4.5,
  125,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'عسل طلح طبيعي',
  'عسل طلح طبيعي نقي 100%، غني بالفوائد والمغذيات.',
  120,
  'عسل طبيعي',
  (SELECT id FROM public.categories WHERE slug = 'honey' LIMIT 1),
  '/images/natural-honey/acacia-honey.jpg',
  20,
  4.7,
  93,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'عسل Blackseed طبيعي',
  'عسل Blackseed طبيعي نقي 100%، غني بالفوائد والمغذيات.',
  231,
  'عسل طبيعي',
  (SELECT id FROM public.categories WHERE slug = 'honey' LIMIT 1),
  '/images/natural-honey/blackseed-honey.jpg',
  59,
  4.7,
  40,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'عسل Carob طبيعي',
  'عسل Carob طبيعي نقي 100%، غني بالفوائد والمغذيات.',
  94,
  'عسل طبيعي',
  (SELECT id FROM public.categories WHERE slug = 'honey' LIMIT 1),
  '/images/natural-honey/carob-honey.jpg',
  30,
  4.8,
  115,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'عسل Daghmos طبيعي',
  'عسل Daghmos طبيعي نقي 100%، غني بالفوائد والمغذيات.',
  91,
  'عسل طبيعي',
  (SELECT id FROM public.categories WHERE slug = 'honey' LIMIT 1),
  '/images/natural-honey/daghmos-honey.jpg',
  28,
  4.6,
  143,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'عسل كافور طبيعي',
  'عسل كافور طبيعي نقي 100%، غني بالفوائد والمغذيات.',
  184,
  'عسل طبيعي',
  (SELECT id FROM public.categories WHERE slug = 'honey' LIMIT 1),
  '/images/natural-honey/eucalyptus-honey.jpg',
  34,
  4.3,
  67,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'عسل Flower طبيعي',
  'عسل Flower طبيعي نقي 100%، غني بالفوائد والمغذيات.',
  136,
  'عسل طبيعي',
  (SELECT id FROM public.categories WHERE slug = 'honey' LIMIT 1),
  '/images/natural-honey/flower-honey.jpg',
  52,
  4.8,
  100,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'عسل Forest طبيعي',
  'عسل Forest طبيعي نقي 100%، غني بالفوائد والمغذيات.',
  128,
  'عسل طبيعي',
  (SELECT id FROM public.categories WHERE slug = 'honey' LIMIT 1),
  '/images/natural-honey/forest-honey.jpg',
  26,
  4.6,
  75,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'عسل مانوكا طبيعي',
  'عسل مانوكا طبيعي نقي 100%، غني بالفوائد والمغذيات.',
  184,
  'عسل طبيعي',
  (SELECT id FROM public.categories WHERE slug = 'honey' LIMIT 1),
  '/images/natural-honey/manuka-honey.jpg',
  59,
  4,
  135,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'عسل Orange Blossom طبيعي',
  'عسل Orange Blossom طبيعي نقي 100%، غني بالفوائد والمغذيات.',
  173,
  'عسل طبيعي',
  (SELECT id FROM public.categories WHERE slug = 'honey' LIMIT 1),
  '/images/natural-honey/orange-blossom-honey.jpg',
  54,
  4.8,
  59,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'عسل سدر طبيعي',
  'عسل سدر طبيعي نقي 100%، غني بالفوائد والمغذيات.',
  119,
  'عسل طبيعي',
  (SELECT id FROM public.categories WHERE slug = 'honey' LIMIT 1),
  '/images/natural-honey/sidr-honey.jpg',
  16,
  4.9,
  140,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'عسل Thyme طبيعي',
  'عسل Thyme طبيعي نقي 100%، غني بالفوائد والمغذيات.',
  198,
  'عسل طبيعي',
  (SELECT id FROM public.categories WHERE slug = 'honey' LIMIT 1),
  '/images/natural-honey/thyme-honey.jpg',
  58,
  4.6,
  64,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'عسل Wildflower طبيعي',
  'عسل Wildflower طبيعي نقي 100%، غني بالفوائد والمغذيات.',
  199,
  'عسل طبيعي',
  (SELECT id FROM public.categories WHERE slug = 'honey' LIMIT 1),
  '/images/natural-honey/wildflower-honey.jpg',
  50,
  4.9,
  123,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'شاي اليانسون',
  'شاي اليانسون عضوي وممتاز للاسترخاء والصحة العامة.',
  45,
  'شاي أعشاب',
  (SELECT id FROM public.categories WHERE slug = 'herbal-tea' LIMIT 1),
  '/images/herbal tea/anise-herb.jpg',
  100,
  4.7,
  96,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'شاي البابونج',
  'شاي البابونج عضوي وممتاز للاسترخاء والصحة العامة.',
  55,
  'شاي أعشاب',
  (SELECT id FROM public.categories WHERE slug = 'herbal-tea' LIMIT 1),
  '/images/herbal tea/camomile-herb.jpg',
  100,
  4.1,
  34,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'شاي القرفة',
  'شاي القرفة عضوي وممتاز للاسترخاء والصحة العامة.',
  50,
  'شاي أعشاب',
  (SELECT id FROM public.categories WHERE slug = 'herbal-tea' LIMIT 1),
  '/images/herbal tea/cinnamon-herb.jpg',
  100,
  4.6,
  138,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'شاي الزنجبيل',
  'شاي الزنجبيل عضوي وممتاز للاسترخاء والصحة العامة.',
  60,
  'شاي أعشاب',
  (SELECT id FROM public.categories WHERE slug = 'herbal-tea' LIMIT 1),
  '/images/herbal tea/ginger-herb.jpg',
  100,
  4.5,
  46,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'شاي أعشاب مشكلة',
  'شاي أعشاب مشكلة عضوي وممتاز للاسترخاء والصحة العامة.',
  55,
  'شاي أعشاب',
  (SELECT id FROM public.categories WHERE slug = 'herbal-tea' LIMIT 1),
  '/images/herbal tea/herb-tea-2.jpg',
  100,
  4.6,
  41,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'شاي الكركديه',
  'شاي الكركديه عضوي وممتاز للاسترخاء والصحة العامة.',
  45,
  'شاي أعشاب',
  (SELECT id FROM public.categories WHERE slug = 'herbal-tea' LIMIT 1),
  '/images/herbal tea/hibiscus-herb.jpg',
  100,
  4.4,
  44,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'شاي الخزامى',
  'شاي الخزامى عضوي وممتاز للاسترخاء والصحة العامة.',
  70,
  'شاي أعشاب',
  (SELECT id FROM public.categories WHERE slug = 'herbal-tea' LIMIT 1),
  '/images/herbal tea/lavender-herb.jpg',
  100,
  4.6,
  59,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'شاي اللويزة',
  'شاي اللويزة عضوي وممتاز للاسترخاء والصحة العامة.',
  50,
  'شاي أعشاب',
  (SELECT id FROM public.categories WHERE slug = 'herbal-tea' LIMIT 1),
  '/images/herbal tea/lemon-verbena-herb.jpg',
  100,
  4.6,
  86,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'شاي النعناع',
  'شاي النعناع عضوي وممتاز للاسترخاء والصحة العامة.',
  40,
  'شاي أعشاب',
  (SELECT id FROM public.categories WHERE slug = 'herbal-tea' LIMIT 1),
  '/images/herbal tea/mint-herb.jpg',
  100,
  4.8,
  33,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'شاي إكليل الجبل',
  'شاي إكليل الجبل عضوي وممتاز للاسترخاء والصحة العامة.',
  45,
  'شاي أعشاب',
  (SELECT id FROM public.categories WHERE slug = 'herbal-tea' LIMIT 1),
  '/images/herbal tea/rosemary-herb.jpg',
  100,
  4.5,
  27,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'شاي المريمية',
  'شاي المريمية عضوي وممتاز للاسترخاء والصحة العامة.',
  50,
  'شاي أعشاب',
  (SELECT id FROM public.categories WHERE slug = 'herbal-tea' LIMIT 1),
  '/images/herbal tea/sage-herb.jpg',
  100,
  4,
  71,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'شاي الزعتر',
  'شاي الزعتر عضوي وممتاز للاسترخاء والصحة العامة.',
  45,
  'شاي أعشاب',
  (SELECT id FROM public.categories WHERE slug = 'herbal-tea' LIMIT 1),
  '/images/herbal tea/thyme-herb.jpg',
  100,
  4.4,
  148,
  true
);

INSERT INTO public.products (name, description, price, category, category_id, image_url, stock_quantity, rating, reviews_count, is_active) VALUES (
  'شاي الكركم',
  'شاي الكركم عضوي وممتاز للاسترخاء والصحة العامة.',
  55,
  'شاي أعشاب',
  (SELECT id FROM public.categories WHERE slug = 'herbal-tea' LIMIT 1),
  '/images/herbal tea/turmeric-herb.jpg',
  100,
  4.1,
  130,
  true
);

