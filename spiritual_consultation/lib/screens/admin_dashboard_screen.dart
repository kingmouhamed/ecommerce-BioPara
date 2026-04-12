import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'chat_screen.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  static const Color _primaryGreen = Color(0xFF1B5E20);
  final _supabase = Supabase.instance.client;

  List<Map<String, dynamic>> _consultations = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    try {
      // 1. جلب المحادثات التي أكملت الـ Intake
      final convs = await _supabase
          .from('conversations')
          .select('id, patient_report, sentiment_score, sentiment_mood, sentiment_summary, intake_completed')
          .order('id');

      // 2. جلب الرسائل الأخيرة لتحديث المحتوى
      final msgs = await _supabase
          .from('messages')
          .select('conversation_id, content, created_at')
          .order('created_at', ascending: false);

      final List<Map<String, dynamic>> updatedConsultations = [];

      for (var conv in convs) {
        // البحث عن آخر رسالة لهذا المستخدم
        final lastMsg = msgs.firstWhere(
          (m) => m['conversation_id'] == conv['id'],
          orElse: () => {'content': 'لا توجد رسائل بعد'},
        );

        updatedConsultations.add({
          'user_id': conv['id'],
          'content': lastMsg['content'],
          'sentiment_score': conv['sentiment_score'],
          'sentiment_mood': conv['sentiment_mood'],
          'sentiment_summary': conv['sentiment_summary'],
          'intake_completed': conv['intake_completed'],
        });
      }

      if (mounted) {
        setState(() {
          _consultations = updatedConsultations;
          _isLoading = false;
        });
      }
    } catch (e) {
      debugPrint('Error fetching consultations: $e');
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F7F0),
      appBar: AppBar(
        title: const Text('لوحة تحكم الإدارة', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: _primaryGreen,
        foregroundColor: Colors.white,
        centerTitle: true,
        elevation: 2,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              setState(() => _isLoading = true);
              _fetchData();
            },
          ),
        ],
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator(color: _primaryGreen))
        : Column(
            children: [
              _buildStatsHeader(),
              Expanded(
                child: _consultations.isEmpty
                    ? _buildEmptyState()
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: _consultations.length,
                        itemBuilder: (context, index) {
                          final item = _consultations[index];
                          return _buildConsultationCard(item);
                        },
                      ),
              ),
            ],
          ),
    );
  }

  Widget _buildStatsHeader() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        color: _primaryGreen,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(20),
          bottomRight: Radius.circular(20),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _statItem('المحادثات', '${_consultations.length}', Icons.chat_bubble_outline),
          _statItem('المنبهات', '0', Icons.notifications_none),
          _statItem('المستخدمين', '${_consultations.length}', Icons.people_outline),
        ],
      ),
    );
  }

  Widget _statItem(String title, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, color: Colors.white70, size: 24),
        const SizedBox(height: 8),
        Text(value, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
        Text(title, style: const TextStyle(color: Colors.white70, fontSize: 12)),
      ],
    );
  }

  Widget _buildEmptyState() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.inbox_outlined, size: 64, color: Colors.grey),
          SizedBox(height: 16),
          Text('لا توجد استشارات نشطة حالياً', style: TextStyle(color: Colors.grey, fontSize: 16)),
        ],
      ),
    );
  }

  Widget _buildConsultationCard(Map<String, dynamic> item) {
    final score = item['sentiment_score'] ?? 0;
    Color moodColor = Colors.grey;
    if (score >= 8) {
      moodColor = Colors.red;
    } else if (score >= 6) {
      moodColor = Colors.orange;
    } else if (score >= 4) {
      moodColor = Colors.blue;
    } else if (score > 0) {
      moodColor = Colors.green;
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      elevation: 2,
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: Stack(
          children: [
            const CircleAvatar(
              backgroundColor: Color(0xFFE8F5E9),
              child: Icon(Icons.person, color: _primaryGreen),
            ),
            if (score > 0)
              Positioned(
                right: 0, bottom: 0,
                child: Container(
                  width: 12, height: 12,
                  decoration: BoxDecoration(
                    color: moodColor,
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 2),
                  ),
                ),
              ),
          ],
        ),
        title: Row(
          children: [
            Text(
              'مستفيد: ${item['user_id'].toString().substring(0, 5)}',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            if (item['sentiment_mood'] != null) ...[
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(color: moodColor.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(4)),
                child: Text(
                  item['sentiment_mood'],
                  style: TextStyle(fontSize: 10, color: moodColor, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ],
        ),
        subtitle: Text(
          item['content'] ?? 'لا توجد رسائل',
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(color: Colors.grey),
        ),
        trailing: ElevatedButton(
          onPressed: () {
            Navigator.push(context, MaterialPageRoute(
              builder: (_) => ChatScreen(conversationId: item['user_id'])
            ));
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: _primaryGreen,
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            padding: const EdgeInsets.symmetric(horizontal: 12),
          ),
          child: const Text('دخول'),
        ),
      ),
    );
  }
}
