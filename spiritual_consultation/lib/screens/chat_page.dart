import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class ChatPage extends StatefulWidget {
  final String currentUserId; // معرف المستخدم الحالي لتمييز رسائله

  const ChatPage({super.key, required this.currentUserId});

  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  final TextEditingController _messageController = TextEditingController();
  final SupabaseClient _supabase = Supabase.instance.client;

  Future<void> _sendMessage() async {
    final text = _messageController.text.trim();
    if (text.isEmpty) return;

    _messageController.clear();

    try {
      // إرسال الرسالة إلى جدول messages
      await _supabase.from('messages').insert({
        'content': text,
        'user_id': widget.currentUserId,
        // يمكنك إضافة حقول أخرى مثل receiver_id أو room_id حسب تصميم قاعدة البيانات
        // 'created_at' عادة ما تتم إضافتها تلقائيا من طرف Supabase
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('حدث خطأ أثناء إرسال الرسالة: $e')),
        );
      }
    }
  }

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('استشارة روحانية'),
        backgroundColor: Colors.green[800], // لون يتناسب مع تطبيق الأعشاب
      ),
      body: Column(
        children: [
          Expanded(
            child: StreamBuilder<List<Map<String, dynamic>>>(
              // الاستماع للتغييرات في جدول messages بشكل حي (Realtime)
              stream: _supabase
                  .from('messages')
                  .stream(primaryKey: ['id'])
                  .order(
                    'created_at',
                    ascending: false,
                  ) // الأحدث أولاً لتتناسب مع ListView المعكوسة
                  .map((data) => data),
              builder: (context, snapshot) {
                if (snapshot.hasError) {
                  return const Center(child: Text('حدث خطأ في جلب الرسائل'));
                }

                if (!snapshot.hasData) {
                  return const Center(child: CircularProgressIndicator());
                }

                final messages = snapshot.data!;

                if (messages.isEmpty) {
                  return const Center(
                    child: Text('لا توجد رسائل بعد. ابدأ المحادثة!'),
                  );
                }

                return ListView.builder(
                  reverse: true, // يبدأ من الأسفل للأعلى (مفيد للمحادثات)
                  itemCount: messages.length,
                  itemBuilder: (context, index) {
                    final message = messages[index];
                    final isMe = message['user_id'] == widget.currentUserId;
                    final content = message['content'] ?? '';

                    return Align(
                      alignment: isMe
                          ? Alignment.centerLeft
                          : Alignment.centerRight,
                      child: Container(
                        margin: const EdgeInsets.symmetric(
                          vertical: 4,
                          horizontal: 12,
                        ),
                        padding: const EdgeInsets.symmetric(
                          vertical: 10,
                          horizontal: 16,
                        ),
                        decoration: BoxDecoration(
                          color: isMe ? Colors.green[100] : Colors.grey[200],
                          borderRadius: BorderRadius.only(
                            topLeft: const Radius.circular(16),
                            topRight: const Radius.circular(16),
                            bottomLeft: isMe
                                ? const Radius.circular(0)
                                : const Radius.circular(16),
                            bottomRight: isMe
                                ? const Radius.circular(16)
                                : const Radius.circular(0),
                          ),
                        ),
                        child: Text(
                          content,
                          style: const TextStyle(fontSize: 16),
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),
          _buildMessageInput(),
        ],
      ),
    );
  }

  Widget _buildMessageInput() {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Row(
          children: [
            Expanded(
              child: TextField(
                controller: _messageController,
                decoration: InputDecoration(
                  hintText: 'اكتب رسالتك هنا...',
                  filled: true,
                  fillColor: Colors.grey[100],
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(24),
                    borderSide: BorderSide.none,
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 12,
                  ),
                ),
                textInputAction: TextInputAction.send,
                onSubmitted: (_) => _sendMessage(),
              ),
            ),
            const SizedBox(width: 8),
            InkWell(
              onTap: _sendMessage,
              child: CircleAvatar(
                radius: 24,
                backgroundColor: Colors.green[800],
                child: const Icon(Icons.send, color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
