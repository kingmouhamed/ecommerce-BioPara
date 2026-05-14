enum MessageStatus { sending, sent, delivered, read, error }

enum MessageType { text, image, audio, callInvite, document, product, video }

class MessageModel {
  final String id;
  final String conversationId;
  final String senderId;
  final String content;
  final MessageType type;
  final MessageStatus status;
  final DateTime? createdAt;
  final Map<String, dynamic> metadata;

  MessageModel({
    required this.id,
    required this.conversationId,
    required this.senderId,
    required this.content,
    this.type = MessageType.text,
    this.status = MessageStatus.sending,
    this.createdAt,
    this.metadata = const {},
  });

  factory MessageModel.fromMap(Map<String, dynamic> map) {
    return MessageModel(
      id: map['id']?.toString() ?? '',
      conversationId: map['conversation_id']?.toString() ?? '',
      senderId: map['sender_id']?.toString() ?? '',
      content: map['content']?.toString() ?? '',
      type: _parseType(map['message_type']),
      status: _parseStatus(map['status']),
      createdAt: map['created_at'] != null
          ? DateTime.tryParse(map['created_at'].toString())
          : null,
      metadata: map['metadata'] is Map
          ? Map<String, dynamic>.from(map['metadata'])
          : {},
    );
  }

  factory MessageModel.fromJson(Map<String, dynamic> json) =>
      MessageModel.fromMap(json);

  static MessageType _parseType(dynamic v) {
    final s = v?.toString();
    if (s == 'image') return MessageType.image;
    if (s == 'audio') return MessageType.audio;
    if (s == 'callInvite' || s == 'call_invite') return MessageType.callInvite;
    if (s == 'document') return MessageType.document;
    if (s == 'product') return MessageType.product;
    if (s == 'video') return MessageType.video;
    return MessageType.text;
  }

  static MessageStatus _parseStatus(dynamic v) {
    final str = v?.toString().toLowerCase();
    switch (str) {
      case 'sent': return MessageStatus.sent;
      case 'delivered': return MessageStatus.delivered;
      case 'read': return MessageStatus.read;
      case 'error': return MessageStatus.error;
      default: return MessageStatus.sending;
    }
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'conversation_id': conversationId,
      'sender_id': senderId,
      'content': content,
      'message_type': type.name,
      'status': status.name,
      'created_at': createdAt?.toIso8601String(),
      'metadata': metadata,
    };
  }
}
