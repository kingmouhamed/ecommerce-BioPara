import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../screens/call_screen.dart';

class CallsTabContent extends StatelessWidget {
  const CallsTabContent({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.symmetric(vertical: 8),
      children: [
        // ── SECTION: CREATE CALL LINK ──
        ListTile(
          leading: const CircleAvatar(
            radius: 24,
            backgroundColor: Color(0xFF2E7D32),
            child: Icon(Icons.link, color: Colors.white, size: 28),
          ),
          title: const Text('إنشاء رابط مكالمة', style: TextStyle(fontWeight: FontWeight.bold)),
          subtitle: const Text('شارك رابطاً لمكالمة BioPara الخاصة بك'),
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('ميزة روابط المكالمات قريباً!')),
            );
          },
        ),

        // ── SECTION: RECENT CALLS ──
        const Padding(
          padding: EdgeInsets.fromLTRB(16, 16, 16, 8),
          child: Text(
            'الأحدث',
            style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold, fontSize: 13),
          ),
        ),

        // ── MOCK CALL LIST ──
        _buildCallItem(
          context,
          'كمال البربوشي',
          'أمس، 11:45 مساءً',
          'https://i.pravatar.cc/150?u=1',
          isMissed: false,
          isIncoming: true,
          isVideo: false,
        ),
        _buildCallItem(
          context,
          'د. سمية (Missed)',
          'أمس، 09:20 مساءً',
          'https://i.pravatar.cc/150?u=2',
          isMissed: true,
          isIncoming: true,
          isVideo: true,
        ),
        _buildCallItem(
          context,
          'أحمد المحمدي',
          '10 أبريل، 06:15 مساءً',
          'https://i.pravatar.cc/150?u=3',
          isMissed: false,
          isIncoming: false,
          isVideo: false,
        ),
      ],
    );
  }

  Widget _buildCallItem(
    BuildContext context,
    String name,
    String time,
    String imageUrl, {
    required bool isMissed,
    required bool isIncoming,
    required bool isVideo,
  }) {
    return ListTile(
      leading: CircleAvatar(
        radius: 24,
        backgroundImage: NetworkImage(imageUrl),
      ),
      title: Text(
        name,
        style: TextStyle(
          fontWeight: FontWeight.bold,
          color: isMissed ? Colors.red : Colors.black,
        ),
      ),
      subtitle: Row(
        children: [
          Icon(
            isIncoming ? Icons.call_received : Icons.call_made,
            size: 16,
            color: isMissed ? Colors.red : Colors.green,
          ),
          const SizedBox(width: 4),
          Text(time),
        ],
      ),
      trailing: IconButton(
        icon: Icon(isVideo ? Icons.videocam : Icons.call, color: const Color(0xFF2E7D32)),
        onPressed: () => _startCall(context, isVideo),
      ),
    );
  }

  void _startCall(BuildContext context, bool isVideo) {
    final userId = Supabase.instance.client.auth.currentUser?.id;
    if (userId == null) return;

    // استخدام CallScreen الموجود مسبقاً والمدمج مع ZEGOCLOUD
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => CallScreen(
          callID: 'recent_call_id', // في الواقع نأتي بالمعرف من السجل
          userID: userId,
          userName: 'المستخدم',
          isVideoCall: isVideo,
        ),
      ),
    );
  }
}
