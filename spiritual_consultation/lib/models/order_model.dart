class OrderModel {
  final String id;
  final String userId;
  final String status;
  final double totalPrice;
  final DateTime createdAt;

  OrderModel({
    required this.id,
    required this.userId,
    required this.status,
    required this.totalPrice,
    required this.createdAt,
  });

  factory OrderModel.fromMap(Map<String, dynamic> map) {
    return OrderModel(
      id: map['id']?.toString() ?? '',
      userId: map['user_id']?.toString() ?? '',
      status: map['status']?.toString() ?? 'pending',
      totalPrice: (map['total_price'] as num?)?.toDouble() ?? 0.0,
      createdAt: map['created_at'] != null 
          ? DateTime.parse(map['created_at'].toString()) 
          : DateTime.now(),
    );
  }

  String get statusArabic {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'processing': return 'جاري التجهيز';
      case 'shipped': return 'تم الشحن';
      case 'delivered': return 'تم التوصيل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  }
}
