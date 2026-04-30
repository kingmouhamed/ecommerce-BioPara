import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('سياسة الخصوصية', style: GoogleFonts.tajawal(fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF0D6E6E),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'سياسة الخصوصية لتطبيق BioPara',
              style: GoogleFonts.tajawal(fontSize: 22, fontWeight: FontWeight.bold, color: const Color(0xFF0D6E6E)),
            ),
            const SizedBox(height: 20),
            Text(
              'نحن في BioPara نولي خصوصيتك أهمية قصوى. تهدف هذه السياسة إلى توضيح كيفية جمعنا لمعلوماتك الشخصية واستخدامها وحمايتها عند استخدامك لتطبيقنا للاستشارات الصحية والروحية.',
              style: GoogleFonts.tajawal(fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 20),
            _buildSection('1. جمع المعلومات', 'نجمع المعلومات التي تقدمها لنا مباشرة، مثل اسمك، وبريدك الإلكتروني، والمعلومات الصحية والروحية التي تشاركها أثناء المحادثات أو استمارات التقييم (Intake Form). نحن نجمع هذه البيانات فقط لتقديم استشارات دقيقة ومخصصة لحالتك.'),
            _buildSection('2. استخدام المعلومات', 'نستخدم بياناتك لتوفير خدمات الاستشارة، تحليل حالتك عبر الذكاء الاصطناعي لمساعدة المعالج، وتحسين جودة الخدمة. المحادثات والملفات المرفقة (الصور، التسجيلات الصوتية) مشفرة ولا يتم مشاركتها مع أي أطراف خارجية.'),
            _buildSection('3. أمان البيانات', 'تتم حماية جميع بياناتك باستخدام تقنيات تشفير متقدمة (عبر قواعد بيانات Supabase) لضمان عدم وصول أي أطراف غير مصرح لها إلى معلوماتك الشخصية أو سجلات المحادثة الخاصة بك.'),
            _buildSection('4. الأذونات المطلوبة', 'يطلب التطبيق الوصول إلى:\n- الكاميرا ومعرض الصور: لمشاركة الصور مع المعالج.\n- الميكروفون: لتسجيل الرسائل الصوتية وإجراء المكالمات.\n- الإنترنت: للاتصال بخوادم الخدمة.\nيمكنك إلغاء هذه الأذونات في أي وقت من إعدادات هاتفك.'),
            _buildSection('5. حقوقك', 'لديك الحق في طلب الوصول إلى بياناتك، أو تعديلها، أو حذفها تماماً من أنظمتنا عبر التواصل معنا أو خيار مسح الحساب.'),
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
