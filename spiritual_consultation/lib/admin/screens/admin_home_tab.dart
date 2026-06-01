// lib/admin/screens/admin_home_tab.dart
// ═══════════════════════════════════════════════════════════════
// BioPara Admin — Home Tab v2.1
// Full fix: real data, animated stats, realtime conversations
// ═══════════════════════════════════════════════════════════════
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'admin_shared_constants.dart';
import 'admin_chat_screen.dart';
import 'admin_order_widgets.dart';
import '../../core/providers/auth_provider.dart';

// ══════════════════════════════════════════════════════════════════
// PROVIDERS — Real data from Supabase
// ══════════════════════════════════════════════════════════════════

/// إجمالي عدد المرضى (المحادثات الفريدة)
final totalPatientsProvider = FutureProvider<int>((ref) async {
  try {
    final res = await Supabase.instance.client
        .from('conversations')
        .select('id');
    return (res as List).length;
  } catch (e) {
    debugPrint('totalPatientsProvider: $e');
    return 0;
  }
});

/// عدد الرسائل غير المقروءة (Realtime Stream)
final unreadMessagesProvider = StreamProvider<int>((ref) {
  final adminId = Supabase.instance.client.auth.currentUser?.id ?? '';
  return Supabase.instance.client
      .from('messages')
      .stream(primaryKey: ['id'])
      .map((rows) => rows
          .where((m) =>
              m['sender_id'] != adminId &&
              (m['status'] == 'sent' || m['status'] == null))
          .length);
});

/// مواعيد اليوم
final todayAppointmentsProvider = FutureProvider<int>((ref) async {
  try {
    final today = DateTime.now();
    final start = DateTime(today.year, today.month, today.day);
    final end = start.add(const Duration(days: 1));
    final res = await Supabase.instance.client
        .from('appointments')
        .select('id')
        .gte('appointment_date', start.toIso8601String())
        .lt('appointment_date', end.toIso8601String());
    return (res as List).length;
  } catch (e) {
    debugPrint('todayAppointmentsProvider: $e');
    return 0;
  }
});

/// تقارير Gemini المولّدة
final geminiReportsProvider = FutureProvider<int>((ref) async {
  try {
    final res = await Supabase.instance.client
        .from('conversations')
        .select('id')
        .not('patient_report', 'is', null);
    return (res as List).length;
  } catch (e) {
    debugPrint('geminiReportsProvider: $e');
    return 0;
  }
});

/// المحادثات النشطة (Realtime)
final activeConversationsProvider =
    FutureProvider<List<Map<String, dynamic>>>((ref) async {
  final db = Supabase.instance.client;
  try {
    List<dynamic> convs;
    try {
      convs = await db
          .from('conversations')
          .select('id, patient_id, last_message, last_message_at, unread_count')
          .order('last_message_at', ascending: false)
          .limit(8);
    } catch (_) {
      convs = await db
          .from('conversations')
          .select('id, patient_id, created_at')
          .order('created_at', ascending: false)
          .limit(8);
    }

    final result = <Map<String, dynamic>>[];
    for (final c in convs) {
      final pid = c['patient_id'] as String?;
      String name = 'مريض';
      String? avatar;
      if (pid != null) {
        try {
          final p = await db
              .from('profiles')
              .select('full_name, avatar_url')
              .eq('id', pid)
              .maybeSingle();
          if (p != null) {
            name = p['full_name'] as String? ?? name;
            avatar = p['avatar_url'] as String?;
          }
        } catch (e) {
          debugPrint('Profile fetch failed for $pid: $e');
        }
      }
      result.add({
        'last_message': '...',
        'last_message_at': c['created_at'],
        'unread_count': 0,
        ...Map<String, dynamic>.from(c as Map),
        'patient_name': name,
        'patient_avatar': avatar,
      });
    }
    return result;
  } catch (e) {
    debugPrint('activeConversationsProvider: $e');
    return [];
  }
});

// ══════════════════════════════════════════════════════════════════
// PROVIDERS — Ecommerce Stats
// ══════════════════════════════════════════════════════════════════

/// إجمالي الطلبات
final totalOrdersProvider = FutureProvider<int>((ref) async {
  try {
    final res = await Supabase.instance.client.from('orders').select('id');
    return (res as List).length;
  } catch (_) {
    return 0;
  }
});

/// الإيرادات المحققة (الطلبات المسلّمة)
final totalRevenueProvider = FutureProvider<double>((ref) async {
  try {
    final res = await Supabase.instance.client
        .from('orders')
        .select('total_price')
        .eq('status', 'delivered');
    double total = 0;
    for (final r in (res as List)) {
      total += (r['total_price'] as num?)?.toDouble() ?? 0;
    }
    return total;
  } catch (_) {
    return 0;
  }
});

/// أحدث الطلبات المعلّقة
final recentOrdersProvider =
    FutureProvider<List<Map<String, dynamic>>>((ref) async {
  try {
    final res = await Supabase.instance.client
        .from('orders')
        .select('id, total_price, status, created_at')
        .inFilter('status', ['pending', 'processing'])
        .order('created_at', ascending: false)
        .limit(5);
    return List<Map<String, dynamic>>.from(res as List);
  } catch (_) {
    return [];
  }
});

// ══════════════════════════════════════════════════════════════════
// MAIN WIDGET
// ══════════════════════════════════════════════════════════════════

class AdminHomeTab extends ConsumerWidget {
  final VoidCallback? onViewAllPatients;
  final VoidCallback? onViewAppointments;
  final VoidCallback? onViewReports;
  const AdminHomeTab({
    super.key,
    this.onViewAllPatients,
    this.onViewAppointments,
    this.onViewReports,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profileAsync = ref.watch(adminProfileProvider);
    final totalAsync = ref.watch(totalPatientsProvider);
    final unreadAsync = ref.watch(unreadMessagesProvider);
    final todayAsync = ref.watch(todayAppointmentsProvider);
    final reportsAsync = ref.watch(geminiReportsProvider);
    final convsAsync = ref.watch(activeConversationsProvider);
    final ordersAsync = ref.watch(totalOrdersProvider);
    final revenueAsync = ref.watch(totalRevenueProvider);
    final recentOrdersAsync = ref.watch(recentOrdersProvider);

    // اسم المدير من قاعدة البيانات
    final adminName =
        profileAsync.valueOrNull?['full_name'] as String? ?? 'مدير';
    final firstName = adminName.split(' ').first;

    // التاريخ الكامل بالعربية مع السنة
    final now = DateTime.now();
    final days = [
      'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس',
      'الجمعة', 'السبت', 'الأحد'
    ];
    final months = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    final dateStr =
        '${days[now.weekday - 1]}، ${now.day} ${months[now.month - 1]} ${now.year}';

    final isMobile = MediaQuery.of(context).size.width < 800;

    return Container(
      color: kAdminBg,
      child: SingleChildScrollView(
        padding: EdgeInsets.all(isMobile ? 16 : 32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── الهيدر ──────────────────────────────────────────
            _Header(
              name: firstName,
              date: dateStr,
              unreadAsync: unreadAsync,
              todayAsync: todayAsync,
            ),
            const SizedBox(height: 28),

            // ── عنوان الإحصائيات ─────────────────────────────────
            Text(
              'نظرة عامة',
              style: GoogleFonts.cairo(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: kAdminPrimary,
              ),
            ),
            const SizedBox(height: 14),

            // ── بطاقات الإحصائيات ────────────────────────────────
            _StatsGrid(
              totalAsync: totalAsync,
              unreadAsync: unreadAsync,
              todayAsync: todayAsync,
              reportsAsync: reportsAsync,
              onViewPatients: onViewAllPatients,
              onViewAppointments: onViewAppointments,
              onViewReports: onViewReports,
            ),
            const SizedBox(height: 32),

            // ── قسم المرضى النشطون ───────────────────────────────
            Row(children: [
              _PulseDot(),
              const SizedBox(width: 8),
              Text(
                'المرضى النشطون',
                style: GoogleFonts.cairo(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: kAdminPrimary,
                ),
              ),
              const Spacer(),
              TextButton(
                onPressed: onViewAllPatients,
                child: Text(
                  'عرض الكل ←',
                  style: GoogleFonts.tajawal(color: kAdminTeal),
                ),
              ),
            ]),
            const SizedBox(height: 12),

            convsAsync.when(
              data: (convs) => convs.isEmpty
                  ? _buildEmptyState()
                  : Column(
                      children: convs
                          .map((c) => _PatientRow(data: c))
                          .toList(),
                    ),
              loading: () => const Center(
                child: Padding(
                  padding: EdgeInsets.all(32),
                  child: CircularProgressIndicator(color: kAdminTeal),
                ),
              ),
              error: (e, _) => Center(
                child: Text(
                  'خطأ في جلب البيانات: $e',
                  style: GoogleFonts.tajawal(color: Colors.red),
                ),
              ),
            ),

            const SizedBox(height: 32),

            // ── قسم الإيرادات والطلبات ───────────────────────
            Row(children: [
              const Icon(Icons.shopping_bag_outlined, color: kAdminPrimary, size: 20),
              const SizedBox(width: 8),
              Text(
                'الطلبات والإيرادات',
                style: GoogleFonts.cairo(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: kAdminPrimary,
                ),
              ),
            ]),
            const SizedBox(height: 12),

            // بطاقتا الطلبات والإيرادات
            Row(children: [
              Expanded(
                child: AdminMiniStatCard(
                  icon: Icons.receipt_long_outlined,
                  label: 'إجمالي الطلبات',
                  value: ordersAsync.when(
                    data: (v) => '$v',
                    loading: () => '...',
                    error: (e, s) => '0',
                  ),
                  color: kAdminPrimary,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: AdminMiniStatCard(
                  icon: Icons.attach_money_rounded,
                  label: 'الإيرادات (درهم)',
                  value: revenueAsync.when(
                    data: (v) => v.toStringAsFixed(0),
                    loading: () => '...',
                    error: (e, s) => '0',
                  ),
                  color: kAdminGold,
                ),
              ),
            ]),
            const SizedBox(height: 16),

            // قائمة الطلبات المعلّقة
            recentOrdersAsync.when(
              data: (orders) => orders.isEmpty
                  ? const SizedBox.shrink()
                  : Column(
                      children: orders.map((o) => AdminOrderRow(data: o)).toList(),
                    ),
              loading: () => const SizedBox.shrink(),
              error: (e, s) => const SizedBox.shrink(),
            ),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(40),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.people_outline, size: 64, color: Colors.grey.shade300),
            const SizedBox(height: 12),
            Text(
              'لا يوجد مرضى نشطون الآن',
              style: GoogleFonts.tajawal(
                fontSize: 16,
                color: Colors.grey.shade500,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              'ستظهر المحادثات الجديدة هنا تلقائياً',
              style: GoogleFonts.tajawal(
                fontSize: 12,
                color: Colors.grey.shade400,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ══════════════════════════════════════════════════════════════════
// HEADER
// ══════════════════════════════════════════════════════════════════
class _Header extends ConsumerWidget {
  final String name;
  final String date;
  final AsyncValue<int> unreadAsync;
  final AsyncValue<int> todayAsync;

  const _Header({
    required this.name,
    required this.date,
    required this.unreadAsync,
    required this.todayAsync,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isMobile = MediaQuery.of(context).size.width < 600;
    final unread = unreadAsync.valueOrNull ?? 0;
    final today = todayAsync.valueOrNull ?? 0;

    return Container(
      padding: EdgeInsets.all(isMobile ? 16 : 24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [kAdminPrimary, kAdminTeal],
          begin: Alignment.topRight,
          end: Alignment.bottomLeft,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: kAdminPrimary.withValues(alpha: 0.35),
            blurRadius: 16,
            offset: const Offset(0, 6),
          )
        ],
      ),
      child: Row(
        children: [
          // يسار: إحصائيات سريعة (تملأ الفراغ)
          if (!isMobile) ...[
            _HeaderStat(
              icon: Icons.message_outlined,
              value: '$unread',
              label: 'رسائل جديدة',
            ),
            const SizedBox(width: 24),
            _HeaderStat(
              icon: Icons.calendar_today_outlined,
              value: '$today',
              label: 'مواعيد اليوم',
            ),
            const Spacer(),
          ],

          // يمين: التحية والتاريخ
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                'مرحباً، $name 👋',
                style: GoogleFonts.cairo(
                  color: Colors.white,
                  fontSize: isMobile ? 18 : 22,
                  fontWeight: FontWeight.bold,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 4),
              Text(
                date,
                style: GoogleFonts.tajawal(
                  color: Colors.white70,
                  fontSize: isMobile ? 11 : 13,
                ),
              ),
              if (unread > 0) ...[
                const SizedBox(height: 8),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    'لديك $unread رسالة غير مقروءة',
                    style: GoogleFonts.tajawal(
                      color: Colors.white,
                      fontSize: 11,
                    ),
                  ),
                ),
              ],
            ],
          ),

          if (isMobile) ...[
            const Spacer(),
            Icon(Icons.spa_rounded, color: kAdminGold, size: 40),
          ],
        ],
      ),
    );
  }
}

class _HeaderStat extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;

  const _HeaderStat({
    required this.icon,
    required this.value,
    required this.label,
  });

  @override
  Widget build(BuildContext context) => Column(
        children: [
          Icon(icon, color: Colors.white70, size: 20),
          const SizedBox(height: 4),
          Text(
            value,
            style: GoogleFonts.tajawal(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            label,
            style: GoogleFonts.tajawal(color: Colors.white70, fontSize: 11),
          ),
        ],
      );
}

// ══════════════════════════════════════════════════════════════════
// STATS GRID — بطاقات بيانات حقيقية مع تحميل وخطأ
// ══════════════════════════════════════════════════════════════════
class _StatsGrid extends ConsumerWidget {
  final AsyncValue<int> totalAsync;
  final AsyncValue<int> unreadAsync;
  final AsyncValue<int> todayAsync;
  final AsyncValue<int> reportsAsync;
  final VoidCallback? onViewPatients;
  final VoidCallback? onViewAppointments;
  final VoidCallback? onViewReports;

  const _StatsGrid({
    required this.totalAsync,
    required this.unreadAsync,
    required this.todayAsync,
    required this.reportsAsync,
    this.onViewPatients,
    this.onViewAppointments,
    this.onViewReports,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 850;
    final isTiny = screenWidth < 500;
    final total = totalAsync.valueOrNull ?? 1;

    final cards = [
      (
        Icons.groups_rounded,
        'إجمالي المرضى',
        totalAsync,
        kAdminTeal,
        null,
        onViewPatients,
      ),
      (
        Icons.chat_bubble_rounded,
        'غير مقروءة',
        unreadAsync,
        kAdminGold,
        total,
        onViewPatients,
      ),
      (
        Icons.event_available_rounded,
        'مواعيد اليوم',
        todayAsync,
        kAdminPrimary,
        null,
        onViewAppointments,
      ),
      (
        Icons.summarize_rounded,
        'تقارير Gemini',
        reportsAsync,
        kAdminPurple,
        total,
        onViewReports,
      ),
    ];

    return GridView.count(
      crossAxisCount: isTiny ? 1 : (isMobile ? 2 : 4),
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: 16,
      mainAxisSpacing: 16,
      childAspectRatio: isTiny ? 2.5 : (isMobile ? 1.3 : 1.25),
      children: cards
          .map((c) => _StatCard(
                icon: c.$1,
                label: c.$2,
                valueAsync: c.$3,
                color: c.$4,
                maxVal: c.$5,
                onTap: c.$6,
              ))
          .toList(),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final AsyncValue<int> valueAsync;
  final Color color;
  final int? maxVal;
  final VoidCallback? onTap;

  const _StatCard({
    required this.icon,
    required this.label,
    required this.valueAsync,
    required this.color,
    this.maxVal,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 600;
    final count = valueAsync.valueOrNull ?? 0;
    final total = maxVal ?? 1;
    final ratio = total > 0 ? (count / total).clamp(0.0, 1.0) : 0.0;

    return GestureDetector(
      onTap: onTap,
      child: MouseRegion(
        cursor: onTap != null ? SystemMouseCursors.click : SystemMouseCursors.basic,
        child: Container(
          padding: EdgeInsets.all(isMobile ? 14 : 20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border(right: BorderSide(color: color, width: 4)),
            boxShadow: [
              BoxShadow(
                color: color.withValues(alpha: 0.12),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            Icon(icon, color: color, size: isMobile ? 22 : 28),
            const Spacer(),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                maxVal != null ? '${(ratio * 100).round()}%' : '',
                style: GoogleFonts.tajawal(
                  color: color,
                  fontSize: isMobile ? 9 : 11,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ]),
          const SizedBox(height: 12),
          // القيمة الحقيقية أو Loading
          Expanded(
            child: valueAsync.when(
              data: (val) => TweenAnimationBuilder<double>(
                tween: Tween(begin: 0, end: val.toDouble()),
                duration: const Duration(milliseconds: 900),
                curve: Curves.easeOut,
                builder: (ctx, v, child) => FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: Alignment.centerRight,
                  child: Text(
                    '${v.toInt()}',
                    style: GoogleFonts.tajawal(
                      fontSize: isMobile ? 32 : 40,
                      fontWeight: FontWeight.bold,
                      color: color,
                    ),
                  ),
                ),
              ),
              loading: () => SizedBox(
                height: 40,
                child: Align(
                  alignment: Alignment.centerRight,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation(color),
                  ),
                ),
              ),
              error: (e, _) => Text(
                '—',
                style: GoogleFonts.tajawal(fontSize: 40, color: Colors.grey),
              ),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: GoogleFonts.tajawal(
              fontSize: isMobile ? 11 : 13,
              color: Colors.grey[600],
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 10),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: ratio,
              color: color,
              backgroundColor: color.withValues(alpha: 0.1),
              minHeight: isMobile ? 3 : 5,
            ),
          ),
        ],
      ),
    )));
  }
}

// ══════════════════════════════════════════════════════════════════
// PULSE DOT — نقطة حية متحركة
// ══════════════════════════════════════════════════════════════════
class _PulseDot extends StatefulWidget {
  @override
  State<_PulseDot> createState() => _PulseDotState();
}

class _PulseDotState extends State<_PulseDot>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _anim;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 1),
    )..repeat(reverse: true);
    _anim = Tween(begin: 0.3, end: 1.0).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: _anim,
        builder: (ctx, child) => Opacity(
          opacity: _anim.value,
          child: Container(
            width: 10,
            height: 10,
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.green,
            ),
          ),
        ),
      );
}

// ══════════════════════════════════════════════════════════════════
// PATIENT ROW
// ══════════════════════════════════════════════════════════════════
class _PatientRow extends StatelessWidget {
  final Map<String, dynamic> data;
  const _PatientRow({required this.data});

  @override
  Widget build(BuildContext context) {
    final name = data['patient_name'] as String? ?? 'مريض';
    final lastMsg = getLastMessagePreview(data);
    final unread = data['unread_count'] as int? ?? 0;
    final patientId = data['patient_id'] as String? ?? '';
    final convId = data['id'] as String? ?? '';
    final timeStr =
        getArabicRelativeTime(data['last_message_at'] as String?);

    return GestureDetector(
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => AdminChatScreen(
            patientId: patientId,
            patientName: name,
            conversationId: convId,
          ),
        ),
      ),
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: unread > 0
              ? Border.all(color: kAdminTeal, width: 1.5)
              : Border.all(color: Colors.grey.shade100),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 8,
              offset: const Offset(0, 2),
            )
          ],
        ),
        child: Row(children: [
          CircleAvatar(
            radius: 22,
            backgroundColor: kAdminTeal.withValues(alpha: 0.15),
            child: Text(
              name.isNotEmpty ? name[0] : 'م',
              style: GoogleFonts.cairo(
                color: kAdminTeal,
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(children: [
                  Text(
                    name,
                    style: GoogleFonts.cairo(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                      color: Colors.black87,
                    ),
                  ),
                  if (unread > 0) ...[
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 7, vertical: 1),
                      decoration: BoxDecoration(
                        color: Colors.redAccent,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        '$unread',
                        style: const TextStyle(
                            color: Colors.white, fontSize: 10),
                      ),
                    ),
                  ],
                ]),
                const SizedBox(height: 3),
                Text(
                  lastMsg,
                  style: GoogleFonts.tajawal(
                    color: unread > 0
                        ? Colors.black87
                        : Colors.grey.shade500,
                    fontSize: 12,
                    fontWeight: unread > 0
                        ? FontWeight.w600
                        : FontWeight.normal,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              if (timeStr.isNotEmpty)
                Text(
                  timeStr,
                  style: GoogleFonts.tajawal(
                      color: Colors.grey.shade400, fontSize: 11),
                ),
              const SizedBox(height: 4),
              const Icon(Icons.chevron_left_rounded,
                  size: 14, color: kAdminTeal),
            ],
          ),
        ]),
      ),
    );
  }
}