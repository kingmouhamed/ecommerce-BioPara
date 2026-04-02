class CartItem {
  final String productId;
  final String productName;
  final double productPrice;
  final String? imageUrl;
  final int quantity;

  CartItem({
    required this.productId,
    required this.productName,
    required this.productPrice,
    this.imageUrl,
    this.quantity = 1,
  });

  /// الحساب الكلي للنص: (السعر × الكمية)
  double get total => productPrice * quantity;

  /// تحويل الموديل إلى خريطة
  Map<String, dynamic> toJson() {
    return {
      'product_id': productId,
      'product_name': productName,
      'product_price': productPrice,
      'image_url': imageUrl,
      'quantity': quantity,
    };
  }

  /// إنشاء موديل من خريطة
  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      productId: json['product_id'] as String,
      productName: json['product_name'] as String,
      productPrice: (json['product_price'] as num).toDouble(),
      imageUrl: json['image_url'] as String?,
      quantity: json['quantity'] as int? ?? 1,
    );
  }

  CartItem copyWith({
    String? productId,
    String? productName,
    double? productPrice,
    String? imageUrl,
    int? quantity,
  }) {
    return CartItem(
      productId: productId ?? this.productId,
      productName: productName ?? this.productName,
      productPrice: productPrice ?? this.productPrice,
      imageUrl: imageUrl ?? this.imageUrl,
      quantity: quantity ?? this.quantity,
    );
  }
}
