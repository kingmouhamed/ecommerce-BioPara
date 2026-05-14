import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const Color primaryGreen = Color(0xFF2E7D32);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: primaryGreen,
        title: const Text('الإعدادات', style: TextStyle(color: Colors.white)),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: ListView(
        children: [
          // ── USER PROFILE HEADER ──
          _buildProfileHeader(),
          const Divider(),

          // ── SETTINGS LIST ──
          _buildSettingsTile(Icons.key, 'الحساب', 'Ø§Ù„Ø®ØµÙˆصية، Ø§Ù„Ø£Ù…Ø§Ù†، تغيير الرقم'),
          _buildSettingsTile(Icons.chat, 'الدردشات', 'Ø§Ù„Ù…Ø¸Ù‡ر، Ø®Ù„ÙÙŠات الشاشة، سجل الدردشات'),
          _buildSettingsTile(Icons.notifications, 'الإشعارات', 'Ù†غمات الرسائل، Ø§Ù„Ù…Ø¬Ù…Ùˆعات ÙˆØ§Ù„Ù…Ùƒالمات'),
          _buildSettingsTile(Icons.storage, 'Ø§Ù„ØªØ®Ø²ÙŠÙ† ÙˆØ§Ù„Ø¨ÙŠØ§Ù†ات', 'استخدام الشبكة، التنزيل التلقائي'),
          _buildSettingsTile(Icons.help_outline, 'المساعدة', 'Ù…Ø±Ùƒز المساعدة، اتصل Ø¨Ù†ا، سياسة Ø§Ù„Ø®ØµÙˆصية'),
          _buildSettingsTile(Icons.people, 'Ø¯Ø¹Ùˆة صديق', ''),

          const Padding(
            padding: EdgeInsets.symmetric(vertical: 20),
            child: Center(
              child: Text(
                'from\nBioPara Team 🌿',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileHeader() {
    final user = Supabase.instance.client.auth.currentUser;
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Row(
        children: [
          const CircleAvatar(
            radius: 35,
            backgroundColor: Colors.grey,
            child: Icon(Icons.person, color: Colors.white, size: 45),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  user?.email?.split('@').first ?? 'مستخدم BioPara',
                  style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                const Text('🌿 متاح Ø§Ù„Ø¢Ù† للاستشارة Ø§Ù„Ø±Ùˆحية', style: TextStyle(color: Colors.grey)),
              ],
            ),
          ),
          const Icon(Icons.qr_code, color: Color(0xFF2E7D32)),
        ],
      ),
    );
  }

  Widget _buildSettingsTile(IconData icon, String title, String subtitle) {
    return ListTile(
      leading: Icon(icon, color: Colors.grey[600]),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
      subtitle: subtitle.isNotEmpty ? Text(subtitle, style: const TextStyle(fontSize: 13)) : null,
      onTap: () {},
    );
  }
}
