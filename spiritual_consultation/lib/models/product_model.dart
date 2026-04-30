class Product {
  final String id;
  final String name;
  final String description;
  final double price;
  final String? imageUrl;
  final String category;
  final int stock;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    this.imageUrl,
    required this.category,
    this.stock = 0,
  });

  factory Product.fromMap(Map<String, dynamic> map) {
    return Product(
      id: map['id']?.toString() ?? '',
      name: map['name']?.toString() ?? 'منتج غير معروف',
      description: map['description']?.toString() ?? '',
      price: (map['price'] as num?)?.toDouble() ?? 0.0,
      // نتحقق من كلا الاسمين لضمان التوافق
      imageUrl: (map['image_url'] ?? map['imageUrl'])?.toString(),
      category: map['category']?.toString() ?? 'عام',
      // نستخدم اسم العمود الموجود في قاعدة بياناتك stock_quantity
      stock: (map['stock_quantity'] ?? map['stock']) as int? ?? 0,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'price': price,
      'image_url': imageUrl,
      'category': category,
      'stock_quantity': stock,
    };
  }
}
