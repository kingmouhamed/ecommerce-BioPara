// lib/screens/admin_reports_tab.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'admin_shared_constants.dart';

// ── Provider: قائمة التقارير المولّدة ────────────────────────────
final reportsProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  final db = Supabase.instance.client;
  try {
    final rows = await db
        .from('conversations')
        .select('id, patient_id, patient_report, report_generated_at, profiles!patient_id(full_name, avatar_url)')
        .not('patient_report', 'is', null)
        .order('report_generated_at', ascending: false);
    return List<Map<String, dynamic>>.from(rows as List);
  } catch (_) {
    return [];
  }
});

// ── Provider: إحصائيات التقارير ───────────────────────────────────
final reportStatsProvider = FutureProvider<Map<String, dynamic>>((ref) async {
  final db = Supabase.instance.client;
  try {
    final rows = await db
        .from('conversations')
        .select('patient_report, sentiment_score')
        .not('patient_report', 'is', null);
    final list = rows as List;
    final total = list.length;
    double avgSentiment = 0;
    if (list.isNotEmpty) {
      final scores = list.where((r) => r['sentiment_score'] != null).map((r) => r['sentiment_score'] as int).toList();
      if (scores.isNotEmpty) avgSentiment = scores.reduce((a, b) => a + b) / scores.length;
    }
    return {'total': total, 'avgSentiment': avgSentiment.toStringAsFixed(1)};
  } catch (_) {
    return {'total': 0, 'avgSentiment': 'N/A'};
  }
});

// ══════════════════════════════════════════════════════════════════
class AdminReportsTab extends ConsumerWidget {
  const AdminReportsTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final reportsAsync = ref.watch(reportsProvider);
    final statsAsync   = ref.watch(reportStatsProvider);

    return Container(
      color: kAdminBg,
      child: Column(
        children: [
          // ── رأس الصفحة ────────────────────────────────────────
          Container(
            padding: const EdgeInsets.fromLTRB(28, 32, 28, 16),
            color: Colors.white,
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [
                Text('تقارير المرضى', style: GoogleFonts.cairo(fontSize: 26, fontWeight: FontWeight.bold, color: kAdminPrimary)),
                const Spacer(),
                IconButton(
                  onPressed: () { ref.invalidate(reportsProvider); ref.invalidate(reportStatsProvider); },
                  icon: const Icon(Icons.refresh_rounded, color: kAdminPrimary),
                  tooltip: 'تحديث',
                ),
              ]),
              const SizedBox(height: 16),
              // ── بطاقات الملخص ─────────────────────────────────
              statsAsync.when(
                data: (s) => Row(children: [
                  Expanded(child: _SummaryCard(icon: Icons.description_rounded, label: 'إجمالي التقارير', value: '${s['total']}', color: kAdminTeal)),
                  const SizedBox(width: 12),
                  Expanded(child: _SummaryCard(icon: Icons.sentiment_satisfied_alt_rounded, label: 'متوسط المزاج', value: '${s['avgSentiment']}/10', color: kAdminGold)),
                  const SizedBox(width: 12),
                  Expanded(child: _SummaryCard(icon: Icons.auto_awesome_rounded, label: 'مولّدة بـ Gemini', value: '${s['total']}', color: kAdminPurple)),
                ]),
                loading: () => const Center(child: CircularProgressIndicator(color: kAdminTeal)),
                error: (_, _) => const SizedBox.shrink(),
              ),
            ]),
          ),

          // ── قائمة التقارير ────────────────────────────────────
          Expanded(
            child: reportsAsync.when(
              data: (list) {
                if (list.isEmpty) {
                  return Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                    Icon(Icons.insert_drive_file_outlined, size: 72, color: Colors.grey.shade300),
                    const SizedBox(height: 16),
                    Text('لا توجد تقارير مولّدة بعد', style: GoogleFonts.tajawal(color: Colors.grey.shade500, fontSize: 16)),
                    const SizedBox(height: 8),
                    Text('افتح محادثة مريض واضغط على زر Gemini لتوليد تقرير',
                        style: GoogleFonts.tajawal(color: Colors.grey.shade400, fontSize: 13), textAlign: TextAlign.center),
                  ]));
                }
                return ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                  itemCount: list.length,
                  itemBuilder: (ctx, i) => _ReportCard(data: list[i], onDelete: () async {
                    try {
                      await Supabase.instance.client.from('conversations')
                          .update({'patient_report': null, 'report_generated_at': null})
                          .eq('id', list[i]['id']);
                      ref.invalidate(reportsProvider);
                    } catch (e) {
                      if (ctx.mounted) {
                        ScaffoldMessenger.of(ctx).showSnackBar(
                          SnackBar(content: Text('فشل الحذف: $e', style: GoogleFonts.tajawal())));
                      }
                    }
                  }),
                );
              },
              loading: () => const Center(child: CircularProgressIndicator(color: kAdminTeal)),
              error: (e, _) => Center(child: Text('خطأ: $e', style: GoogleFonts.tajawal(color: Colors.red))),
            ),
          ),
        ],
      ),
    );
  }
}

// ── بطاقة ملخص ────────────────────────────────────────────────────
class _SummaryCard extends StatelessWidget {
  final IconData icon; final String label, value; final Color color;
  const _SummaryCard({required this.icon, required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(14),
    decoration: BoxDecoration(
      color: color.withValues(alpha: 0.08), borderRadius: BorderRadius.circular(14),
      border: Border.all(color: color.withValues(alpha: 0.2)),
    ),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Icon(icon, color: color, size: 24),
      const SizedBox(height: 8),
      Text(value, style: GoogleFonts.tajawal(fontSize: 22, fontWeight: FontWeight.bold, color: color)),
      Text(label, style: GoogleFonts.tajawal(fontSize: 11, color: Colors.grey.shade600)),
    ]),
  );
}

// ── بطاقة تقرير ───────────────────────────────────────────────────
class _ReportCard extends StatelessWidget {
  final Map<String, dynamic> data;
  final VoidCallback onDelete;
  const _ReportCard({required this.data, required this.onDelete});

  @override
  Widget build(BuildContext context) {
    final profile  = data['profiles'] as Map<String, dynamic>?;
    final name     = profile?['full_name'] as String? ?? 'مريض';
    final report   = data['patient_report'] as String? ?? '';
    final dateStr  = data['report_generated_at'] as String?;
    final timeStr  = getArabicRelativeTime(dateStr);
    final preview  = report.length > 60 ? '${report.substring(0, 60)}...' : report;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white, borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 8, offset: const Offset(0, 2))],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        leading: CircleAvatar(
          radius: 24, backgroundColor: kAdminTeal.withValues(alpha: 0.12),
          child: Text(name.isNotEmpty ? name[0] : 'م',
              style: GoogleFonts.cairo(color: kAdminTeal, fontWeight: FontWeight.bold, fontSize: 18)),
        ),
        title: Row(children: [
          Expanded(child: Text(name, style: GoogleFonts.cairo(fontWeight: FontWeight.bold, fontSize: 15))),
          Text(timeStr, style: GoogleFonts.tajawal(color: Colors.grey.shade400, fontSize: 11)),
        ]),
        subtitle: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const SizedBox(height: 4),
          Text(preview, style: GoogleFonts.tajawal(color: Colors.grey.shade600, fontSize: 12.5), maxLines: 2, overflow: TextOverflow.ellipsis),
        ]),
        trailing: Row(mainAxisSize: MainAxisSize.min, children: [
          // زر العرض
          IconButton(
            icon: const Icon(Icons.visibility_rounded, color: kAdminTeal, size: 20),
            tooltip: 'عرض التقرير',
            onPressed: () => _showReportSheet(context, name, report, timeStr),
          ),
          // زر الحذف
          IconButton(
            icon: const Icon(Icons.delete_outline_rounded, color: Colors.redAccent, size: 20),
            tooltip: 'حذف التقرير',
            onPressed: () => _confirmDelete(context),
          ),
        ]),
      ),
    );
  }

  void _confirmDelete(BuildContext context) {
    showDialog(context: context, builder: (_) => AlertDialog(
      title: Text('حذف التقرير', style: GoogleFonts.cairo(fontWeight: FontWeight.bold)),
      content: Text('هل تريد حذف هذا التقرير؟ لا يمكن التراجع.', style: GoogleFonts.tajawal()),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: Text('إلغاء', style: GoogleFonts.tajawal())),
        ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
          onPressed: () { Navigator.pop(context); onDelete(); },
          child: Text('حذف', style: GoogleFonts.tajawal(color: Colors.white)),
        ),
      ],
    ));
  }

  void _showReportSheet(BuildContext context, String name, String report, String time) {
    showModalBottomSheet(
      context: context, isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => DraggableScrollableSheet(
        initialChildSize: 0.85, maxChildSize: 0.95, minChildSize: 0.5,
        builder: (ctx, ctrl) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(children: [
            Container(width: 40, height: 4, margin: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(4))),
            Padding(padding: const EdgeInsets.symmetric(horizontal: 24), child: Row(children: [
              const Icon(Icons.auto_awesome_rounded, color: kAdminGold),
              const SizedBox(width: 8),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('تقرير جلسة — $name', style: GoogleFonts.cairo(fontWeight: FontWeight.bold, fontSize: 16)),
                Text(time, style: GoogleFonts.tajawal(color: Colors.grey.shade500, fontSize: 12)),
              ])),
            ])),
            const Divider(height: 24),
            Expanded(child: SingleChildScrollView(
              controller: ctrl,
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Text(report, style: GoogleFonts.tajawal(fontSize: 14, height: 1.8, color: Colors.black87)),
            )),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(children: [
                Expanded(child: OutlinedButton.icon(
                  onPressed: () => Navigator.pop(ctx),
                  icon: const Icon(Icons.close),
                  label: Text('إغلاق', style: GoogleFonts.tajawal()),
                )),
              ]),
            ),
          ]),
        ),
      ),
    );
  }
}
