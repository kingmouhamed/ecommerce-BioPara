// lib/screens/admin_patients_tab.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'admin_shared_constants.dart';
import 'admin_chat_screen.dart';

// ── Provider: قائمة المرضى الكاملة ───────────────────────────────
final allPatientsProvider =
    FutureProvider<List<Map<String, dynamic>>>((ref) async {
  final db = Supabase.instance.client;
  try {
    List<dynamic> convs;
    try {
      convs = await db
          .from('conversations')
          .select('id, patient_id, last_message, last_message_at, unread_count, sentiment_score')
          .order('last_message_at', ascending: false);
    } catch (_) {
      convs = await db
          .from('conversations')
          .select('id, patient_id, created_at')
          .order('created_at', ascending: false);
    }

    final result = <Map<String, dynamic>>[];
    for (final c in convs) {
      final patientId = c['patient_id'] as String?;
      String name = 'مريض';
      String? avatar;

      if (patientId != null) {
        try {
          final p = await db
              .from('profiles')
              .select('full_name, avatar_url')
              .eq('id', patientId)
              .maybeSingle();
          if (p != null) {
            name = p['full_name'] as String? ?? name;
            avatar = p['avatar_url'] as String?;
          }
        } catch (_) {}
      }

      result.add({
        ...Map<String, dynamic>.from(c as Map),
        'patient_name': name,
        'patient_avatar': avatar,
      });
    }
    return result;
  } catch (_) {
    return [];
  }
});

// ══════════════════════════════════════════════════════════════════
class AdminPatientsTab extends ConsumerStatefulWidget {
  const AdminPatientsTab({super.key});

  @override
  ConsumerState<AdminPatientsTab> createState() => _AdminPatientsTabState();
}

class _AdminPatientsTabState extends ConsumerState<AdminPatientsTab> {
  final _searchCtrl = TextEditingController();
  String _query = '';
  int _sortIndex = 0; // 0=آخر رسالة, 1=أقدم, 2=اسم

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  List<Map<String, dynamic>> _filter(List<Map<String, dynamic>> list) {
    var filtered = list.where((p) {
      final name = (p['patient_name'] as String? ?? '').toLowerCase();
      return _query.isEmpty || name.contains(_query.toLowerCase());
    }).toList();

    switch (_sortIndex) {
      case 1: // الأقدم
        filtered.sort((a, b) {
          final aAt = a['last_message_at'] as String? ??
              a['created_at'] as String? ?? '';
          final bAt = b['last_message_at'] as String? ??
              b['created_at'] as String? ?? '';
          return aAt.compareTo(bAt);
        });
        break;
      case 2: // الاسم
        filtered.sort((a, b) {
          final an = a['patient_name'] as String? ?? '';
          final bn = b['patient_name'] as String? ?? '';
          return an.compareTo(bn);
        });
        break;
      default: // آخر رسالة (default desc)
        break;
    }

    return filtered;
  }

  @override
  Widget build(BuildContext context) {
    final patientsAsync = ref.watch(allPatientsProvider);

    return Container(
      color: kAdminBg,
      child: Column(
        children: [
          // ── رأس الصفحة ────────────────────────────────────────
          Container(
            padding: const EdgeInsets.fromLTRB(28, 32, 28, 16),
            color: Colors.white,
            child: Column(
              children: [
                Row(
                  children: [
                    Text('إدارة المرضى',
                        style: GoogleFonts.cairo(
                            fontSize: 26,
                            fontWeight: FontWeight.bold,
                            color: kAdminPrimary)),
                    const Spacer(),
                    // Sort Dropdown
                    PopupMenuButton<int>(
                      initialValue: _sortIndex,
                      onSelected: (v) => setState(() => _sortIndex = v),
                      itemBuilder: (_) => [
                        PopupMenuItem(
                          value: 0,
                          child: Text('آخر رسالة',
                              style: GoogleFonts.tajawal()),
                        ),
                        PopupMenuItem(
                          value: 1,
                          child: Text('الأقدم أولاً',
                              style: GoogleFonts.tajawal()),
                        ),
                        PopupMenuItem(
                          value: 2,
                          child: Text('حسب الاسم',
                              style: GoogleFonts.tajawal()),
                        ),
                      ],
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          border: Border.all(
                              color: Colors.grey.shade300),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.sort_rounded,
                                color: kAdminTeal, size: 18),
                            const SizedBox(width: 6),
                            Text('ترتيب',
                                style: GoogleFonts.tajawal(
                                    color: kAdminTeal, fontSize: 13)),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    // Refresh
                    IconButton(
                      onPressed: () => ref.refresh(allPatientsProvider),
                      icon: const Icon(Icons.refresh_rounded,
                          color: kAdminPrimary),
                      tooltip: 'تحديث',
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                // شريط البحث
                TextField(
                  controller: _searchCtrl,
                  textAlign: TextAlign.right,
                  onChanged: (v) => setState(() => _query = v),
                  decoration: InputDecoration(
                    hintText: 'ابحث عن مريض...',
                    hintStyle: GoogleFonts.tajawal(
                        color: Colors.grey.shade400),
                    prefixIcon: const Icon(Icons.search_rounded,
                        color: kAdminTeal),
                    suffixIcon: _query.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear_rounded,
                                color: Colors.grey),
                            onPressed: () {
                              _searchCtrl.clear();
                              setState(() => _query = '');
                            },
                          )
                        : null,
                    filled: true,
                    fillColor: kAdminBg,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 12),
                  ),
                ),
              ],
            ),
          ),

          // ── القائمة ───────────────────────────────────────────
          Expanded(
            child: patientsAsync.when(
              data: (patients) {
                final filtered = _filter(patients);
                if (filtered.isEmpty) {
                  return _buildEmpty(
                      _query.isNotEmpty
                          ? 'لا توجد نتائج للبحث عن "$_query"'
                          : 'لا توجد محادثات بعد');
                }
                return ListView.builder(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  itemCount: filtered.length,
                  itemBuilder: (ctx, i) =>
                      _PatientCard(data: filtered[i]),
                );
              },
              loading: () => const Center(
                child: CircularProgressIndicator(color: kAdminTeal),
              ),
              error: (e, _) => Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.error_outline,
                        color: Colors.redAccent, size: 48),
                    const SizedBox(height: 12),
                    Text('حدث خطأ في تحميل البيانات',
                        style: GoogleFonts.tajawal(
                            color: Colors.grey.shade600)),
                    const SizedBox(height: 16),
                    ElevatedButton.icon(
                      onPressed: () => ref.refresh(allPatientsProvider),
                      icon: const Icon(Icons.refresh),
                      label: Text('إعادة المحاولة',
                          style: GoogleFonts.tajawal()),
                      style: ElevatedButton.styleFrom(
                          backgroundColor: kAdminTeal,
                          foregroundColor: Colors.white),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmpty(String msg) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.people_outline_rounded,
              size: 72, color: Colors.grey.shade300),
          const SizedBox(height: 16),
          Text(msg,
              style: GoogleFonts.tajawal(
                  color: Colors.grey.shade500, fontSize: 15)),
        ],
      ),
    );
  }
}

// ── بطاقة المريض ─────────────────────────────────────────────────
class _PatientCard extends StatelessWidget {
  final Map<String, dynamic> data;
  const _PatientCard({required this.data});

  @override
  Widget build(BuildContext context) {
    final name      = data['patient_name'] as String? ?? 'مريض';
    final patientId = data['patient_id'] as String? ?? '';
    final convId    = data['id'] as String? ?? '';
    // ✅ BUG-PAT-01: استخدام المساعد getLastMessagePreview بدلاً من عرض URL خام
    final lastMsg   = getLastMessagePreview(data);
    final unread    = data['unread_count'] as int? ?? 0;
    final hasUnread = unread > 0;
    final score     = (data['sentiment_score'] as int?) ?? 5;
    final dotColor  = score >= 7 ? const Color(0xFF4CAF50) : score >= 4 ? const Color(0xFFFF9800) : const Color(0xFFF44336);

    // ✅ وقت نسبي بالعربية
    final timeStr = getArabicRelativeTime(data['last_message_at'] as String?);

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
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: hasUnread ? kAdminTeal : Colors.grey.shade100,
            width: hasUnread ? 1.5 : 1,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: ListTile(
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          leading: Stack(
            children: [
              CircleAvatar(
                radius: 26,
                backgroundColor: kAdminTeal.withValues(alpha: 0.12),
                child: Text(
                  name.isNotEmpty ? name[0] : 'م',
                  style: GoogleFonts.cairo(
                      color: kAdminTeal,
                      fontWeight: FontWeight.bold,
                      fontSize: 20),
                ),
              ),
              // مؤشر الحالة
              Positioned(
                bottom: 0,
                right: 0,
                child: Container(
                  width: 13,
                  height: 13,
                  decoration: BoxDecoration(
                    color: dotColor,
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 1.5),
                  ),
                ),
              ),
            ],
          ),
          title: Row(
            children: [
              Expanded(
                child: Text(
                  name,
                  style: GoogleFonts.cairo(
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                    color: Colors.black87,
                  ),
                ),
              ),
              if (hasUnread)
                Container(
                  margin: const EdgeInsets.only(left: 6),
                  padding: const EdgeInsets.symmetric(
                      horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: Colors.redAccent,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '$unread',
                    style: const TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.bold),
                  ),
                ),
            ],
          ),
          subtitle: Text(
            lastMsg,
            style: GoogleFonts.tajawal(
              color: hasUnread ? Colors.black87 : Colors.grey.shade500,
              fontWeight:
                  hasUnread ? FontWeight.w600 : FontWeight.normal,
              fontSize: 12.5,
            ),
          ),
          trailing: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              if (timeStr.isNotEmpty)
                Text(timeStr,
                    style: GoogleFonts.tajawal(
                        color: hasUnread ? kAdminTeal : Colors.grey.shade400,
                        fontSize: 10.5,
                        fontWeight: hasUnread
                            ? FontWeight.bold
                            : FontWeight.normal)),
              const SizedBox(height: 4),
              // ✅ BUG-PAT-03: chevron_left صحيح لـ RTL (يظهر باتجاه الدخول)
              Icon(Icons.chevron_left_rounded,
                  color: kAdminTeal.withValues(alpha: 0.6)),
            ],
          ),
        ),
      ),
    );
  }
}
