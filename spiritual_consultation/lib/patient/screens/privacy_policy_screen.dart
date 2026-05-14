import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('سياسة Ø§Ù„Ø®ØµÙˆصية', style: GoogleFonts.tajawal(fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF0D6E6E),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'سياسة Ø§Ù„Ø®ØµÙˆصية لتطبيق BioPara',
              style: GoogleFonts.tajawal(fontSize: 22, fontWeight: FontWeight.bold, color: const Color(0xFF0D6E6E)),
            ),
            const SizedBox(height: 20),
            Text(
              'Ù†Ø­Ù† في BioPara Ù†Ùˆلي Ø®ØµÙˆØµÙŠØªÙƒ Ø£Ù‡مية قصوى. ØªÙ‡دف Ù‡Ø°Ù‡ السياسة Ø¥Ù„Ù‰ ØªÙˆضيح ÙƒÙŠÙÙŠة Ø¬Ù…Ø¹Ù†ا Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§ØªÙƒ الشخصية ÙˆØ§Ø³ØªØ®Ø¯Ø§Ù…Ù‡ا ÙˆØ­Ù…Ø§ÙŠØªÙ‡ا Ø¹Ù†د Ø§Ø³ØªØ®Ø¯Ø§Ù…Ùƒ Ù„ØªØ·Ø¨ÙŠÙ‚Ù†ا للاستشارات الصحية ÙˆØ§Ù„Ø±Ùˆحية.',
              style: GoogleFonts.tajawal(fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 20),
            _buildSection('1. جمع Ø§Ù„Ù…Ø¹Ù„Ùˆمات', 'Ù†جمع Ø§Ù„Ù…Ø¹Ù„Ùˆمات التي ØªÙ‚Ø¯Ù…Ù‡ا Ù„Ù†ا مباشرة، مثل Ø§Ø³Ù…Ùƒ، ÙˆØ¨Ø±ÙŠØ¯Ùƒ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ي، ÙˆØ§Ù„Ù…Ø¹Ù„Ùˆمات الصحية ÙˆØ§Ù„Ø±Ùˆحية التي ØªØ´Ø§Ø±ÙƒÙ‡ا Ø£Ø«Ù†اء المحادثات Ø£Ùˆ استمارات التقييم (Intake Form). Ù†Ø­Ù† Ù†جمع Ù‡Ø°Ù‡ Ø§Ù„Ø¨ÙŠØ§Ù†ات ÙÙ‚ط Ù„ØªÙ‚ديم استشارات Ø¯Ù‚ÙŠÙ‚ة Ùˆمخصصة لحالتك.'),
            _buildSection('2. استخدام Ø§Ù„Ù…Ø¹Ù„Ùˆمات', 'Ù†ستخدم Ø¨ÙŠØ§Ù†Ø§ØªÙƒ Ù„ØªÙˆÙÙŠر خدمات الاستشارة، تحليل Ø­Ø§Ù„ØªÙƒ عبر Ø§Ù„Ø°Ùƒاء Ø§Ù„Ø§ØµØ·Ù†اعي لمساعدة المعالج، ÙˆØªØ­Ø³ÙŠÙ† Ø¬Ùˆدة الخدمة. المحادثات Ùˆالملفات Ø§Ù„Ù…Ø±ÙÙ‚ة (Ø§Ù„ØµÙˆر، التسجيلات Ø§Ù„ØµÙˆتية) مشفرة Ùˆلا يتم Ù…Ø´Ø§Ø±ÙƒØªÙ‡ا مع أي أطراف خارجية.'),
            _buildSection('3. Ø£Ù…Ø§Ù† Ø§Ù„Ø¨ÙŠØ§Ù†ات', 'تتم حماية جميع Ø¨ÙŠØ§Ù†Ø§ØªÙƒ باستخدام ØªÙ‚Ù†يات ØªØ´ÙÙŠر Ù…ØªÙ‚دمة (عبر Ù‚Ùˆاعد Ø¨ÙŠØ§Ù†ات Supabase) Ù„Ø¶Ù…Ø§Ù† عدم ÙˆØµÙˆل أي أطراف غير مصرح Ù„Ù‡ا Ø¥Ù„Ù‰ Ù…Ø¹Ù„ÙˆÙ…Ø§ØªÙƒ الشخصية Ø£Ùˆ سجلات المحادثة الخاصة بك.'),
            _buildSection('4. Ø§Ù„Ø£Ø°ÙˆÙ†ات Ø§Ù„Ù…Ø·Ù„Ùˆبة', 'يطلب التطبيق الوصول إلى:\n- Ø§Ù„Ùƒاميرا Ùˆمعرض Ø§Ù„ØµÙˆر: Ù„Ù…Ø´Ø§Ø±Ùƒة Ø§Ù„ØµÙˆر مع المعالج.\n- Ø§Ù„Ù…ÙŠÙƒØ±Ùˆفون: لتسجيل الرسائل Ø§Ù„ØµÙˆتية Ùˆإجراء Ø§Ù„Ù…Ùƒالمات.\n- Ø§Ù„Ø¥Ù†ØªØ±Ù†ت: للاتصال Ø¨Ø®Ùˆادم الخدمة.\nÙŠÙ…ÙƒÙ†Ùƒ إلغاء Ù‡Ø°Ù‡ Ø§Ù„Ø£Ø°ÙˆÙ†ات ÙÙŠ أي ÙˆÙ‚ت Ù…Ù† إعدادات Ù‡اتفك.'),
            _buildSection('5. حقوقك', 'Ù„Ø¯ÙŠÙƒ Ø§Ù„Ø­Ù‚ ÙÙŠ طلب Ø§Ù„ÙˆØµÙˆل Ø¥Ù„Ù‰ Ø¨ÙŠØ§Ù†Ø§ØªÙƒ، Ø£Ùˆ ØªØ¹Ø¯ÙŠÙ„Ù‡ا، Ø£Ùˆ Ø­Ø°ÙÙ‡ا ØªÙ…Ø§Ù…Ø§Ù‹ Ù…Ù† Ø£Ù†Ø¸Ù…ØªÙ†ا عبر Ø§Ù„ØªÙˆاصل Ù…Ø¹Ù†ا Ø£Ùˆ خيار مسح الحساب.'),
            const SizedBox(height: 30),
            Text(
              'آخر تحديث: أبريل 2026',
              style: GoogleFonts.tajawal(fontSize: 14, color: Colors.grey, fontStyle: FontStyle.italic),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(String title, String content) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: GoogleFonts.tajawal(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text(content, style: GoogleFonts.tajawal(fontSize: 15, height: 1.6, color: Colors.black87)),
        ],
      ),
    );
  }
}
