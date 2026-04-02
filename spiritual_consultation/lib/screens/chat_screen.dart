import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../services/gemini_service.dart';
import '../providers/cart_provider.dart';
import '../providers/auth_provider.dart';
import 'cart_screen.dart';
import 'login_screen.dart';

class ChatScreen extends ConsumerStatefulWidget {
  final String consultationId;

  const ChatScreen({super.key, required this.consultationId});

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen>
    with TickerProviderStateMixin {
  final TextEditingController _msgController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final SupabaseClient _supabase = Supabase.instance.client;
  final GeminiService _geminiService = GeminiService();

  List<Map<String, dynamic>> _products = [];
  List<Map<String, dynamic>> _messages = [];
  bool _isLoadingProducts = true;
  bool _isWaitingForAI = false;

  // ألوان التطبيق
  static const Color _primaryGreen = Color(0xFF1B5E20);
  static const Color _accentGreen = Color(0xFF4CAF50);
  static const Color _lightGreen = Color(0xFFE8F5E9);
  static const Color _aiMsgBg = Color(0xFFF0FFF4);

  @override
  void initState() {
    super.initState();
    _fetchProducts();
  }

  @override
  void dispose() {
    _msgController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  // ──────────────── DATA ────────────────

  Future<void> _fetchProducts() async {
    try {
      final response = await _supabase
          .from('products')
          .select()
          .order('name', ascending: true);
      if (mounted) {
        setState(() {
          _products = List<Map<String, dynamic>>.from(response);
          _isLoadingProducts = false;
        });
      }
    } catch (e) {
      debugPrint('❌ خطأ في جلب المنتجات: $e');
      if (mounted) setState(() => _isLoadingProducts = false);
    }
  }

  Future<void> _onSend() async {
    final text = _msgController.text.trim();
    if (text.isEmpty || _isWaitingForAI) return;
    _msgController.clear();

    final userId = _supabase.auth.currentUser?.id ?? 'anonymous';
    final userMsg = {
      'content': text,
      'user_id': userId,
      'is_user': true,
      'is_agent': false,
      'timestamp': DateTime.now(),
    };

    setState(() {
      _messages.insert(0, userMsg);
      _isWaitingForAI = true;
    });

    // حفظ رسالة المستخدم في Supabase (في الخلفية - لا نوقف إذا فشل)
    _supabase.from('messages').insert({
      'content': text,
      'user_id': userId,
      'is_agent': false,
    }).catchError((e) => debugPrint('⚠️ تحذير - فشل حفظ الرسالة: $e'));

    try {
      // استدعاء Gemini للحصول على الاستشارة
      final response = await _geminiService.getSmartConsultation(
        userMessage: text,
        products: _products,
      );

      if (!mounted) return;

      final aiMsg = {
        'content': response['consultation'] ?? 'لا يوجد رد.',
        'user_id': 'gemini_bot',
        'is_user': false,
        'is_agent': true,
        'recommended_product': response['recommendedProduct'],
        'timestamp': DateTime.now(),
      };

      setState(() {
        _messages.insert(0, aiMsg);
        _isWaitingForAI = false;
      });

      // حفظ رد Gemini في Supabase
      _supabase.from('messages').insert({
        'content': response['consultation'],
        'user_id': 'gemini_bot',
        'is_agent': true,
        'recommended_product_id': response['recommendedProduct']?['id'],
      }).catchError((e) => debugPrint('⚠️ تحذير - فشل حفظ رد Gemini: $e'));
    } catch (e) {
      debugPrint('❌ خطأ في Gemini: $e');
      if (mounted) {
        setState(() {
          _isWaitingForAI = false;
          _messages.insert(0, {
            'content': 'عذراً، حدث خطأ. يرجى المحاولة مجدداً.',
            'user_id': 'system',
            'is_user': false,
            'is_agent': true,
            'timestamp': DateTime.now(),
          });
        });
      }
    }
  }

  void _addToCart(Map<String, dynamic> product) {
    ref.read(cartProvider.notifier).addToCart(
          productId: product['id'].toString(),
          productName: product['name_ar'] ?? product['name'] ?? 'منتج',
          productPrice: (product['price'] as num?)?.toDouble() ?? 0,
          imageUrl: product['image_url'],
        );

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.check_circle, color: Colors.white),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                '✅ تم إضافة ${product['name_ar'] ?? product['name']} للسلة',
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
            ),
          ],
        ),
        backgroundColor: _primaryGreen,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  // ──────────────── BUILD ────────────────

  @override
  Widget build(BuildContext context) {
    final cartCount = ref.watch(cartItemCount);

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7F5),
      appBar: _buildAppBar(cartCount),
      body: Column(
        children: [
          // شريط المنتجات
          _buildProductStrip(),
          // منطقة الشات
          Expanded(child: _buildChatArea()),
          // مربع الكتابة
          _buildInputBar(),
        ],
      ),
    );
  }

  PreferredSizeWidget _buildAppBar(int cartCount) {
    return AppBar(
      backgroundColor: _primaryGreen,
      foregroundColor: Colors.white,
      elevation: 0,
      centerTitle: true,
      title: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 34,
            height: 34,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.eco, color: Colors.white, size: 20),
          ),
          const SizedBox(width: 10),
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'BioPara AI',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
              ),
              Text(
                'استشارة ذكية • متصل',
                style: TextStyle(fontSize: 11, color: Colors.white70),
              ),
            ],
          ),
        ],
      ),
      actions: [
        Stack(
          clipBehavior: Clip.none,
          children: [
            IconButton(
              icon: const Icon(Icons.shopping_cart_outlined, size: 26),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const CartScreen()),
                );
              },
            ),
            if (cartCount > 0)
              Positioned(
                top: 6,
                right: 6,
                child: Container(
                  padding: const EdgeInsets.all(3),
                  decoration: const BoxDecoration(
                    color: Colors.orange,
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    '$cartCount',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
          ],
        ),
        IconButton(
          icon: const Icon(Icons.logout_rounded, size: 22),
          tooltip: 'تسجيل الخروج',
          onPressed: () async {
            await ref.read(authProvider).signOut();
            if (!mounted) return;
            Navigator.of(context).pushAndRemoveUntil(
              MaterialPageRoute(builder: (_) => const LoginScreen()),
              (route) => false,
            );
          },
        ),
      ],
    );
  }

  Widget _buildProductStrip() {
    if (_isLoadingProducts) {
      return Container(
        height: 110,
        color: Colors.white,
        child: const Center(child: CircularProgressIndicator()),
      );
    }
    if (_products.isEmpty) return const SizedBox.shrink();

    return Container(
      height: 110,
      color: Colors.white,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 8, 14, 4),
            child: Row(
              children: [
                const Icon(Icons.local_pharmacy, size: 14, color: _primaryGreen),
                const SizedBox(width: 4),
                const Text(
                  'منتجاتنا الطبيعية',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: _primaryGreen,
                  ),
                ),
                const Spacer(),
                Text(
                  '${_products.length} منتج',
                  style: const TextStyle(fontSize: 11, color: Colors.grey),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 10),
              itemCount: _products.length,
              itemBuilder: (context, index) {
                final p = _products[index];
                final name = p['name_ar'] ?? p['name'] ?? 'منتج';
                final price = p['price']?.toString() ?? '0';
                return GestureDetector(
                  onTap: () => _addToCart(p),
                  child: Container(
                    width: 130,
                    margin: const EdgeInsets.only(right: 8, bottom: 6),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    decoration: BoxDecoration(
                      color: _lightGreen,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: _accentGreen.withValues(alpha: 0.3)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          name,
                          style: const TextStyle(
                            fontWeight: FontWeight.w700,
                            fontSize: 12,
                            color: Colors.black87,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              '$price د.م',
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: _primaryGreen,
                              ),
                            ),
                            const Icon(
                              Icons.add_shopping_cart,
                              size: 14,
                              color: _accentGreen,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChatArea() {
    if (_messages.isEmpty) {
      return _buildEmptyState();
    }
    return ListView.builder(
      controller: _scrollController,
      reverse: true,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      itemCount: _messages.length + (_isWaitingForAI ? 0 : 0),
      itemBuilder: (context, index) {
        final msg = _messages[index];
        final isUser = msg['is_user'] == true;
        return Column(
          crossAxisAlignment:
              isUser ? CrossAxisAlignment.end : CrossAxisAlignment.start,
          children: [
            _buildBubble(msg, isUser),
            if (!isUser && msg['recommended_product'] != null)
              _buildProductCard(msg['recommended_product']),
            const SizedBox(height: 6),
          ],
        );
      },
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 90,
              height: 90,
              decoration: BoxDecoration(
                color: _lightGreen,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.eco, size: 50, color: _primaryGreen),
            ),
            const SizedBox(height: 20),
            const Text(
              'مرحباً بك في استشارة BioPara',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: _primaryGreen,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 10),
            const Text(
              'اسألني عن أي مشكلة صحية أو روحانية\nوسأوصيك بالمنتج الطبيعي المناسب',
              style: TextStyle(fontSize: 14, color: Colors.grey, height: 1.6),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 30),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              alignment: WrapAlignment.center,
              children: [
                _buildSuggestionChip('😴 أعاني من الأرق'),
                _buildSuggestionChip('💪 أريد زيادة الطاقة'),
                _buildSuggestionChip('🌿 منتجات للمناعة'),
                _buildSuggestionChip('💆 التوتر والقلق'),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSuggestionChip(String label) {
    return GestureDetector(
      onTap: () {
        _msgController.text = label.replaceAll(RegExp(r'[^\w\s\u0600-\u06FF]'), '').trim();
        _onSend();
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: _lightGreen,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: _accentGreen.withValues(alpha: 0.4)),
        ),
        child: Text(
          label,
          style: const TextStyle(
            fontSize: 13,
            color: _primaryGreen,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }

  Widget _buildBubble(Map<String, dynamic> msg, bool isUser) {
    return Row(
      mainAxisAlignment:
          isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        if (!isUser) ...[
          Container(
            width: 32,
            height: 32,
            decoration: const BoxDecoration(
              color: _primaryGreen,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.eco, color: Colors.white, size: 18),
          ),
          const SizedBox(width: 8),
        ],
        Flexible(
          child: Container(
            constraints: BoxConstraints(
              maxWidth: MediaQuery.of(context).size.width * 0.78,
            ),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: isUser ? _primaryGreen : _aiMsgBg,
              borderRadius: BorderRadius.only(
                topLeft: const Radius.circular(18),
                topRight: const Radius.circular(18),
                bottomLeft: Radius.circular(isUser ? 18 : 4),
                bottomRight: Radius.circular(isUser ? 4 : 18),
              ),
              border: isUser
                  ? null
                  : Border.all(color: _accentGreen.withValues(alpha: 0.25)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.06),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Text(
              msg['content'] ?? '',
              style: TextStyle(
                color: isUser ? Colors.white : Colors.black87,
                fontSize: 15,
                height: 1.5,
              ),
            ),
          ),
        ),
        if (isUser) const SizedBox(width: 8),
      ],
    );
  }

  Widget _buildProductCard(Map<String, dynamic> product) {
    final name = product['name_ar'] ?? product['name'] ?? 'منتج';
    final price = product['price']?.toString() ?? '0';
    final description = product['description'] as String? ?? '';
    final shortDesc = description.length > 90
        ? '${description.substring(0, 90)}...'
        : description;
    final imageUrl = product['image_url'] as String?;

    return Container(
      margin: const EdgeInsets.only(top: 8, right: 40),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: _accentGreen.withValues(alpha: 0.4), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: _primaryGreen.withValues(alpha: 0.08),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // الرأس الأخضر
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: const BoxDecoration(
              color: _lightGreen,
              borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
            ),
            child: Row(
              children: [
                const Icon(Icons.recommend, color: _primaryGreen, size: 16),
                const SizedBox(width: 6),
                const Text(
                  '💚 منتج موصى به لك',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                    color: _primaryGreen,
                  ),
                ),
              ],
            ),
          ),
          // محتوى الكرت
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // صورة المنتج
                ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: Container(
                    width: 70,
                    height: 70,
                    color: _lightGreen,
                    child: imageUrl != null && imageUrl.isNotEmpty
                        ? Image.network(
                            imageUrl,
                            fit: BoxFit.cover,
                            errorBuilder: (ctx, err, stack) => const Icon(
                              Icons.local_pharmacy,
                              color: _primaryGreen,
                              size: 32,
                            ),
                          )
                        : const Icon(
                            Icons.local_pharmacy,
                            color: _primaryGreen,
                            size: 32,
                          ),
                  ),
                ),
                const SizedBox(width: 12),
                // تفاصيل المنتج
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                          color: Colors.black87,
                        ),
                      ),
                      if (shortDesc.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(
                          shortDesc,
                          style: const TextStyle(
                              fontSize: 12, color: Colors.grey, height: 1.4),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: _lightGreen,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              '$price د.م',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                                color: _primaryGreen,
                              ),
                            ),
                          ),
                          ElevatedButton.icon(
                            onPressed: () => _addToCart(product),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: _primaryGreen,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 12, vertical: 6),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                              minimumSize: Size.zero,
                              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                            ),
                            icon: const Icon(Icons.add_shopping_cart, size: 14),
                            label: const Text(
                              'أضف للسلة',
                              style: TextStyle(
                                  fontSize: 12, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInputBar() {
    return Container(
      padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            offset: const Offset(0, -3),
            blurRadius: 10,
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: const Color(0xFFF2F2F2),
                  borderRadius: BorderRadius.circular(26),
                ),
                child: TextField(
                  controller: _msgController,
                  enabled: !_isWaitingForAI,
                  textDirection: TextDirection.rtl,
                  maxLines: 3,
                  minLines: 1,
                  decoration: const InputDecoration(
                    hintText: 'اكتب سؤالك الصحي أو الروحي...',
                    hintStyle: TextStyle(color: Colors.grey, fontSize: 14),
                    contentPadding:
                        EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                    border: InputBorder.none,
                  ),
                  onSubmitted: (_) => _onSend(),
                ),
              ),
            ),
            const SizedBox(width: 8),
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              child: GestureDetector(
                onTap: _isWaitingForAI ? null : _onSend,
                child: Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: _isWaitingForAI ? Colors.grey.shade400 : _primaryGreen,
                    shape: BoxShape.circle,
                    boxShadow: _isWaitingForAI
                        ? []
                        : [
                            BoxShadow(
                              color: _primaryGreen.withValues(alpha: 0.35),
                              blurRadius: 8,
                              offset: const Offset(0, 3),
                            ),
                          ],
                  ),
                  child: _isWaitingForAI
                      ? const Padding(
                          padding: EdgeInsets.all(12),
                          child: CircularProgressIndicator(
                            strokeWidth: 2.5,
                            valueColor:
                                AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : const Icon(Icons.send_rounded,
                          color: Colors.white, size: 22),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
