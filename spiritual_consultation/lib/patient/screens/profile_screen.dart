import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'dart:math' as math;
import 'package:image_picker/image_picker.dart';
import 'orders_screen.dart';
import 'chat_screen.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'edit_profile_screen.dart';
import 'my_appointments_screen.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/providers/profile_provider.dart';
import '../../core/providers/auth_provider.dart';
import '../../core/models/profile_model.dart';


/// [ProfileScreen] - إعادة تصميم شاملة Ù„Ù‡Ùˆية BioPara Spiritual
/// تصميم يجمع Ø¨ÙŠÙ† الأصالة العربية ÙˆØ§Ù„ÙØ®Ø§Ù…ة الحديثة
class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});
 
  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}
 
class _ProfileScreenState extends ConsumerState<ProfileScreen>
    with TickerProviderStateMixin {
  // تعريف Ø§Ù„Ø£Ù„ÙˆØ§Ù† الأساسية Ù„Ù„Ù‡Ùˆية
  static const Color primary = Color(0xFF2D4A2E);
  static const Color primaryLight = Color(0xFF4A7C4E);
  static const Color accent = Color(0xFFC8963E);
  static const Color background = Color(0xFFF5F0E8);
  static const Color surface = Color(0xFFFDFAF5);
  static const Color textPrimary = Color(0xFF1A2E1B);
  static const Color textSecondary = Color(0xFF6B7B6C);
  static const Color inputBorder = Color(0xFFD4C9B0);
  static const Color danger = Color(0xFFB94040);

  late AnimationController _mainController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  String _maskPhone(String phone) {
    if (phone.length < 8) return phone;
    return phone.replaceRange(phone.length - 4, phone.length, "****");
  }

  @override
  void initState() {
    super.initState();
    _mainController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _fadeAnimation = CurvedAnimation(
      parent: _mainController,
      curve: Curves.easeIn,
    );
    _slideAnimation =
        Tween<Offset>(begin: const Offset(0, 0.1), end: Offset.zero).animate(
          CurvedAnimation(parent: _mainController, curve: Curves.easeOutBack),
        );

    _mainController.forward();
  }

  @override
  void dispose() {
    _mainController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final image = await picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("جاري تحديث Ø§Ù„ØµÙˆرة الشخصية..."),
            backgroundColor: primary,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final profileAsync = ref.watch(profileProvider);

    return profileAsync.when(
      data: (profile) {
        final userName = profile?.fullName ?? "مستخدم BioPara";
        final userPhone = _maskPhone(profile?.phone ?? "بدون رقم");
        final userHandle = profile?.fullName.replaceAll(' ', '_').toLowerCase() ?? "user";

        return Scaffold(
          backgroundColor: background,
          body: RefreshIndicator(
            onRefresh: () => ref.refresh(profileProvider.future),
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              child: Column(
                children: [
                  // 1. Ø§Ù„Ù‚سم Ø§Ù„Ø¹Ù„Ùˆي Ø§Ù„Ù…ØªÙ…Ùˆج (Header)
                  _buildHeader(userName),

                  const SizedBox(height: 40),
                  // 2. Ø¨Ø·Ø§Ù‚ة Ø§Ù„Ù…Ø¹Ù„Ùˆمات الشخصية
                  FadeTransition(
                    opacity: _fadeAnimation,
                    child: SlideTransition(
                      position: _slideAnimation,
                      child: _buildInfoCard(userPhone, userHandle),
                    ),
                  ),

                  // 3. Ù‚ائمة الإجراءات
                  _buildActionList(userName, userPhone, userHandle, profile),

                  // 4. زر تسجيل Ø§Ù„Ø®Ø±Ùˆج
                  _buildLogoutButton(),

                  _buildFooter(),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        );
      },
      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (err, _) => Scaffold(body: Center(child: Text("خطأ: $err"))),
    );
  }

  // Ø¨Ù†اء Ø§Ù„Ù‡يدر مع Ø§Ù„ØªÙ…Ùˆج Ùˆالأفاتار
  Widget _buildHeader(String userName) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        // Ø§Ù„Ø®Ù„ÙÙŠة المتدرجة مع Ø§Ù„ØªÙ…Ùˆج
        ClipPath(
          clipper: WaveClipper(),
          child: Container(
            height: 320,
            width: double.infinity,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topRight,
                end: Alignment.bottomLeft,
                colors: [primary, primaryLight],
              ),
            ),
            child: Stack(
              children: [
                // Ù†Ù‚ش Ø£ÙˆØ±Ø§Ù‚ شجر Ø®ÙÙŠف (Overlay)
                Positioned.fill(
                  child: Opacity(
                    opacity: 0.05,
                    child: CustomPaint(painter: LeafPatternPainter()),
                  ),
                ),
                // Ù…Ø­ØªÙˆÙ‰ Ø§Ù„Ù‡يدر (الاسم ÙˆØ§Ù„Ø¨ÙŠØ§Ù†ات)
                Positioned(
                  bottom: 65,
                  right: 0,
                  left: 0,
                  child: Column(
                    children: [
                      Text(
                        userName,
                        style: GoogleFonts.cairo(
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                          shadows: [
                            const Shadow(
                              color: Colors.black26,
                              offset: Offset(0, 2),
                              blurRadius: 8,
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 4),
                      _buildMemberBadge(),
                      const SizedBox(height: 4),
                      Text(
                        "Ø¹Ø¶Ùˆ Ù…Ù†ذ: مايو 2024",
                        style: GoogleFonts.tajawal(
                          fontSize: 11,
                          color: Colors.white70,
                          fontWeight: FontWeight.w300,
                        ),
                      ),
                    ],
                  ),
                ),
                // خط Ø°Ù‡بي جمالي ÙÙŠ Ø§Ù„Ø£Ø³Ùل
                Align(
                  alignment: Alignment.bottomCenter,
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 40),
                    child: Container(
                      width: 60,
                      height: 2.5,
                      decoration: BoxDecoration(
                        color: accent,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),

        // الأفاتار العائم
        Positioned(
          top: 50,
          right: 0,
          left: 0,
          child: Center(
            child: GestureDetector(
              onTap: _pickImage,
              child: _buildAvatar(userName),
            ),
          ),
        ),

        // صف الإحصائيات العائم (Stats Row)
        Positioned(bottom: -30, right: 16, left: 16, child: _buildStatsRow()),
      ],
    );
  }

  Widget _buildAvatar(String userName) {
    return Stack(
      children: [
        // Ø§Ù„Ø­Ù„Ù‚ة الخارجية Ø§Ù„Ù…Ù†Ù‚طة
        Container(
          width: 112,
          height: 112,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(
              color: accent.withValues(alpha: 0.4),
              width: 2,
              style: BorderStyle.none,
            ), // Simplification for ring
          ),
          child: CustomPaint(
            painter: DashedCirclePainter(color: accent.withValues(alpha: 0.4)),
          ),
        ),
        // Ø§Ù„Ø­Ø§Ùˆية الأساسية للأفاتار
        Container(
          margin: const EdgeInsets.all(8),
          width: 96,
          height: 96,
          decoration: BoxDecoration(
            color: surface,
            shape: BoxShape.circle,
            border: Border.all(color: accent, width: 3),
            boxShadow: const [
              BoxShadow(
                color: Color(0x4D2D4A2E),
                offset: Offset(0, 8),
                blurRadius: 24,
              ),
            ],
          ),
          child: Center(
            child: Text(
              userName.isNotEmpty ? userName[0].toUpperCase() : "B",
              style: GoogleFonts.cairo(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: primary,
              ),
            ),
          ),
        ),
        // زر Ø§Ù„Ùƒاميرا المصغر
        Positioned(
          bottom: 12,
          right: 12,
          child: Container(
            padding: const EdgeInsets.all(6),
            decoration: const BoxDecoration(
              color: accent,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.camera_alt, color: Colors.white, size: 14),
          ),
        ),
      ],
    );
  }

  Widget _buildMemberBadge() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
      decoration: BoxDecoration(
        color: accent.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: accent.withValues(alpha: 0.5), width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.eco, color: accent, size: 12),
          const SizedBox(width: 4),
          Text(
            "عضو BioPara",
            style: GoogleFonts.tajawal(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: accent,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsRow() {
    return Row(
      children: [
        _buildStatCard(context, "🌿 الجلسات", "5 جلسات", 0, onTap: () {
          final userId = Supabase.instance.client.auth.currentUser?.id;
          if (userId != null) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => ChatScreen(conversationId: userId),
              ),
            );
          }
        }),
        const SizedBox(width: 12),
        _buildStatCard(context, "📦 طلباتي", "3 طلبات", 1, onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const OrdersScreen()),
          );
        }),
        const SizedBox(width: 12),
        _buildStatCard(context, "⭐ آخر Ù…Ùˆعد", "أمس", 2),
      ],
    );
  }

  Widget _buildStatCard(BuildContext context, String label, String value, int index, {VoidCallback? onTap}) {
    return Expanded(
      child: TweenAnimationBuilder(
        tween: Tween<double>(begin: 0, end: 1),
        duration: Duration(milliseconds: 400 + (index * 150)),
        builder: (context, double val, child) {
          return Opacity(
            opacity: val,
            child: Transform.translate(
              offset: Offset(0, 20 * (1 - val)),
              child: GestureDetector(
                onTap: onTap,
                child: Container(
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: inputBorder.withValues(alpha: 0.6)),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x0F000000),
                      offset: Offset(0, 4),
                      blurRadius: 12,
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Text(
                      label,
                      style: GoogleFonts.tajawal(
                        fontSize: 10,
                        color: textSecondary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      value,
                      style: GoogleFonts.cairo(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: primary,
                      ),
                    ),
                  ],
                ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildInfoCard(String userPhone, String userHandle) {
    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: inputBorder.withValues(alpha: 0.4)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0A000000),
            offset: Offset(0, 4),
            blurRadius: 20,
          ),
        ],
      ),
      child: Column(
        children: [
          _buildInfoRow(
            Icons.phone,
            primaryLight,
            "Ø±Ù‚م Ø§Ù„Ù‡اتف",
            userPhone,
          ),
          Divider(
            height: 1,
            color: inputBorder.withValues(alpha: 0.3),
            indent: 16,
            endIndent: 16,
          ),
          _buildInfoRow(
            Icons.person_outline,
            accent,
            "اسم المعرّف",
            userHandle,
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(
    IconData icon,
    Color iconColor,
    String label,
    String value,
  ) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: iconColor.withValues(alpha: 0.15),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: iconColor, size: 20),
          ),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: GoogleFonts.tajawal(fontSize: 12, color: textSecondary),
              ),
              Text(
                value,
                style: GoogleFonts.cairo(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: textPrimary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildActionList(String userName, String userPhone, String userHandle, Profile? profile) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: inputBorder.withValues(alpha: 0.4)),
      ),
      child: Column(
        children: [
          _buildActionTile(Icons.history, primaryLight, "طلباتي Ø§Ù„Ø³Ø§Ø¨Ù‚ة", onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const OrdersScreen()),
            );
          }),
          Divider(height: 1, color: inputBorder.withValues(alpha: 0.3), indent: 64),
          _buildActionTile(Icons.calendar_today, accent, "مواعيدي", onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const MyAppointmentsScreen()),
            );
          }),
          Divider(height: 1, color: inputBorder.withValues(alpha: 0.3), indent: 64),

          _buildActionTile(Icons.edit_note, accent, "تعديل الملف الشخصي", onTap: () async {
            final result = await Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => EditProfileScreen(
                  currentName: userName,
                  currentPhone: userPhone,
                  currentHandle: userHandle,
                ),
              ),
            );

            if (result != null && result is Map) {
              // بعد التعديل Ø§Ù„Ù†اجح، Ù†Ù‚Ùˆم بتحديث Ø§Ù„Ø¨ÙŠØ§Ù†ات Ù…Ù† السيرفر
              ref.invalidate(profileProvider);
            }
          }),
          if (profile?.isAdmin == false) ...[
            Divider(height: 1, color: inputBorder.withValues(alpha: 0.3), indent: 64),
            _buildActionTile(
              Icons.admin_panel_settings_rounded, 
              danger, 
              "ØªÙØ¹ÙŠÙ„ صلاحية الأدمن (تجريبي)", 
              onTap: () async {
                final supabase = Supabase.instance.client;
                final userId = supabase.auth.currentUser?.id;
                if (userId != null) {
                  await supabase.from('profiles').update({'is_admin': true}).eq('id', userId);
                  ref.invalidate(profileProvider);
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("تم ØªÙØ¹ÙŠÙ„ صلاحية الأدمن! ÙŠØ±Ø¬Ù‰ إعادة تشغيل التطبيق.")),
                    );
                  }
                }
              }
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildActionTile(IconData icon, Color color, String title, {VoidCallback? onTap}) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: color, size: 24),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Text(
                  title,
                  style: GoogleFonts.cairo(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: textPrimary,
                  ),
                ),
              ),
              const Icon(Icons.chevron_left, color: textSecondary, size: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLogoutButton() {
    return GestureDetector(
      onTap: () => _showLogoutConfirmation(context),
      child: Container(
        margin: const EdgeInsets.all(16),
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: danger.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: danger.withValues(alpha: 0.3)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.logout, color: danger, size: 20),
            const SizedBox(width: 12),
            Text(
              "تسجيل Ø§Ù„Ø®Ø±Ùˆج",
              style: GoogleFonts.cairo(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: danger,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFooter() {
    return Column(
      children: [
        // استخدام Ø£ÙŠÙ‚ÙˆÙ†ة Ø¨Ø¯Ù„Ø§Ù‹ Ù…Ù† رابط Ø§Ù„ØµÙˆرة Ø§Ù„Ù…ÙƒØ³Ùˆر Ù„Ø¶Ù…Ø§Ù† Ø§Ø³ØªÙ‚رار Ø§Ù„ÙˆØ§Ø¬Ù‡ة
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: primary.withValues(alpha: 0.1),
            shape: BoxShape.circle,
          ),
          child: const Icon(
            Icons.eco_rounded, // Ø£ÙŠÙ‚ÙˆÙ†ة تعبر Ø¹Ù† الطبيعة Ùˆالأعشاب
            color: accent,
            size: 28,
          ),
        ),
        const SizedBox(height: 12),
        Text(
          "BioPara Spiritual",
          style: GoogleFonts.cairo(
            fontSize: 14,
            fontWeight: FontWeight.bold,
            color: primary,
            letterSpacing: 0.5,
          ),
        ),
        Text(
          "v1.0.0",
          style: GoogleFonts.tajawal(
            fontSize: 11,
            color: textSecondary,
          ),
        ),
      ],
    );
  }

  void _showLogoutConfirmation(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: surface,
          borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: inputBorder,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              "Ù‡ل تريد تسجيل الخروج؟",
              style: GoogleFonts.cairo(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              "ستحتاج لإدخال Ø±Ù‚Ù…Ùƒ مرة أخرى لاحقاً",
              style: GoogleFonts.tajawal(fontSize: 14, color: textSecondary),
            ),
            const SizedBox(height: 32),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      side: BorderSide(color: inputBorder),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Text(
                      "إلغاء",
                      style: GoogleFonts.cairo(color: textPrimary),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () async {
                      await ref.read(authProvider).signOut();
                      if (context.mounted) {
                        Navigator.pop(context);
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: danger,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 0,
                    ),
                    child: Text(
                      "Ø®Ø±Ùˆج",
                      style: GoogleFonts.cairo(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// Ù‚اطع المسار التموجي (Wave Clipper)
class WaveClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) {
    var path = Path();
    path.lineTo(0, size.height - 40);
    var firstStart = Offset(size.width / 4, size.height);
    var firstEnd = Offset(size.width / 2, size.height - 30);
    path.quadraticBezierTo(
      firstStart.dx,
      firstStart.dy,
      firstEnd.dx,
      firstEnd.dy,
    ); // Fix: firstEnd.dy

    // تصحيح بسيط Ù„Ù„ØªÙ…Ùˆج ليصبح Ø§Ù†Ø³ÙŠØ§Ø¨ÙŠØ§Ù‹ Ø£Ùƒثر
    path = Path();
    path.lineTo(0, size.height - 40);
    path.quadraticBezierTo(
      size.width / 4,
      size.height,
      size.width / 2,
      size.height - 20,
    );
    path.quadraticBezierTo(
      size.width * 3 / 4,
      size.height - 40,
      size.width,
      size.height - 10,
    );
    path.lineTo(size.width, 0);
    path.close();
    return path;
  }

  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) => false;
}

// رسام الدائرة Ø§Ù„Ù…Ù†Ù‚طة
class DashedCirclePainter extends CustomPainter {
  final Color color;
  DashedCirclePainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    double dashWidth = 5, dashSpace = 5, startBerth = 0;
    final paint = Paint()
      ..color = color
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    Rect rect = Offset.zero & size;
    double radius = size.width / 2;
    double circumference = 2 * math.pi * radius;
    int dashCount = (circumference / (dashWidth + dashSpace)).floor();

    for (int i = 0; i < dashCount; i++) {
      double startAngle = (i * (dashWidth + dashSpace) / radius) + startBerth;
      double sweepAngle = dashWidth / radius;
      canvas.drawArc(rect, startAngle, sweepAngle, false, paint);
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}

// رسام Ù†Ù‚ش Ø£ÙˆØ±Ø§Ù‚ الشجر Ø§Ù„Ø®ÙÙŠف
class LeafPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white
      ..strokeWidth = 1
      ..style = PaintingStyle.stroke;

    // رسم Ø£Ø´Ùƒال بسيطة ØªÙˆحي بالأعشاب
    for (var i = 0; i < 10; i++) {
      canvas.drawCircle(
        Offset(size.width * (i / 10), size.height * 0.2),
        20,
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}
