// ignore_for_file: unused_import

class ProductService {
  static List<Map<String, dynamic>> getSampleProducts() {
    return [
      {
        'id': '1',
        'name': 'Biotein Protein',
        'name_ar': 'بيوتين بروتين',
        'description': 'بروتين نباتي طبيعي لزيادة الطاقة والعضلات',
        'price': 199.0,
        'category': 'nutrition',
        'image_url':
            'https://via.placeholder.com/300x300/2E7D32/FFFFFF?text=Biotein',
      },
      {
        'id': '2',
        'name': 'GreenVital',
        'name_ar': 'جرين فيتال',
        'description': 'فيتامينات ومعادن طبيعية لتعزيز المناعة والصحة العامة',
        'price': 159.0,
        'category': 'vitamins',
        'image_url':
            'https://via.placeholder.com/300x300/4CAF50/FFFFFF?text=GreenVital',
      },
      {
        'id': '3',
        'name': 'SleepHarmony',
        'name_ar': 'سليب هارموني',
        'description': 'مزيج عشبي طبيعي للنوم العميق والراحة الروحية',
        'price': 179.0,
        'category': 'sleep',
        'image_url':
            'https://via.placeholder.com/300x300/2196F3/FFFFFF?text=SleepHarmony',
      },
      {
        'id': '4',
        'name': 'StressRelief',
        'name_ar': 'ستريس ريلايف',
        'description': 'مستخلصات نباتية لتخفيف التوتر وتحقيق التوازن النفسي',
        'price': 189.0,
        'category': 'stress',
        'image_url':
            'https://via.placeholder.com/300x300/FF9800/FFFFFF?text=StressRelief',
      },
      {
        'id': '5',
        'name': 'DetoxGreen',
        'name_ar': 'ديتوكس جرين',
        'description': 'مشروب تطهير الجسم وإزالة السموم الطبيعية',
        'price': 139.0,
        'category': 'detox',
        'image_url':
            'https://via.placeholder.com/300x300/9C27B0/FFFFFF?text=DetoxGreen',
      },
    ];
  }
}
