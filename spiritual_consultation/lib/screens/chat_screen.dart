import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class ChatScreen extends ConsumerStatefulWidget {
  final String consultationId;

  const ChatScreen({super.key, required this.consultationId});

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final TextEditingController _msgController = TextEditingController();
  final SupabaseClient _supabase = Supabase.instance.client;

  List<Map<String, dynamic>> _products = [];
  bool _isLoadingProducts = true;

  @override
  void initState() {
    super.initState();
    fetchProducts();
  }

  // 1. Fetching all products from the products table
  Future<void> fetchProducts() async {
    try {
      final response = await _supabase.from('products').select();
      if (mounted) {
        setState(() {
          _products = List<Map<String, dynamic>>.from(response);
          _isLoadingProducts = false;
        });
      }
    } catch (e) {
      debugPrint('Error fetching products: $e');
      if (mounted) {
        setState(() {
          _isLoadingProducts = false;
        });
      }
    }
  }

  // 2. Insert new message to Supabase
  Future<void> _onSend() async {
    final text = _msgController.text.trim();
    if (text.isEmpty) return;

    _msgController.clear();

    // Use current user id or a guest ID if no auth is set
    final userId = _supabase.auth.currentUser?.id ?? 'guest_user';

    try {
      await _supabase.from('messages').insert({
        'content': text,
        'user_id': userId,
      });
    } catch (e) {
      debugPrint('Error sending message: $e');
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('خطأ في الإرسال: $e')));
      }
    }
  }

  @override
  void dispose() {
    _msgController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        title: const Text(
          'استشارة BioPara',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: const Color(0xFF2E7D32),
        foregroundColor: Colors.white,
        centerTitle: true,
      ),
      body: Column(
        children: [
          // 3. Product Catalog List
          if (_isLoadingProducts)
            const Padding(
              padding: EdgeInsets.all(16.0),
              child: CircularProgressIndicator(),
            )
          else if (_products.isNotEmpty)
            _buildProductsCatalog(),

          // 4. Real-time StreamBuilder for messages
          Expanded(
            child: StreamBuilder<List<Map<String, dynamic>>>(
              stream: _supabase
                  .from('messages')
                  .stream(primaryKey: ['id'])
                  .order('created_at', ascending: false)
                  .limit(100),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (snapshot.hasError) {
                  // Fallback string if there's an error (like table missing)
                  return Center(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text(
                        'لا يمكن تحميل الرسائل. (هل أنشأت جدول messages؟)\n\nالخطأ: ${snapshot.error}',
                        textAlign: TextAlign.center,
                      ),
                    ),
                  );
                }

                // Handling "Null is not a subtype of Iterable"
                final messages = snapshot.data ?? [];

                if (messages.isEmpty) {
                  return const Center(
                    child: Text('لا توجد رسائل حالياً، ابدأ المحادثة!'),
                  );
                }

                return ListView.builder(
                  reverse: true, // Newest messages at the bottom
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  itemCount: messages.length,
                  itemBuilder: (context, index) {
                    final msg = messages[index];
                    final isMyMessage =
                        msg['user_id'] ==
                        (_supabase.auth.currentUser?.id ?? 'guest_user');

                    return Align(
                      alignment: isMyMessage
                          ? Alignment.centerRight
                          : Alignment.centerLeft,
                      child: Container(
                        constraints: BoxConstraints(
                          maxWidth: MediaQuery.of(context).size.width * 0.75,
                        ),
                        margin: const EdgeInsets.symmetric(vertical: 6),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: isMyMessage
                              ? const Color(0xFF2E7D32)
                              : Colors.white,
                          borderRadius: BorderRadius.only(
                            topLeft: const Radius.circular(16),
                            topRight: const Radius.circular(16),
                            bottomLeft: isMyMessage
                                ? const Radius.circular(16)
                                : const Radius.circular(0),
                            bottomRight: isMyMessage
                                ? const Radius.circular(0)
                                : const Radius.circular(16),
                          ),
                          border: isMyMessage
                              ? null
                              : Border.all(color: Colors.grey.shade300),
                        ),
                        child: Text(
                          msg['content'] ?? '',
                          style: TextStyle(
                            color: isMyMessage ? Colors.white : Colors.black87,
                            fontSize: 16,
                          ),
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),

          // Message Composer
          _buildMessageInput(),
        ],
      ),
    );
  }

  // Horizontal Product Scroll Widget
  Widget _buildProductsCatalog() {
    return Container(
      height: 120,
      padding: const EdgeInsets.symmetric(vertical: 10),
      color: Colors.white,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _products.length,
        itemBuilder: (context, index) {
          final p = _products[index];
          // Determine name_ar or fallback to name
          final displayName = p['name_ar'] ?? p['name'] ?? 'منتج';
          final price = p['price']?.toString() ?? '0.00';

          return Container(
            width: 140,
            margin: const EdgeInsets.symmetric(horizontal: 8),
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFFF1F8E9), // Light green tint
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: const Color(0xFF2E7D32).withValues(alpha: 0.3),
              ),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  displayName,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                    color: Colors.black87,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFF2E7D32),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    '$price د.م',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildMessageInput() {
    return SafeArea(
      child: Container(
        padding: const EdgeInsets.all(12.0),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              offset: const Offset(0, -2),
              blurRadius: 6,
            ),
          ],
        ),
        child: Row(
          children: [
            Expanded(
              child: TextField(
                controller: _msgController,
                decoration: InputDecoration(
                  hintText: 'اكتب رسالتك...',
                  filled: true,
                  fillColor: Colors.grey.shade100,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 14,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(30),
                    borderSide: BorderSide.none,
                  ),
                ),
                onSubmitted: (_) => _onSend(),
              ),
            ),
            const SizedBox(width: 8),
            InkWell(
              onTap: _onSend,
              child: const CircleAvatar(
                radius: 25,
                backgroundColor: Color(0xFF2E7D32),
                child: Icon(Icons.send, color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
