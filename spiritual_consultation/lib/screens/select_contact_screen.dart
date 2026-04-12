import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'chat_screen.dart';

class SelectContactScreen extends StatefulWidget {
  const SelectContactScreen({super.key});

  @override
  State<SelectContactScreen> createState() => _SelectContactScreenState();
}

class _SelectContactScreenState extends State<SelectContactScreen> {
  final _supabase = Supabase.instance.client;
  bool _isSearching = false;
  final _searchController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    const Color primaryGreen = Color(0xFF2E7D32);

    return Scaffold(
      appBar: _isSearching ? _buildSearchBar() : _buildDefaultAppBar(primaryGreen),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: _supabase.from('profiles').select('*').order('username'), // نفترض وجود جدول profiles
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
             // إذا لم يوجد جدول profiles، سنحاول جلبهم من مكان آخر أو نعرض رسالة
             return _buildMockContacts(); 
          }

          final users = snapshot.data ?? [];
          return _buildContactsList(users);
        },
      ),
    );
  }

  AppBar _buildDefaultAppBar(Color color) {
    return AppBar(
      backgroundColor: color,
      iconTheme: const IconThemeData(color: Colors.white),
      title: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('اختيار جهة اتصال', style: TextStyle(color: Colors.white, fontSize: 18)),
          Text('128 جهة اتصال', style: TextStyle(color: Colors.white70, fontSize: 12)),
        ],
      ),
      actions: [
        IconButton(icon: const Icon(Icons.search), onPressed: () => setState(() => _isSearching = true)),
        IconButton(icon: const Icon(Icons.more_vert), onPressed: () {}),
      ],
    );
  }

  AppBar _buildSearchBar() {
    return AppBar(
      backgroundColor: Colors.white,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back, color: Colors.grey),
        onPressed: () => setState(() => _isSearching = false),
      ),
      title: TextField(
        controller: _searchController,
        autofocus: true,
        decoration: const InputDecoration(hintText: 'البحث عن جهات الاتصال...', border: InputBorder.none),
        onChanged: (val) => setState(() {}),
      ),
    );
  }

  Widget _buildContactsList(List<Map<String, dynamic>> users) {
    return ListView(
      children: [
        _buildActionTile(Icons.group, 'مجموعة جديدة'),
        _buildActionTile(Icons.person_add, 'جهة اتصال جديدة'),
        _buildActionTile(Icons.groups, 'مجتمع جديد'),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Text('جهات الاتصال على BioPara', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
        ),
        ...users.map((user) => ListTile(
          leading: const CircleAvatar(backgroundColor: Colors.grey, child: Icon(Icons.person, color: Colors.white)),
          title: Text(user['username'] ?? 'مستخدم BioPara', style: const TextStyle(fontWeight: FontWeight.bold)),
          subtitle: const Text('🌿 متاح للاستشارة'),
          onTap: () => _startChat(user['id']),
        )),
      ],
    );
  }

  Widget _buildActionTile(IconData icon, String title) {
    return ListTile(
      leading: CircleAvatar(backgroundColor: const Color(0xFF2E7D32), child: Icon(icon, color: Colors.white, size: 20)),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
      onTap: () {},
    );
  }

  // ── MOCK DATA (In case profiles table fails) ──
  Widget _buildMockContacts() {
     final mockUsers = [
       {'id': 'user1', 'username': 'كمال البربوشي'},
       {'id': 'user2', 'username': 'د. سمية الجزائري'},
       {'id': 'user3', 'username': 'أحمد المحمدي'},
       {'id': 'user4', 'username': 'ياسين علوي'},
     ];
     return _buildContactsList(mockUsers);
  }

  void _startChat(String otherUserId) {
    // نفتح شاشة الدردشة مباشرة باستخدام معرف المستخدم كمعرف للمحادثة
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => ChatScreen(conversationId: otherUserId)),
    );
  }
}
