// lib/screens/admin_appointments_tab.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'admin_shared_constants.dart';
import 'admin_chat_screen.dart';

// ── Provider: مواعيد اليوم ────────────────────────────
final appointmentsProvider =
    FutureProvider.family<List<Map<String, dynamic>>, DateTime>((ref, day) async {
  final db = Supabase.instance.client;
  final start = DateTime(day.year, day.month, day.day);
  final end   = start.add(const Duration(days: 1));
  try {
    final rows = await db
        .from('appointments')
        .select('*')
        .gte('appointment_date', start.toIso8601String())
        .lt('appointment_date', end.toIso8601String())
        .order('appointment_date');
        
    final result = <Map<String, dynamic>>[];
    for (final r in rows) {
      final pid = r['patient_id'] as String?;
      Map<String, dynamic>? profile;
      if (pid != null) {
        try {
          profile = await db
              .from('profiles')
              .select('full_name, avatar_url')
              .eq('id', pid)
              .maybeSingle();
        } catch (_) {}
      }
      result.add({
        ...Map<String, dynamic>.from(r as Map),
        'profiles': profile,
      });
    }
    return result;
  } catch (e) {
    debugPrint('appointmentsProvider error: $e');
    return [];
  }
});

// ══════════════════════════════════════════════════════════════════
class AdminAppointmentsTab extends ConsumerStatefulWidget {
  const AdminAppointmentsTab({super.key});

  @override
  ConsumerState<AdminAppointmentsTab> createState() => _AdminAppointmentsTabState();
}

class _AdminAppointmentsTabState extends ConsumerState<AdminAppointmentsTab> {
  DateTime _selectedDay = DateTime.now();

  List<DateTime> get _weekDays {
    final today = DateTime.now();
    return List.generate(7, (i) => DateTime(today.year, today.month, today.day + i - 3));
  }

  Future<void> _updateStatus(String id, String status) async {
    try {
      await Supabase.instance.client
          .from('appointments')
          .update({'status': status})
          .eq('id', id);
      ref.invalidate(appointmentsProvider(_selectedDay));
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('فشل التحديث: $e', style: GoogleFonts.tajawal()), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final apptAsync = ref.watch(appointmentsProvider(_selectedDay));
    final months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
    final dayNames = ['الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت','الأحد'];
    final today = DateTime.now();

    return Container(
      color: kAdminBg,
      child: Column(
        children: [
          // ── رأس الصفحة ────────────────────────────────────────
          Container(
            padding: const EdgeInsets.fromLTRB(20, 32, 20, 0),
            color: Colors.white,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('إدارة المواعيد', style: GoogleFonts.cairo(fontSize: 24, fontWeight: FontWeight.bold, color: kAdminPrimary)),
                const SizedBox(height: 16),
                // ── شريط الأسبوع ───────────────────────────────────
                SizedBox(
                  height: 72,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: _weekDays.length,
                    itemBuilder: (ctx, i) {
                      final day = _weekDays[i];
                      final isSelected = day.day == _selectedDay.day && day.month == _selectedDay.month;
                      final isToday    = day.day == today.day && day.month == today.month;
                      return GestureDetector(
                        onTap: () => setState(() => _selectedDay = day),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          width: 55,
                          margin: const EdgeInsets.only(left: 8, bottom: 16),
                          decoration: BoxDecoration(
                            color: isSelected ? kAdminTeal : Colors.transparent,
                            borderRadius: BorderRadius.circular(12),
                            border: isToday && !isSelected ? Border.all(color: kAdminTeal, width: 1.5) : null,
                          ),
                          child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                            Text(dayNames[day.weekday - 1].substring(0, 3),
                                style: GoogleFonts.tajawal(fontSize: 10, color: isSelected ? Colors.white : Colors.grey.shade500)),
                            const SizedBox(height: 2),
                            Text('${day.day}',
                                style: GoogleFonts.tajawal(fontSize: 16, fontWeight: FontWeight.bold,
                                    color: isSelected ? Colors.white : (isToday ? kAdminTeal : Colors.black87))),
                          ]),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),

          // ── عنوان اليوم ────────────────────────────────────────
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
            child: apptAsync.when(
              data: (list) => Row(
                children: [
                  Text(
                    '${list.length} مواعيد — ${_selectedDay.day} ${months[_selectedDay.month - 1]}',
                    style: GoogleFonts.cairo(fontSize: 14, color: kAdminPrimary, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              loading: () => const SizedBox.shrink(),
              error: (_, _) => const SizedBox.shrink(),
            ),
          ),

          // ── القائمة ───────────────────────────────────────────
          Expanded(
            child: apptAsync.when(
              data: (list) {
                if (list.isEmpty) {
                  return Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                    Icon(Icons.event_available_rounded, size: 64, color: Colors.grey.shade300),
                    const SizedBox(height: 16),
                    Text('لا مواعيد اليوم — استرح! 🌿',
                        style: GoogleFonts.tajawal(color: Colors.grey.shade500, fontSize: 15)),
                  ]));
                }
                return ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  itemCount: list.length,
                  itemBuilder: (ctx, i) => _AppointmentCard(
                    data: list[i],
                    onConfirm: () => _updateStatus(list[i]['id'], 'confirmed'),
                    onCancel:  () => _updateStatus(list[i]['id'], 'cancelled'),
                    onChat: () {
                      final profile = list[i]['profiles'] as Map<String, dynamic>?;
                      Navigator.push(ctx, MaterialPageRoute(builder: (_) => AdminChatScreen(
                        patientId: list[i]['patient_id'] as String? ?? '',
                        patientName: profile?['full_name'] as String? ?? 'مريض',
                        conversationId: list[i]['conversation_id'] as String? ?? '',
                      )));
                    },
                  ),
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

// ── بطاقة موعد ───────────────────────────────────────────────────
class _AppointmentCard extends StatelessWidget {
  final Map<String, dynamic> data;
  final VoidCallback onConfirm, onCancel, onChat;
  const _AppointmentCard({required this.data, required this.onConfirm, required this.onCancel, required this.onChat});

  @override
  Widget build(BuildContext context) {
    final profile   = data['profiles'] as Map<String, dynamic>?;
    final name      = profile?['full_name'] as String? ?? 'مريض';
    final status    = data['status'] as String? ?? 'pending';
    final type      = data['appointment_type'] as String? ?? 'text';
    final dateStr   = data['appointment_date'] as String?;
    String timeStr  = '';
    if (dateStr != null) {
      final dt = DateTime.tryParse(dateStr)?.toLocal();
      if (dt != null) timeStr = '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
    }

    final statusColor = switch (status) {
      'confirmed' => Colors.green.shade600,
      'done'      => Colors.grey,
      'cancelled' => Colors.redAccent,
      _           => Colors.orange,
    };
    final statusLabel = switch (status) {
      'confirmed' => '✅ مؤكد',
      'done'      => '🏁 منتهي',
      'cancelled' => '❌ ملغي',
      _           => '⏳ قيد الانتظار',
    };
    final typeIcon  = type == 'video' ? Icons.videocam_rounded : type == 'audio' ? Icons.mic_rounded : Icons.chat_rounded;
    final typeColor = type == 'video' ? kAdminPurple : type == 'audio' ? kAdminTeal : Colors.blueGrey;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white, borderRadius: BorderRadius.circular(12),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 8, offset: const Offset(0, 2))],
      ),
      child: Column(children: [
        Row(children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(color: kAdminBg, borderRadius: BorderRadius.circular(8)),
            child: Text(timeStr.isNotEmpty ? timeStr : '--:--',
                style: GoogleFonts.tajawal(fontWeight: FontWeight.bold, color: kAdminPrimary, fontSize: 13)),
          ),
          const SizedBox(width: 8),
          CircleAvatar(radius: 18, backgroundColor: kAdminTeal.withValues(alpha: 0.15),
            child: Text(name.isNotEmpty ? name[0] : 'م', style: GoogleFonts.cairo(color: kAdminTeal, fontWeight: FontWeight.bold, fontSize: 12))),
          const SizedBox(width: 8),
          Expanded(child: Text(name, style: GoogleFonts.cairo(fontWeight: FontWeight.bold, fontSize: 13), maxLines: 1, overflow: TextOverflow.ellipsis)),
          
          Icon(typeIcon, size: 14, color: typeColor),
          const SizedBox(width: 4),
          Text(statusLabel, style: GoogleFonts.tajawal(fontSize: 10, color: statusColor, fontWeight: FontWeight.bold)),
        ]),
        if (status == 'pending') ...[
          const SizedBox(height: 12),
          Row(children: [
            Expanded(child: OutlinedButton(
              onPressed: onCancel,
              style: OutlinedButton.styleFrom(foregroundColor: Colors.redAccent, side: const BorderSide(color: Colors.redAccent), padding: EdgeInsets.zero),
              child: Text('إلغاء', style: GoogleFonts.tajawal(fontSize: 12)),
            )),
            const SizedBox(width: 8),
            Expanded(child: ElevatedButton(
              onPressed: onConfirm,
              style: ElevatedButton.styleFrom(backgroundColor: kAdminPrimary, padding: EdgeInsets.zero),
              child: Text('تأكيد', style: GoogleFonts.tajawal(color: Colors.white, fontSize: 12)),
            )),
            const SizedBox(width: 8),
            IconButton(onPressed: onChat, icon: const Icon(Icons.chat_bubble_outline_rounded, color: kAdminTeal, size: 20)),
          ]),
        ] else ...[
          const SizedBox(height: 8),
          Align(alignment: Alignment.centerLeft,
            child: TextButton.icon(onPressed: onChat, icon: const Icon(Icons.chat_bubble_outline_rounded, size: 14, color: kAdminTeal),
              label: Text('فتح المحادثة', style: GoogleFonts.tajawal(color: kAdminTeal, fontSize: 12)))),
        ],
      ]),
    );
  }
}
