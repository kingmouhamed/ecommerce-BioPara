export const products = [
  // منتجات الأعشاب الطبية
  { "id": 1, "name": "عشبة الخزامى (Lavande)", "category": "الأعشاب الطبية", "price": 25, "image": "/products1.png", "reviews": 120, "rating": 4.9, "description": "تهدئ وتريح الجهاز العصبي، مثالية للاسترخاء والنوم." },
  { "id": 2, "name": "إكليل الجبل (Romarin)", "category": "الأعشاب الطبية", "price": 18, "originalPrice": 25, "image": "/products2.png", "reviews": 95, "rating": 4.7, "description": "يحسن الذاكرة وينشط الدورة الدموية." },
  { "id": 3, "name": "البابونج الطبيعي", "category": "الأعشاب الطبية", "price": 30, "image": "/products3.png", "reviews": 85, "rating": 4.8, "description": "يساعد على الاسترخاء والنوم الهادئ." },
  { "id": 4, "name": "زعتر جبل أطلس", "category": "الأعشاب الطبية", "price": 35, "image": "/products4.png", "reviews": 110, "rating": 4.6, "description": "مضاد حيوي طبيعي ومعالج للجهاز التنفسي." },
  { "id": 5, "name": "عشبة القدسين", "category": "الأعشاب الطبية", "price": 65, "originalPrice": 80, "image": "/products5.png", "reviews": 45, "rating": 4.8, "description": "تقوي جهاز المناعة وتعالج الالتهابات." },
  { "id": 11, "name": "عشبة النافع", "category": "الأعشاب الطبية", "price": 60, "image": "/products11.png", "reviews": 32, "rating": 4.6, "description": "معروفة بخصائصها المضادة للأكسدة والمقوية للصحة." },
  { "id": 13, "name": "عشبة المورينجا", "category": "الأعشاب الطبية", "price": 45, "image": "/products13.png", "reviews": 88, "rating": 4.5, "description": "غنية بالفيتامينات وتعزز الطاقة والحيوية." },
  { "id": 14, "name": "الجينسنغ المغربي", "category": "الأعشاب الطبية", "price": 90, "image": "/products14.png", "reviews": 102, "rating": 4.8, "description": "يعزز القوة البدنية ويزيل التعب." },
  { "id": 15, "name": "ورق الزيتون", "category": "الأعشاب الطبية", "price": 20, "image": "/products15.png", "reviews": 75, "rating": 4.3, "description": "يخفض ضغط الدم وينظم سكر الدم." },
  { "id": 19, "name": "مسحوق الكركم", "category": "الأعشاب الطبية", "price": 22, "originalPrice": 30, "image": "/products19.png", "reviews": 150, "rating": 4.8, "description": "مضاد قوي للالتهابات ويعزز صحة المفاصل." },
  { "id": 20, "name": "بذور الشيا", "category": "الأعشاب الطبية", "price": 40, "image": "/products17.png", "reviews": 130, "rating": 4.7, "description": "غنية بأوميغا 3 وتحسن صحة القلب." },
  { "id": 21, "name": "عرق السوس", "category": "الأعشاب الطبية", "price": 30, "image": "/products21.png", "reviews": 90, "rating": 4.4, "description": "يساعد على علاج مشاكل الجهاز الهضمي." },

  // منتجات Parapharmacie
  { "id": 6, "name": "زيت الأركان النقي", "category": "Parapharmacie", "price": 150, "originalPrice": 180, "image": "/products6.png", "reviews": 200, "rating": 4.9, "isNew": true, "description": "يغذي ويرطب الشعر والبشرة بعمق." },
  { "id": 7, "name": "سيروم فيتامين C", "category": "Parapharmacie", "price": 220, "image": "/products7.png", "reviews": 150, "rating": 4.7, "description": "يعزز إشراقة البشرة ويحارب علامات التقدم في السن." },
  { "id": 8, "name": "واقي شمس SPF50", "category": "Parapharmacie", "price": 120, "originalPrice": 140, "image": "/products8.png", "reviews": 180, "rating": 4.8, "description": "حماية عالية من أشعة الشمس UVA/UVB." },
  { "id": 9, "name": "صابون النيلة الزرقاء", "category": "Parapharmacie", "price": 45, "image": "/products9.png", "reviews": 90, "rating": 4.5, "description": "يفتح ويوحد لون البشرة بشكل طبيعي." },
  { "id": 10, "name": "كريم الترطيب الليلي", "category": "Parapharmacie", "price": 110, "image": "/products10.png", "reviews": 130, "rating": 4.6, "description": "يجدد ويرطب البشرة أثناء الليل." },
  { "id": 12, "name": "علاج البشارة", "category": "Parapharmacie", "price": 270, "image": "/products12.png", "reviews": 75, "rating": 4.4, "description": "حل فعال لمشاكل البشرة الشائعة." },
  { "id": 16, "name": "قناع الطين الأخضر", "category": "Parapharmacie", "price": 50, "originalPrice": 65, "image": "/products16.png", "reviews": 115, "rating": 4.6, "description": "ينقي البشرة الدهنية ويزيل الشوائب." },
  { "id": 17, "name": "ماء الورد المقطر", "category": "Parapharmacie", "price": 35, "image": "/products20.png", "reviews": 180, "rating": 4.9, "description": "ينعش ويهدئ البشرة، مثالي لجميع أنواع البشرة." },
  { "id": 18, "name": "زبدة الشيا الخام", "category": "Parapharmacie", "price": 80, "image": "/products18.png", "reviews": 95, "rating": 4.7, "description": "ترطيب عميق للجسم والمناطق الجافة." },
  { "id": 22, "name": "كريم النهار بفيتامين E", "category": "Parapharmacie", "price": 130, "image": "/products22.png", "reviews": 110, "rating": 4.5, "description": "يحمي البشرة من الأضرار اليومية ويرطبها." },
  { "id": 23, "name": "مقشر الجسم بالملح البحري", "category": "Parapharmacie", "price": 70, "originalPrice": 85, "image": "/products23.png", "reviews": 140, "rating": 4.6, "description": "يزيل الجلد الميت وينعم البشرة." }
]
