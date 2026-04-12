import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../screens/chat_screen.dart';

class ConversationsTabContent extends StatefulWidget {
  final String searchQuery;
  const ConversationsTabContent({super.key, this.searchQuery = ''});

  @override
  State<ConversationsTabContent> createState() => _ConversationsTabContentState();
}

class _ConversationsTabContentState extends State<ConversationsTabContent> {
  final _supabase = Supabase.instance.client;

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<List<Map<String, dynamic>>>(
      // سنقوم بجلب أحدث الرسائل من كل محادثة
      stream: _supabase
          .from('messages')
          .stream(primaryKey: ['id'])
          .order('created_at', ascending: false)
          .map((maps) {
            // منطق تجميع الرسائل حسب المحادثة (Grouping by conversation)
            final Map<String, Map<String, dynamic>> rooms = {};
            for (var m in maps) {
              final roomId = m['conversation_id'];
              if (!rooms.containsKey(roomId)) {
                rooms[roomId] = m;
              }
            }
            return rooms.values.toList();
          }),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }

        var conversations = snapshot.data ?? [];
        
        // ── SEARCH LOGIC ──
        if (widget.searchQuery.isNotEmpty) {
          conversations = conversations.where((c) => 
            (c['content'] as String).toLowerCase().contains(widget.searchQuery.toLowerCase())
          ).toList();
        }

        if (conversations.isEmpty) {
          return _buildEmptyState();
        }

        return ListView.separated(
          itemCount: conversations.length,
          separatorBuilder: (ctx, i) => const Padding(
            padding: EdgeInsets.only(left: 85),
            child: Divider(height: 1, thickness: 0.5),
          ),
          itemBuilder: (ctx, i) {
            final lastMsg = conversations[i];
            final roomId  = lastMsg['conversation_id'];
            
            return ListTile(
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              leading: _buildProfileAvatar(roomId),
              title: Text(
                'مريض BioPara ${roomId.toString().substring(0, 4)}', 
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              subtitle: Text(
                lastMsg['content'] ?? '',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(color: Colors.grey[600], fontSize: 14),
              ),
              trailing: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                   Text(
                    '12:45 م', // سنقوم بربطها بالوقت الفعلي لاحقاً
                    style: TextStyle(color: Colors.green[700], fontSize: 12),
                  ),
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: const BoxDecoration(color: Color(0xFF2E7D32), shape: BoxShape.circle),
                    child: const Text('2', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => ChatScreen(conversationId: roomId)),
                );
              },
            );
          },
        );
      },
    );
  }

  Widget _buildProfileAvatar(String id) {
    return Hero(
      tag: 'avatar_$id',
      child: CircleAvatar(
        radius: 28,
        backgroundColor: Colors.grey[200],
        child: const Icon(Icons.person, color: Colors.grey, size: 35),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.chat_bubble_outline, size: 80, color: Colors.grey[300]),
          const SizedBox(height: 16),
          const Text('لا توجد محادثات نشطة حالياً', style: TextStyle(color: Colors.grey)),
        ],
      ),
    );
  }
}
