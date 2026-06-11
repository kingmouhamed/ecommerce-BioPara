// lib/core/models/message_model.dart
// ═══════════════════════════════════════════════════════════
//  BioPara — نموذج الرسالة الكامل
// ═══════════════════════════════════════════════════════════

enum MessageStatus { sending, sent, delivered, read, error }

enum MessageType {
  text,
  image,
  audio,
  callInvite,
  callSystem, // أحداث المكالمة الداخلية — لا تُعرض في المحادثة
  document,
  product,
  video,
  system,
}

class MessageModel {
  final String id;
  final String conversationId;
  final String senderId;
  final String content;
  final MessageType type;
  final MessageStatus status;
  final DateTime? createdAt;
  final Map<String, dynamic> metadata;
  final bool isRead;
  final bool isAi;
  final bool isDeleted;
  final bool isStarred;
  final String? replyToId;
  final Map<String, List<String>> reactions; // emoji -> [userId]

  MessageModel({
    required this.id,
    required this.conversationId,
    required this.senderId,
    required this.content,
    this.type = MessageType.text,
    this.status = MessageStatus.sending,
    this.createdAt,
    this.metadata = const {},
    this.isRead = false,
    this.isAi = false,
    this.isDeleted = false,
    this.isStarred = false,
    this.replyToId,
    this.reactions = const {},
  });

  factory MessageModel.fromMap(Map<String, dynamic> map) {
    // Parse reactions safely
    Map<String, List<String>> parsedReactions = {};
    try {
      final rawReactions = map['reactions'];
      if (rawReactions is Map) {
        parsedReactions = rawReactions.map((k, v) =>
          MapEntry(k.toString(), (v as List).map((e) => e.toString()).toList()));
      }
    } catch (_) {}

    return MessageModel(
      id: map['id']?.toString() ?? '',
      conversationId: map['conversation_id']?.toString() ?? '',
      senderId: map['sender_id']?.toString() ?? '',
      content: map['content']?.toString() ?? '',
      type: _parseType(map['message_type']),
      status: _parseStatus(map['status']),
      createdAt: map['created_at'] != null
          ? DateTime.tryParse(map['created_at'].toString())?.toLocal()
          : null,
      metadata: map['metadata'] is Map
          ? Map<String, dynamic>.from(map['metadata'])
          : {},
      isRead: map['is_read'] as bool? ?? false,
      isAi: map['is_ai'] as bool? ?? false,
      isDeleted: map['is_deleted'] as bool? ?? false,
      isStarred: map['is_starred'] as bool? ?? false,
      replyToId: map['reply_to_id']?.toString(),
      reactions: parsedReactions,
    );
  }

  factory MessageModel.fromJson(Map<String, dynamic> json) =>
      MessageModel.fromMap(json);

  static MessageType _parseType(dynamic v) {
    final s = v?.toString();
    switch (s) {
      case 'image': return MessageType.image;
      case 'audio': return MessageType.audio;
      case 'callInvite':
      case 'call_invite': return MessageType.callInvite;
      // أحداث المكالمة الداخلية — تُخفى من عرض المحادثة
      case 'call_cancel':
      case 'call_decline':
      case 'call_accept':
      case 'call_end': return MessageType.callSystem;
      case 'document': return MessageType.document;
      case 'product': return MessageType.product;
      case 'video': return MessageType.video;
      case 'system': return MessageType.system;
      default: return MessageType.text;
    }
  }

  static MessageStatus _parseStatus(dynamic v) {
    switch (v?.toString().toLowerCase()) {
      case 'sent': return MessageStatus.sent;
      case 'delivered': return MessageStatus.delivered;
      case 'read': return MessageStatus.read;
      case 'error': return MessageStatus.error;
      default: return MessageStatus.sending;
    }
  }

  Map<String, dynamic> toMap() => {
    'id': id,
    'conversation_id': conversationId,
    'sender_id': senderId,
    'content': content,
    'message_type': type.name,
    'status': status.name,
    'created_at': createdAt?.toIso8601String(),
    'metadata': metadata,
    'is_read': isRead,
    'is_ai': isAi,
    'is_deleted': isDeleted,
    'is_starred': isStarred,
    'reply_to_id': replyToId,
    'reactions': reactions,
  };

  MessageModel copyWith({
    String? id,
    String? conversationId,
    String? senderId,
    String? content,
    MessageType? type,
    MessageStatus? status,
    DateTime? createdAt,
    Map<String, dynamic>? metadata,
    bool? isRead,
    bool? isAi,
    bool? isDeleted,
    bool? isStarred,
    String? replyToId,
    Map<String, List<String>>? reactions,
  }) {
    return MessageModel(
      id: id ?? this.id,
      conversationId: conversationId ?? this.conversationId,
      senderId: senderId ?? this.senderId,
      content: content ?? this.content,
      type: type ?? this.type,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      metadata: metadata ?? this.metadata,
      isRead: isRead ?? this.isRead,
      isAi: isAi ?? this.isAi,
      isDeleted: isDeleted ?? this.isDeleted,
      isStarred: isStarred ?? this.isStarred,
      replyToId: replyToId ?? this.replyToId,
      reactions: reactions ?? this.reactions,
    );
  }
}
