import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../core/providers/chat_provider.dart';
import '../screens/shop_screen.dart';
import '../screens/booking_screen.dart';
import '../screens/profile_screen.dart';
import '../screens/privacy_policy_screen.dart';

// ── ألوان هوية BioPara الرسمية ──────────────────────────────────────
const Color primary = Color(0xFF2D4A2E);
const Color primaryLight = Color(0xFF4A7C4E);
const Color accent = Color(0xFFC8963E);
const Color background = Color(0xFFF5F0E8);
const Color surface = Color(0xFFFDFAF5);
const Color textPrimary = Color(0xFF1A2E1B);
const Color textSecondary = Color(0xFF6B7B6C);
const Color inputBorder = Color(0xFFD4C9B0);
const Color success = Color(0xFF2D7A4E);
const Color danger = Color(0xFFB94040);
const Color shadow = Color(0x26000000);

class BioParaDrawer extends ConsumerStatefulWidget {
  final String conversationId;
  final String currentRoute;
  const BioParaDrawer({super.key, required this.conversationId, this.currentRoute = '/chat'});

  @override
  ConsumerState<BioParaDrawer> createState() => _BioParaDrawerState();
}

class _BioParaDrawerState extends ConsumerState<BioParaDrawer> {
  bool _notificationsOn = true;
  final User? _user = Supabase.instance.client.auth.currentUser;

  @override
  Widget build(BuildContext context) {
    return Drawer(
      width: MediaQuery.of(context).size.width * 0.8 > 320 ? 320 : MediaQuery.of(context).size.width * 0.8,
      backgroundColor: background,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topRight: Radius.circular(24),
          bottomRight: Radius.circular(24),
        ),
      ),
      child: Stack(
        children: [
          // â”€â”€ نمط الأعشاب الخفيف في الخلفية ──
          Positioned.fill(
            child: Opacity(
              opacity: 0.04,
              child: Image.asset(
                'assets/images/image .png', // استخدام صورة النمط الموجودة
                repeat: ImageRepeat.repeat,
                fit: BoxFit.cover,
              ),
            ),
          ),

          // ── المحتوى الرئيسي ──
          Column(
            children: [
              DrawerHeaderWidget(user: _user),
              
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  children: [
                    // GROUP 1 — التنقل الرئيسي
                    const DrawerGroupLabel(label: 'التنقل الرئيسي'),
                    DrawerNavTile(
                      icon: Icons.person_outline,
                      label: 'الملف الشخصي',
                      iconBg: primaryLight.withValues(alpha: 0.12),
                      iconColor: primaryLight,
                      isSelected: widget.currentRoute == '/profile',
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.push(context, MaterialPageRoute(builder: (_) => const ProfileScreen()));
                      },
                    ),

                    DrawerNavTile(
                      icon: Icons.storefront_outlined,
                      label: 'المتجر',
                      iconBg: accent.withValues(alpha: 0.12),
                      iconColor: accent,
                      badgeCount: 3,
                      badgeColor: accent,
                      isSelected: widget.currentRoute == '/shop',
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.push(context, MaterialPageRoute(builder: (_) => const ShopScreen()));
                      },
                    ),

                    DrawerNavTile(
                      icon: Icons.calendar_today_outlined,
                      label: 'حجز موعد',
                      iconBg: const Color(0xFF4A6B8A).withValues(alpha: 0.12),
                      iconColor: const Color(0xFF4A6B8A),
                      isSelected: widget.currentRoute == '/book',
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.push(context, MaterialPageRoute(builder: (_) => const BookingScreen()));
                      },
                    ),

                    const DrawerGroupDivider(),

                    // GROUP 2 â€” الإعدادات
                    const DrawerGroupLabel(label: 'الإعدادات'),
                    DrawerNavTile(
                      icon: Icons.notifications_none_rounded,
                      label: 'الإشعارات',
                      iconBg: const Color(0xFF7A4A8A).withValues(alpha: 0.12),
                      iconColor: const Color(0xFF7A4A8A),
                      trailing: Switch(
                        value: _notificationsOn,
                        onChanged: (v) => setState(() => _notificationsOn = v),
                        activeThumbColor: primary,
                        activeTrackColor: primary.withValues(alpha: 0.2),
                        inactiveTrackColor: inputBorder.withValues(alpha: 0.3),
                      ),
                    ),

                    DrawerNavTile(
                      icon: Icons.language_rounded,
                      label: 'اللغة',
                      iconBg: const Color(0xFF4A7A6B).withValues(alpha: 0.12),
                      iconColor: const Color(0xFF4A7A6B),
                      trailing: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          border: Border.all(color: accent.withValues(alpha: 0.4)),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text('العربية 🇲🇦', style: GoogleFonts.tajawal(fontSize: 11, color: accent, fontWeight: FontWeight.w600)),
                      ),
                      onTap: () => _showLanguageSheet(context),
                    ),

                    DrawerNavTile(
                      icon: Icons.lock_outline_rounded,
                      label: 'الخصوصية والأمان',
                      iconBg: const Color(0xFF6B4A3A).withValues(alpha: 0.12),
                      iconColor: const Color(0xFF6B4A3A),
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.push(context, MaterialPageRoute(builder: (_) => const PrivacyPolicyScreen()));
                      },
                    ),

                    const DrawerGroupDivider(),

                    // GROUP 3 — إجراءات خطيرة
                    const DrawerGroupLabel(label: 'إجراءات الحساب'),
                    DrawerNavTile(
                      icon: Icons.delete_sweep_outlined,
                      label: 'مسح المحادثة',
                      iconBg: danger.withValues(alpha: 0.12),
                      iconColor: danger,
                      labelColor: danger,
                      onTap: () => _showConfirmDialog(
                        context,
                        title: 'مسح المحادثة؟',
                        body: 'سيتم حذف جميع رسائل المحادثة الحالية نهائياً.',
                        confirmLabel: 'مسح',
                        isDanger: true,
                        onConfirm: () async {
                          final messenger = ScaffoldMessenger.of(context);
                          try {
                            await ref.read(chatProvider(widget.conversationId).notifier).clearChat();
                          } catch (e) {
                            messenger.showSnackBar(
                              SnackBar(content: Text('فشل المسح: $e'), backgroundColor: Colors.red),
                            );
                          }
                        },
                      ),
                    ),

                    DrawerNavTile(
                      icon: Icons.logout_rounded,
                      label: 'تسجيل الخروج',
                      iconBg: danger.withValues(alpha: 0.12),
                      iconColor: danger,
                      labelColor: danger,
                      onTap: () => _showConfirmDialog(
                        context,
                        title: 'تسجيل الخروج؟',
                        body: 'ستحتاج لإدخال رقم هاتفك مرة أخرى للدخول.',
                        confirmLabel: 'خروج',
                        isDanger: true,
                        onConfirm: () async {
                          final nav = Navigator.of(context);
                          await Supabase.instance.client.auth.signOut();
                          nav.pushNamedAndRemoveUntil('/', (route) => false);
                        },
                      ),
                    ),
                  ],
                ),
              ),

              const DrawerFooter(),
            ],
          ),

          // ── زر الإغلاق العلوي ──
          Positioned(
            top: MediaQuery.of(context).padding.top + 10,
            right: 16,
            child: GestureDetector(
              onTap: () => Navigator.pop(context),
              child: Container(
                width: 36, height: 36,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.15),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.close, color: Colors.white, size: 18),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showLanguageSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) => const LanguageBottomSheet(),
    );
  }

  void _showConfirmDialog(BuildContext context, {required String title, required String body, required String confirmLabel, required bool isDanger, required VoidCallback onConfirm}) {
    showDialog(
      context: context,
      builder: (ctx) => ConfirmActionSheet(title: title, body: body, confirmLabel: confirmLabel, isDanger: isDanger, onConfirm: onConfirm),
    );
  }
}

// ── مكون هيدر المستخدم ───────────────────────────────────────
class DrawerHeaderWidget extends StatelessWidget {
  final User? user;
  const DrawerHeaderWidget({super.key, this.user});

  @override
  Widget build(BuildContext context) {
    final String phone = _maskPhone(user?.phone ?? '212673020264');
    final String name = user?.userMetadata?['full_name'] ?? 'مستخدم BioPara';

    return SizedBox(
      height: 200,
      width: double.infinity,
      child: Stack(
        children: [
          ClipPath(
            clipper: WaveClipper(),
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [primary, primaryLight],
                  begin: Alignment.topRight,
                  end: Alignment.bottomLeft,
                ),
              ),
              child: Stack(
                children: [
                  Positioned.fill(
                    child: Opacity(
                      opacity: 0.06,
                      child: Image.asset('assets/images/image .png', repeat: ImageRepeat.repeat, fit: BoxFit.cover),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SafeArea(
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const SizedBox(height: 10),
                  Stack(
                    alignment: Alignment.center,
                    children: [
                      Container(
                        width: 84, height: 84,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: accent.withValues(alpha: 0.4), width: 1.5, style: BorderStyle.solid),
                        ),
                      ),
                      Container(
                        width: 72, height: 72,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: accent, width: 3),
                          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.25), blurRadius: 20, offset: const Offset(0, 6))],
                          color: background,
                        ),
                        child: Center(
                          child: Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Image.asset(
                              'assets/images/logo.png',
                              fit: BoxFit.contain,
                              errorBuilder: (ctx, err, st) => Text(
                                name.isNotEmpty ? name[0].toUpperCase() : 'B',
                                style: GoogleFonts.cairo(fontSize: 28, fontWeight: FontWeight.bold, color: primary),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    name,
                    style: GoogleFonts.cairo(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white, shadows: [
                      const Shadow(color: Colors.black26, offset: Offset(0, 2), blurRadius: 6),
                    ]),
                  ),
                  Text(
                    phone,
                    style: GoogleFonts.tajawal(fontSize: 13, color: Colors.white.withValues(alpha: 0.7)),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: accent.withValues(alpha: 0.25),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: accent, width: 1),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Text('🌿', style: TextStyle(fontSize: 10)),
                        const SizedBox(width: 4),
                        Text('عضو BioPara', style: GoogleFonts.tajawal(fontSize: 11, color: accent, fontWeight: FontWeight.w600)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          Positioned(
            top: MediaQuery.of(context).padding.top + 10,
            left: 16,
            child: GestureDetector(
              onTap: () {
                Navigator.pop(context);
                Navigator.push(context, MaterialPageRoute(builder: (_) => const ProfileScreen()));
              },
              child: Container(
                width: 32, height: 32,
                decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.2), shape: BoxShape.circle),
                child: const Icon(Icons.edit_outlined, color: Colors.white, size: 16),
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _maskPhone(String phone) {
    if (phone.length < 8) return phone;
    return '${phone.substring(0, phone.length - 4)}XXXX';
  }
}

// ── المكون المخصص لمنحنى الهيدر ──────────────────────────────────
class WaveClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) {
    var path = Path();
    path.lineTo(0, size.height - 40);
    var firstControlPoint = Offset(size.width / 4, size.height);
    var firstEndPoint = Offset(size.width / 2.25, size.height - 30.0);
    path.quadraticBezierTo(firstControlPoint.dx, firstControlPoint.dy, firstEndPoint.dx, firstEndPoint.dy);

    var secondControlPoint = Offset(size.width - (size.width / 3.25), size.height - 65);
    var secondEndPoint = Offset(size.width, size.height - 40);
    path.quadraticBezierTo(secondControlPoint.dx, secondControlPoint.dy, secondEndPoint.dx, secondEndPoint.dy);

    path.lineTo(size.width, 0);
    path.close();
    return path;
  }

  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) => false;
}

// ── مكون عنصر القائمة ───────────────────────────────────────
class DrawerNavTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color iconBg;
  final Color iconColor;
  final Color? labelColor;
  final int? badgeCount;
  final Color? badgeColor;
  final Widget? trailing;
  final bool isSelected;
  final VoidCallback? onTap;

  const DrawerNavTile({
    super.key,
    required this.icon,
    required this.label,
    required this.iconBg,
    required this.iconColor,
    this.labelColor,
    this.badgeCount,
    this.badgeColor,
    this.trailing,
    this.isSelected = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          height: 56,
          padding: const EdgeInsets.symmetric(horizontal: 12),
          decoration: BoxDecoration(
            color: isSelected ? primary.withValues(alpha: 0.08) : Colors.transparent,
            borderRadius: BorderRadius.circular(14),
            border: isSelected ? const Border(left: BorderSide(color: accent, width: 3)) : null,
          ),
          child: Row(
            children: [
              // أيقونة دائرية
              Stack(
                clipBehavior: Clip.none,
                children: [
                  Container(
                    width: 40, height: 40,
                    decoration: BoxDecoration(
                      color: isSelected ? primary : iconBg,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(icon, color: isSelected ? Colors.white : iconColor, size: 20),
                  ),
                  if (badgeCount != null)
                    Positioned(
                      top: -2, right: -2,
                      child: Container(
                        width: 18, height: 18,
                        decoration: BoxDecoration(color: badgeColor ?? danger, shape: BoxShape.circle, border: Border.all(color: background, width: 1.5)),
                        child: Center(
                          child: Text(badgeCount.toString(), style: GoogleFonts.cairo(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.white)),
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(width: 16),
              // النص
              Expanded(
                child: Text(
                  label,
                  style: GoogleFonts.cairo(
                    fontSize: 15,
                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                    color: isSelected ? primary : (labelColor ?? textPrimary),
                  ),
                ),
              ),
              // الجزء الأيسر (Chevron أو Widget مخصص)
              if (trailing != null)
                trailing!
              else if (isSelected)
                Container(width: 6, height: 6, decoration: const BoxDecoration(color: accent, shape: BoxShape.circle))
              else
                Icon(Icons.chevron_left_rounded, color: textSecondary.withValues(alpha: 0.5), size: 18),
            ],
          ),
        ),
      ),
    );
  }
}

// â”€â”€ الفواصل والعناوين ───────────────────────────────────────
class DrawerGroupLabel extends StatelessWidget {
  final String label;
  const DrawerGroupLabel({super.key, required this.label});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: 20, top: 12, bottom: 4),
      child: Text(
        label,
        style: GoogleFonts.tajawal(fontSize: 11, fontWeight: FontWeight.w600, color: textSecondary),
      ),
    );
  }
}

class DrawerGroupDivider extends StatelessWidget {
  const DrawerGroupDivider({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Divider(color: inputBorder.withValues(alpha: 0.4), height: 1),
    );
  }
}

// ── تذييل القائمة ──────────────────────────────────────────
class DrawerFooter extends StatelessWidget {
  const DrawerFooter({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      decoration: BoxDecoration(
        border: Border(top: BorderSide(color: inputBorder.withValues(alpha: 0.4))),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset('assets/images/logo.png', width: 20, height: 20, color: primary.withValues(alpha: 0.4)),
              const SizedBox(width: 8),
              Text('BioPara Spiritual', style: GoogleFonts.cairo(fontSize: 12, fontWeight: FontWeight.w600, color: textSecondary)),
            ],
          ),
          const SizedBox(height: 4),
          Text('الإصدار ١.٠.٠', style: GoogleFonts.tajawal(fontSize: 10, color: textSecondary.withValues(alpha: 0.6))),
        ],
      ),
    );
  }
}

// ── نافذة التأكيد ──────────────────────────────────────────
class ConfirmActionSheet extends StatelessWidget {
  final String title;
  final String body;
  final String confirmLabel;
  final bool isDanger;
  final VoidCallback onConfirm;

  const ConfirmActionSheet({super.key, required this.title, required this.body, required this.confirmLabel, required this.isDanger, required this.onConfirm});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      backgroundColor: Colors.white,
      title: Column(
        children: [
          Icon(isDanger ? Icons.warning_amber_rounded : Icons.info_outline, color: isDanger ? danger : accent, size: 48),
          const SizedBox(height: 16),
          Text(title, style: GoogleFonts.cairo(fontWeight: FontWeight.bold, fontSize: 18), textAlign: TextAlign.center),
        ],
      ),
      content: Text(body, style: GoogleFonts.tajawal(fontSize: 14, color: textSecondary), textAlign: TextAlign.center),
      actionsPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      actions: [
        Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: () => Navigator.pop(context),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  side: const BorderSide(color: primary),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: Text('إلغاء', style: GoogleFonts.cairo(color: primary, fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  onConfirm();
                },
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  backgroundColor: isDanger ? danger : primary,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: Text(confirmLabel, style: GoogleFonts.cairo(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

// ── نافذة اختيار اللغة ───────────────────────────────────────
class LanguageBottomSheet extends StatelessWidget {
  const LanguageBottomSheet({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(width: 40, height: 4, decoration: BoxDecoration(color: inputBorder.withValues(alpha: 0.5), borderRadius: BorderRadius.circular(2))),
          const SizedBox(height: 20),
          Text('اختر اللغة', style: GoogleFonts.cairo(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 24),
          _buildLangItem('العربية 🇲🇦', true),
          _buildLangItem('Français 🇫🇷', false),
          _buildLangItem('English 🇬🇧', false),
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget _buildLangItem(String label, bool isSelected) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isSelected ? primary.withValues(alpha: 0.05) : Colors.transparent,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: isSelected ? primary : inputBorder.withValues(alpha: 0.3)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: GoogleFonts.tajawal(fontSize: 15, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
          if (isSelected) const Icon(Icons.check_circle, color: accent, size: 20),
        ],
      ),
    );
  }
}