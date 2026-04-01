class Message {
  final String? id;
  final String? consultationId;
  final String? userId;
  final String? content;
  final DateTime? createdAt;
  final bool isAgent;
  final String? recommendedProductId;

  Message({
    this.id,
    this.consultationId,
    this.userId,
    this.content,
    this.createdAt,
    this.isAgent = false,
    this.recommendedProductId,
  });

  factory Message.fromMap(Map<String, dynamic> map) {
    return Message(
      id: map['id']?.toString(),
      consultationId: map['consultation_id']?.toString(),
      userId: map['user_id']?.toString(),
      content: map['content']?.toString() ?? '',
      createdAt: map['created_at'] != null
          ? DateTime.tryParse(map['created_at'])
          : null,
      isAgent: map['is_agent'] == true,
      recommendedProductId: map['recommended_product_id']?.toString(),
    );
  }
}
