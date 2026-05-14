class OrderItemModel {
  final String id;
  final String productName;
  final double price;
  final int quantity;
  final String? imageUrl;

  OrderItemModel({
    required this.id,
    required this.productName,
    required this.price,
    required this.quantity,
    this.imageUrl,
  });

  factory OrderItemModel.fromMap(Map<String, dynamic> map) {
    return OrderItemModel(
      id: map['id']?.toString() ?? '',
      productName: map['product_name']?.toString() ?? '',
      price: (map['price'] as num?)?.toDouble() ?? 0.0,
      quantity: map['quantity'] as int? ?? 1,
      imageUrl: map['image_url']?.toString(),
    );
  }
}
