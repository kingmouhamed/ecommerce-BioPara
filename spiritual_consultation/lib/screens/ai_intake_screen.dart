import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../services/ai_service.dart';
import 'chat_screen.dart';

/// شاشة المساعد الذكي - تُعرض للمريض قبل أول جلسة
class AiIntakeScreen extends StatefulWidget {
  final String userId;
  const AiIntakeScreen({super.key, required this.userId});

  @override
  State<AiIntakeScreen> createState() => _AiIntakeScreenState();
}

class _AiIntakeScreenState extends State<AiIntakeScreen> with TickerProviderStateMixin {
  final List<Map<String, String>> _messages = [];
  final TextEditingController _inputController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final _supabase = Supabase.instance.client;

  bool _isTyping = false;
  bool _isCompleted = false;
  int _questionCount = 0;

  static const Color _primaryGreen = Color(0xFF1B5E20);
  static const Color _lightGreen = Color(0xFFE8F5E9);

  late AnimationController _dotController;

  @override
  void initState() {
    super.initState();
    _dotController = AnimationController(vsync: this, duration: const Duration(milliseconds: 600))
      ..repeat(reverse: true);
    _startConversation();
  }

  @override
  void dispose() {
    _dotController.dispose();
    _inputController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _startConversation() async {
    await Future.delayed(const Duration(milliseconds: 800));
    _addBotMessage(
      'مرحباً بك في عيادة BioPara الروحانية 🌿\n\nأنا مساعدك الذكي، سأجمع بعض المعلومات عن حالتك قبل أن تتحدث مع المعالج.\n\nما هو السبب الرئيسي الذي جعلك تتواصل معنا اليوم؟'
    );
  }

  void _addBotMessage(String text) {
    setState(() {
      _messages.add({'role': 'bot', 'text': text});
    });
    _scrollToBottom();
  }

  void _addUserMessage(String text) {
    setState(() {
      _messages.add({'role': 'user', 'text': text});
    });
    _scrollToBottom();
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _sendMessage() async {
    final text = _inputController.text.trim();
    if (text.isEmpty || _isTyping) return;

    _inputController.clear();
    _addUserMessage(text);
    _questionCount++;

    setState(() => _isTyping = true);

    // الحصول على رد المساعد
    final botReply = await AiService.instance.askChatbot(text, _messages);

    setState(() => _isTyping = false);
    _addBotMessage(botReply);

    // إذا أكملنا 5 أسئلة أو قال المساعد "شكراً"
    if (_questionCount >= 5 || botReply.contains('شكراً') || botReply.contains('سأحيل')) {
      await _finalizeIntake();
    }
  }

  Future<void> _finalizeIntake() async {
    setState(() => _isCompleted = true);

    // توليد ملف المريض
    final report = await AiService.instance.generatePatientReport(_messages);

    // تحليل المشاعر
    final userTexts = _messages
        .where((m) => m['role'] == 'user')
        .map((m) => m['text'] ?? '')
        .join(' ');
    final sentiment = await AiService.instance.analyzeSentiment(userTexts);

    try {
      // حفظ البيانات في Supabase
      await _supabase.from('conversations').upsert({
        'id': widget.userId,
        'patient_id': widget.userId,
        'patient_report': report,
        'sentiment_score': sentiment.score,
        'sentiment_mood': sentiment.mood,
        'sentiment_summary': sentiment.summary,
        'sentiment_advice': sentiment.advice,
        'intake_completed': true,
      });
    } catch (e) {
      debugPrint('Error saving intake: $e');
    }

    // الانتقال للشات
    if (mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => ChatScreen(conversationId: widget.userId)),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F7F0),
      appBar: AppBar(
        backgroundColor: _primaryGreen,
        foregroundColor: Colors.white,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.psychology_alt, size: 20),
            ),
            const SizedBox(width: 10),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('المساعد الذكي', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                Text('BioPara AI Assistant', style: TextStyle(fontSize: 11, color: Colors.white70)),
              ],
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (_) => ChatScreen(conversationId: widget.userId)),
            ),
            child: const Text('تخطى', style: TextStyle(color: Colors.white70)),
          ),
        ],
      ),
      body: Column(
        children: [
          // شريط التقدم
          _buildProgressBar(),
          // المحادثة
          Expanded(child: _buildChatList()),
          // مؤشر الكتابة
          if (_isTyping) _buildTypingIndicator(),
          // حقل الإدخال
          if (!_isCompleted) _buildInputArea(),
        ],
      ),
    );
  }

  Widget _buildProgressBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      color: Colors.white,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('جمع المعلومات الأولية', style: TextStyle(fontSize: 12, color: Colors.grey)),
              Text('${(_questionCount / 5 * 100).clamp(0, 100).toInt()}%',
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF1B5E20))),
            ],
          ),
          const SizedBox(height: 6),
          LinearProgressIndicator(
            value: (_questionCount / 5).clamp(0.0, 1.0),
            backgroundColor: const Color(0xFFE8F5E9),
            valueColor: const AlwaysStoppedAnimation<Color>(_primaryGreen),
            borderRadius: BorderRadius.circular(4),
          ),
        ],
      ),
    );
  }

  Widget _buildChatList() {
    return ListView.builder(
      controller: _scrollController,
      padding: const EdgeInsets.all(16),
      itemCount: _messages.length,
      itemBuilder: (context, index) {
        final msg = _messages[index];
        final isBot = msg['role'] == 'bot';
        return _buildMessageBubble(msg['text'] ?? '', isBot);
      },
    );
  }

  Widget _buildMessageBubble(String text, bool isBot) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: isBot ? MainAxisAlignment.start : MainAxisAlignment.end,
        children: [
          if (isBot) ...[
            CircleAvatar(
              radius: 18,
              backgroundColor: _primaryGreen,
              child: const Text('🤖', style: TextStyle(fontSize: 14)),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: isBot ? Colors.white : _primaryGreen,
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(18),
                  topRight: const Radius.circular(18),
                  bottomLeft: Radius.circular(isBot ? 4 : 18),
                  bottomRight: Radius.circular(isBot ? 18 : 4),
                ),
                boxShadow: [
                  BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 6, offset: const Offset(0, 2))
                ],
              ),
              child: Text(
                text,
                style: TextStyle(
                  color: isBot ? Colors.black87 : Colors.white,
                  fontSize: 14.5,
                  height: 1.5,
                ),
              ),
            ),
          ),
          if (!isBot) const SizedBox(width: 8),
        ],
      ),
    );
  }

  Widget _buildTypingIndicator() {
    return Padding(
      padding: const EdgeInsets.only(left: 16, bottom: 8),
      child: Row(
        children: [
          CircleAvatar(
            radius: 18,
            backgroundColor: _primaryGreen,
            child: const Text('🤖', style: TextStyle(fontSize: 14)),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 6)],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: List.generate(3, (i) => AnimatedBuilder(
                animation: _dotController,
                builder: (_, _) => Container(
                  margin: const EdgeInsets.symmetric(horizontal: 3),
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: _primaryGreen.withValues(alpha: 
                      i == 0 ? _dotController.value : i == 1 ? 0.6 : 1 - _dotController.value
                    ),
                    shape: BoxShape.circle,
                  ),
                ),
              )),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 8, offset: const Offset(0, -2))],
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _inputController,
              textDirection: TextDirection.rtl,
              maxLines: null,
              decoration: InputDecoration(
                hintText: 'اكتب ردك هنا...',
                hintTextDirection: TextDirection.rtl,
                filled: true,
                fillColor: _lightGreen,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
              ),
              onSubmitted: (_) => _sendMessage(),
            ),
          ),
          const SizedBox(width: 8),
          GestureDetector(
            onTap: _sendMessage,
            child: Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: _primaryGreen,
                shape: BoxShape.circle,
                boxShadow: [BoxShadow(color: _primaryGreen.withValues(alpha: 0.4), blurRadius: 8)],
              ),
              child: const Icon(Icons.send_rounded, color: Colors.white, size: 22),
            ),
          ),
        ],
      ),
    );
  }
}
