import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F0E8),
      appBar: AppBar(
        title: Text(
          'سياسة الخصوصية',
          style: GoogleFonts.tajawal(fontWeight: FontWeight.bold),
        ),
        backgroundColor: const Color(0xFF0D6E6E),
        foregroundColor: Colors.white,
        elevation: 0,
        leading: Directionality(
          textDirection: TextDirection.ltr,
          child: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () => Navigator.pop(context),
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Banner
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              margin: const EdgeInsets.only(bottom: 24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0D6E6E), Color(0xFF2E7D32)],
                  begin: Alignment.centerRight,
                  end: Alignment.centerLeft,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(
                        Icons.privacy_tip_outlined,
                        color: Colors.white,
                        size: 28,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'سياسة الخصوصية لتطبيق BioPara',
                          style: GoogleFonts.tajawal(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'نحن في BioPara نولي خصوصيتك أهمية قصوى. '
                    'تهدف هذه السياسة إلى توضيح كيفية جمعنا '
                    'لمعلوماتك وحمايتها عند استخدام تطبيقنا.',
                    style: GoogleFonts.tajawal(
                      fontSize: 13,
                      color: Colors.white.withValues(alpha: 0.9),
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      'متوافقة مع GDPR والقانون المغربي 09-08',
                      style: GoogleFonts.tajawal(
                        fontSize: 11,
                        color: Colors.white,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Sections
            _buildSection(
              '1. جمع المعلومات',
              'نجمع المعلومات التي تقدمها لنا مباشرة، مثل اسمك، وبريدك الإلكتروني، ورقم هاتفك، والمعلومات الصحية والروحية التي تشاركها أثناء محادثاتك مع المستشار. نجمع هذه البيانات فقط لتقديم استشارات دقيقة ومخصصة لحالتك.',
              icon: Icons.person_outline,
              color: const Color(0xFF0D6E6E),
            ),
            _buildSection(
              '2. استخدام المعلومات',
              'نستخدم بياناتك لتوفير خدمات الاستشارة، تحليل حالتك عبر الذكاء الاصطناعي لمساعدة المستشار، وتحسين جودة الخدمة. المحادثات مشفرة ولا يتم مشاركتها إلا مع الأطراف المذكورة في القسم 4 لأغراض تشغيل الخدمة فقط.',
              icon: Icons.settings_outlined,
              color: const Color(0xFF2E7D32),
            ),
            _buildSection(
              '3. الذكاء الاصطناعي ومعالجة البيانات',
              'يستخدم تطبيق BioPara تقنية الذكاء الاصطناعي Gemini من Google لتحليل محادثاتك وتوليد تقارير طبية مخصصة تُساعد المستشار على فهم حالتك بشكل أفضل.\n\n'
              'ما يتم إرساله لـ Google:\n'
              '- نصوص المحادثات النصية فقط\n'
              '- لا يتم إرسال الصور أو التسجيلات الصوتية\n\n'
              'Google تعالج هذه البيانات وفق سياسة خصوصيتها:\n'
              'policies.google.com/privacy\n\n'
              'يمكنك طلب عدم استخدام الذكاء الاصطناعي في تحليل محادثتك بالتواصل معنا على: privacy@biopara.ma',
              icon: Icons.auto_awesome,
              color: const Color(0xFF7B1FA2),
            ),
            _buildSection(
              '4. مشاركة البيانات مع أطراف ثالثة',
              'لا نبيع بياناتك لأي طرف. نتعامل مع الأطراف التالية لتشغيل الخدمة فقط:\n\n'
              '🔹 Supabase (أيرلندا)\n'
              '   تخزين البيانات والمصادقة — مشفرة بالكامل\n'
              '   supabase.com/privacy\n\n'
              '🔹 Google Gemini (الولايات المتحدة)\n'
              '   تحليل نصوص المحادثات بالذكاء الاصطناعي\n'
              '   policies.google.com/privacy\n\n'
              '🔹 ZegoCloud (هونغ كونغ)\n'
              '   معالجة المكالمات الصوتية والمرئية\n'
              '   zegocloud.com/privacy-policy\n\n'
              '🔹 Stripe (الولايات المتحدة)\n'
              '   معالجة المدفوعات — لا نخزن بيانات بطاقتك\n'
              '   stripe.com/privacy\n\n'
              'جميع هذه الأطراف ملزمة بعقود حماية بيانات صارمة.',
              icon: Icons.share,
              color: const Color(0xFF0D6E6E),
            ),
            _buildSection(
              '5. أمان البيانات',
              'تتم حماية جميع بياناتك باستخدام تقنيات تشفير متقدمة (عبر قواعد بيانات Supabase) لضمان عدم وصول أي أطراف غير مصرح لها إلى معلوماتك الشخصية أو سجلات المحادثة الخاصة بك. نجري مراجعات أمنية دورية لضمان سلامة بياناتك.',
              icon: Icons.lock_outline,
              color: const Color(0xFF1565C0),
            ),
            _buildSection(
              '6. الأذونات المطلوبة',
              'يطلب التطبيق الوصول إلى:\n'
              '- الكاميرا ومعرض الصور: لمشاركة الصور مع المعالج.\n'
              '- الميكروفون: لتسجيل الرسائل الصوتية وإجراء المكالمات.\n'
              '- الإنترنت: للاتصال بخوادم الخدمة.\n'
              'يمكنك إلغاء هذه الأذونات في أي وقت من إعدادات هاتفك.',
              icon: Icons.security,
              color: const Color(0xFFE65100),
            ),
            _buildSection(
              '7. الاحتفاظ بالبيانات وحذفها',
              'نحتفظ ببياناتك طالما حسابك نشط في التطبيق.\n\n'
              'عند طلب حذف الحساب:\n'
              '- يتم حذف جميع محادثاتك خلال 7 أيام\n'
              '- يتم حذف الصور والتسجيلات الصوتية فوراً\n'
              '- يتم حذف البيانات الشخصية خلال 30 يوماً\n'
              '- قد نحتفظ ببعض البيانات المجهولة لأغراض إحصائية لمدة لا تتجاوز 12 شهراً\n\n'
              'لطلب حذف بياناتك، تواصل معنا:\n'
              'privacy@biopara.ma',
              icon: Icons.storage,
              color: const Color(0xFF2E7D32),
            ),
            _buildSection(
              '8. حقوقك',
              'لديك الحق في طلب الوصول إلى بياناتك، أو تعديلها، أو نقلها (Data Portability)، أو الاعتراض على معالجة الذكاء الاصطناعي لبياناتك، أو حذفها تماماً من أنظمتنا عبر التواصل معنا أو خيار مسح الحساب.',
              icon: Icons.verified_user,
              color: const Color(0xFF0D6E6E),
            ),
            _buildSection(
              '9. القانون المطبق والسلطة المختصة',
              'تخضع هذه السياسة لقوانين المملكة المغربية، ولا سيما:\n'
              '- قانون 09-08 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي.\n'
              '- قرارات اللجنة الوطنية لمراقبة حماية المعطيات الشخصية (CNDP).\n\n'
              'في حالة أي نزاع، تختص المحاكم المغربية بالنظر فيه.\n\n'
              'للتواصل مع مسؤول حماية البيانات:\n'
              '📧 privacy@biopara.ma\n'
              '📱 +212 673 020 264 (واتساب)',
              icon: Icons.gavel,
              color: const Color(0xFF5D4037),
            ),

            const Divider(),
            const SizedBox(height: 16),

            // Contact card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF0D6E6E).withValues(alpha: 0.05),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF0D6E6E).withValues(alpha: 0.2)),
              ),
              child: Column(
                children: [
                  Text(
                    'تواصل معنا بخصوص الخصوصية',
                    style: GoogleFonts.tajawal(
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFF0D6E6E),
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Email row
                  Row(
                    children: [
                      const Icon(Icons.email_outlined, size: 16, color: Color(0xFF0D6E6E)),
                      const SizedBox(width: 8),
                      Text(
                        'privacy@biopara.ma',
                        style: GoogleFonts.tajawal(),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  // WhatsApp row
                  Row(
                    children: [
                      const Icon(Icons.phone_outlined, size: 16, color: Color(0xFF0D6E6E)),
                      const SizedBox(width: 8),
                      Text(
                        '+212 673 020 264',
                        style: GoogleFonts.tajawal(),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  // Website row
                  Row(
                    children: [
                      const Icon(Icons.language_outlined, size: 16, color: Color(0xFF0D6E6E)),
                      const SizedBox(width: 8),
                      Text(
                        'biopara.ma/privacy',
                        style: GoogleFonts.tajawal(),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),
            Center(
              child: Column(
                children: [
                  Text(
                    'آخر تحديث: يونيو 2026',
                    style: GoogleFonts.tajawal(
                      fontSize: 12,
                      color: Colors.grey,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'الإصدار 1.0.0',
                    style: GoogleFonts.tajawal(fontSize: 12, color: Colors.grey),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(
    String title,
    String content, {
    IconData icon = Icons.info_outline,
    Color color = const Color(0xFF0D6E6E),
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
        border: Border(
          right: BorderSide(color: color, width: 4), // RTL accent
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Title row with icon
            Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, color: color, size: 20),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    title,
                    style: GoogleFonts.tajawal(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                      color: color,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            const Divider(height: 1),
            const SizedBox(height: 12),
            // Content
            Text(
              content,
              style: GoogleFonts.tajawal(
                fontSize: 14,
                height: 1.7,
                color: Colors.black87,
              ),
            ),
          ],
        ),
      ),
    );
  }
}