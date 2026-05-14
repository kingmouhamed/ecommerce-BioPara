// lib/screens/admin_home_tab.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'admin_shared_constants.dart';
import 'admin_chat_screen.dart';

final adminStatsProvider = FutureProvider<Map<String, int>>((ref) async {
  final db = Supabase.instance.client;
  final adminId = db.auth.currentUser?.id ?? '';
  try {
    final convResp = await db.from('conversations').select('id');
    final total = (convResp as List).length;
    int unread = 0;
    try {
      final u = await db.from('messages').select('id').eq('status', 'sent').neq('sender_id', adminId);
      unread = (u as List).length;
    } catch (_) {}
    int reports = 0;
    try {
      final r = await db.from('conversations').select('id').not('patient_report', 'is', null);
      reports = (r as List).length;
    } catch (_) {}
    return {'patients': total, 'unread': unread, 'appointments': 0, 'reports': reports};
  } catch (_) {
    return {'patients': 0, 'unread': 0, 'appointments': 0, 'reports': 0};
  }
});

final activeConversationsProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  final db = Supabase.instance.client;
  try {
    List<dynamic> convs;
    try {
      convs = await db.from('conversations')
          .select('id, patient_id, last_message, last_message_at, unread_count')
          .order('last_message_at', ascending: false).limit(8);
    } catch (_) {
      convs = await db.from('conversations')
          .select('id, patient_id, created_at')
          .order('created_at', ascending: false).limit(8);
    }
    final result = <Map<String, dynamic>>[];
    for (final c in convs) {
      final pid = c['patient_id'] as String?;
      String name = 'مريض'; String? avatar;
      if (pid != null) {
        try {
          final p = await db.from('profiles').select('full_name, avatar_url').eq('id', pid).maybeSingle();
          if (p != null) { name = p['full_name'] as String? ?? name; avatar = p['avatar_url'] as String?; }
        } catch (_) {}
      }
      result.add({...Map<String, dynamic>.from(c as Map), 'patient_name': name, 'patient_avatar': avatar});
    }
    return result;
  } catch (_) { return []; }
});

class AdminHomeTab extends ConsumerWidget {
  final VoidCallback? onViewAllPatients;
  const AdminHomeTab({super.key, this.onViewAllPatients});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final statsAsync = ref.watch(adminStatsProvider);
    final convsAsync = ref.watch(activeConversationsProvider);
    final adminName  = ref.watch(adminNameProvider).valueOrNull ?? 'مدير';
    final now = DateTime.now();
    final days   = ['الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت','الأحد'];
    final months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
    final dateStr = '${days[now.weekday-1]}, ${now.day} ${months[now.month-1]}';

    final isMobile = MediaQuery.of(context).size.width < 800;

    return Container(
      color: kAdminBg,
      child: SingleChildScrollView(
        padding: EdgeInsets.all(isMobile ? 16 : 32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _Header(name: adminName, date: dateStr, stats: statsAsync),
            const SizedBox(height: 28),
            Text('نظرة عامة', style: GoogleFonts.cairo(fontSize: 18, fontWeight: FontWeight.bold, color: kAdminPrimary)),
            const SizedBox(height: 14),
            statsAsync.when(
              data: (s) => _StatsGrid(stats: s),
              loading: () => const Center(child: CircularProgressIndicator(color: kAdminTeal)),
              error: (e, _) => Text('خطأ في تحميل الإحصائيات', style: GoogleFonts.tajawal(color: Colors.red)),
            ),
            const SizedBox(height: 32),
            Row(children: [
              Container(width: 10, height: 10, decoration: const BoxDecoration(color: Colors.redAccent, shape: BoxShape.circle)),
              const SizedBox(width: 8),
              Text('المرضى النشطون', style: GoogleFonts.cairo(fontSize: 18, fontWeight: FontWeight.bold, color: kAdminPrimary)),
              const Spacer(),
              TextButton(
                onPressed: onViewAllPatients,
                child: Text('عرض الكل', style: GoogleFonts.tajawal(color: kAdminTeal)),
              ),
            ]),
            const SizedBox(height: 12),
            convsAsync.when(
              data: (convs) => convs.isEmpty
                  ? Center(child: Padding(padding: const EdgeInsets.all(40), child: Column(children: [
                      Icon(Icons.inbox_rounded, size: 56, color: Colors.grey.shade300),
                      const SizedBox(height: 12),
                      Text('لا توجد محادثات نشطة حالياً', style: GoogleFonts.tajawal(color: Colors.grey.shade500)),
                    ])))
                  : Column(children: convs.map((c) => _PatientRow(data: c)).toList()),
              loading: () => const Center(child: Padding(padding: EdgeInsets.all(32), child: CircularProgressIndicator(color: kAdminTeal))),
              error: (e, _) => Text('خطأ', style: GoogleFonts.tajawal(color: Colors.red)),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Header ────────────────────────────────────────────────────────
class _Header extends StatelessWidget {
  final String name, date;
  final AsyncValue<Map<String, int>> stats;
  const _Header({required this.name, required this.date, required this.stats});

  @override
  Widget build(BuildContext context) {
    final unread = stats.valueOrNull?['unread'] ?? 0;
    final isMobile = MediaQuery.of(context).size.width < 600;

    return Container(
      padding: EdgeInsets.all(isMobile ? 16 : 24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [kAdminPrimary, kAdminTeal], begin: Alignment.topRight, end: Alignment.bottomLeft),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: kAdminPrimary.withValues(alpha: 0.35), blurRadius: 16, offset: const Offset(0, 6))],
      ),
      child: Row(children: [
        Expanded(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('مرحباً، $name 👋', 
              style: GoogleFonts.cairo(color: Colors.white, fontSize: isMobile ? 18 : 22, fontWeight: FontWeight.bold),
              maxLines: 1, overflow: TextOverflow.ellipsis),
            const SizedBox(height: 4),
            Text(date, style: GoogleFonts.tajawal(color: Colors.white70, fontSize: isMobile ? 11 : 13)),
            if (unread > 0) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(20)),
                child: Text('لديك $unread رسالة غير مقروءة', style: GoogleFonts.tajawal(color: Colors.white, fontSize: 11)),
              ),
            ],
          ]),
        ),
        Icon(Icons.spa_rounded, color: kAdminGold, size: isMobile ? 40 : 52),
      ]),
    );
  }
}

// ── Stats Grid ────────────────────────────────────────────────────
class _StatsGrid extends StatelessWidget {
  final Map<String, int> stats;
  const _StatsGrid({required this.stats});

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 850;
    final isTiny = screenWidth < 500;

    final cards = [
      (Icons.people_alt_rounded,     'إجمالي المرضى',  stats['patients'] ?? 0,     kAdminTeal,   100),
      (Icons.mark_chat_unread_rounded,'غير مقروءة',     stats['unread'] ?? 0,       kAdminGold,   50),
      (Icons.calendar_today_rounded,  'مواعيد اليوم',   stats['appointments'] ?? 0, kAdminPrimary,20),
      (Icons.auto_awesome_rounded,    'تقارير Gemini',  stats['reports'] ?? 0,      kAdminPurple, 50),
    ];

    return GridView.count(
      crossAxisCount: isTiny ? 1 : (isMobile ? 2 : 4), 
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: 16, 
      mainAxisSpacing: 16, 
      childAspectRatio: isTiny ? 2.5 : (isMobile ? 1.3 : 1.25),
      children: cards.map((c) => _StatCard(icon: c.$1, label: c.$2, value: c.$3, color: c.$4, maxVal: c.$5)).toList(),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final int value;
  final Color color;
  final int maxVal;

  const _StatCard({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
    required this.maxVal,
  });

  @override
  Widget build(BuildContext context) {
    final progress = (value / maxVal).clamp(0.0, 1.0);
    final isMobile = MediaQuery.of(context).size.width < 600;

    return Container(
      padding: EdgeInsets.all(isMobile ? 14 : 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border(
          right: BorderSide(color: color, width: 4), // RTL accent
        ),
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
          Row(
            children: [
              Icon(icon, color: color, size: isMobile ? 22 : 28),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  '${(progress * 100).toInt()}%',
                  style: GoogleFonts.tajawal(
                    color: color,
                    fontSize: isMobile ? 9 : 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Expanded(
            child: TweenAnimationBuilder<double>(
              tween: Tween(begin: 0, end: value.toDouble()),
              duration: const Duration(milliseconds: 900),
              curve: Curves.easeOut,
              builder: (ctx, val, child) => FittedBox(
                fit: BoxFit.scaleDown,
                alignment: Alignment.centerRight,
                child: Text(
                  '${val.toInt()}',
                  style: GoogleFonts.tajawal(
                    fontSize: isMobile ? 32 : 40,
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
                ),
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
            maxLines: 1, overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 10),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: progress,
              color: color,
              backgroundColor: color.withValues(alpha: 0.1),
              minHeight: isMobile ? 3 : 5,
            ),
          ),
        ],
      ),
    );
  }
}


// ── Patient Row ───────────────────────────────────────────────────
class _PatientRow extends StatelessWidget {
  final Map<String, dynamic> data;
  const _PatientRow({required this.data});

  @override
  Widget build(BuildContext context) {
    final name      = data['patient_name'] as String? ?? 'مريض';
    final lastMsg   = getLastMessagePreview(data);  // ✅ BUG-HOME-01
    final unread    = data['unread_count'] as int? ?? 0;
    final patientId = data['patient_id'] as String? ?? '';
    final convId    = data['id'] as String? ?? '';
    final timeStr   = getArabicRelativeTime(data['last_message_at'] as String?);

    return GestureDetector(
      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => AdminChatScreen(patientId: patientId, patientName: name, conversationId: convId))),
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white, borderRadius: BorderRadius.circular(14),
          border: unread > 0 ? Border.all(color: kAdminTeal, width: 1.5) : Border.all(color: Colors.grey.shade100),
          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 8, offset: const Offset(0, 2))],
        ),
        child: Row(children: [
          CircleAvatar(radius: 22, backgroundColor: kAdminTeal.withValues(alpha: 0.15),
            child: Text(name.isNotEmpty ? name[0] : 'م', style: GoogleFonts.cairo(color: kAdminTeal, fontWeight: FontWeight.bold, fontSize: 18))),
          const SizedBox(width: 12),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Text(name, style: GoogleFonts.cairo(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.black87)),
              if (unread > 0) ...[const SizedBox(width: 6),
                Container(padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 1),
                  decoration: BoxDecoration(color: Colors.redAccent, borderRadius: BorderRadius.circular(10)),
                  child: Text('$unread', style: const TextStyle(color: Colors.white, fontSize: 10))),
              ],
            ]),
            const SizedBox(height: 3),
            Text(lastMsg, style: GoogleFonts.tajawal(color: unread > 0 ? Colors.black87 : Colors.grey.shade500, fontSize: 12,
                fontWeight: unread > 0 ? FontWeight.w600 : FontWeight.normal), maxLines: 1, overflow: TextOverflow.ellipsis),
          ])),
          Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
            if (timeStr.isNotEmpty) Text(timeStr, style: GoogleFonts.tajawal(color: Colors.grey.shade400, fontSize: 11)),
            const SizedBox(height: 4),
            const Icon(Icons.chevron_left_rounded, size: 14, color: kAdminTeal),
          ]),
        ]),
      ),
    );
  }
}
