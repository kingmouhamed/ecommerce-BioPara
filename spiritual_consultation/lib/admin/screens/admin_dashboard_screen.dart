// lib/screens/admin_dashboard_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'admin_home_tab.dart';
import 'admin_patients_tab.dart';
import 'admin_appointments_tab.dart';
import 'admin_reports_tab.dart';
import 'admin_shared_constants.dart';

// Provider لمشاركة التبويب المحدد عبر الشاشات
final selectedTabProvider = StateProvider<int>((ref) => 0);


// ══════════════════════════════════════════════════════════════════
class AdminDashboardScreen extends ConsumerStatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  ConsumerState<AdminDashboardScreen> createState() =>
      _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends ConsumerState<AdminDashboardScreen>
    with SingleTickerProviderStateMixin {
  int _selectedIndex = 0;
  late final AnimationController _fadeCtrl;
  late final Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _fadeCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 280),
    );
    _fadeAnim = CurvedAnimation(parent: _fadeCtrl, curve: Curves.easeInOut);
    _fadeCtrl.forward();
  }

  @override
  void dispose() {
    _fadeCtrl.dispose();
    super.dispose();
  }

  void _onTabChanged(int index) {
    if (index == _selectedIndex) return;
    _fadeCtrl.reverse().then((_) {
      setState(() => _selectedIndex = index);
      _fadeCtrl.forward();
    });
  }

  Widget _buildContent() {
    switch (_selectedIndex) {
      case 0:
        return AdminHomeTab(onViewAllPatients: () => _onTabChanged(1));
      case 1:
        return const AdminPatientsTab();
      case 2:
        return const AdminAppointmentsTab();
      case 3:
        return const AdminReportsTab();
      default:
        return const SizedBox.shrink();
    }
  }

  @override
  Widget build(BuildContext context) {
    final unreadAsync = ref.watch(adminUnreadProvider);
    final unread = unreadAsync.valueOrNull ?? 0;
    
    // ✅ تجاوب القائمة الجانبية: تصبح أصغر على الشاشات الصغيرة جداً
    final screenWidth = MediaQuery.of(context).size.width;
    final railWidth = screenWidth < 400 ? 70.0 : 80.0;

    return Scaffold(
      backgroundColor: kAdminBg,
      body: Row(
        children: [
          // ── المحتوى ──
          Expanded(
            child: FadeTransition(
              opacity: _fadeAnim,
              child: _buildContent(),
            ),
          ),

          const VerticalDivider(width: 1, thickness: 1, color: Colors.black12),

          // ── القائمة الجانبية (Navigation Rail) ──
          _AdminNavRail(
            width: railWidth,
            selectedIndex: _selectedIndex,
            unreadCount: unread,
            onDestinationSelected: _onTabChanged,
          ),
        ],
      ),
    );
  }
}

// ── شريط التنقل الجانبي ───────────────────────────────────────────
class _AdminNavRail extends StatelessWidget {
  final double width;
  final int selectedIndex;
  final int unreadCount;
  final ValueChanged<int> onDestinationSelected;

  const _AdminNavRail({
    required this.width,
    required this.selectedIndex,
    required this.unreadCount,
    required this.onDestinationSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      decoration: const BoxDecoration(
        color: kAdminPrimary,
        boxShadow: [
          BoxShadow(color: Colors.black26, blurRadius: 10, offset: Offset(-2, 0)),
        ],
      ),
      child: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 20),

            // شعار صغير
            Container(
              width: width * 0.6, height: width * 0.6,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.spa_rounded, color: kAdminGold, size: 28),
            ),
            const SizedBox(height: 30),

            // الأيقونات
            _NavItem(icon: Icons.dashboard_rounded, label: 'الرئيسية', index: 0, width: width, selected: selectedIndex == 0, onTap: onDestinationSelected),
            _NavItem(icon: Icons.people_rounded, label: 'المرضى', index: 1, width: width, selected: selectedIndex == 1, badge: unreadCount, onTap: onDestinationSelected),
            _NavItem(icon: Icons.calendar_today_rounded, label: 'المواعيد', index: 2, width: width, selected: selectedIndex == 2, onTap: onDestinationSelected),
            _NavItem(icon: Icons.bar_chart_rounded, label: 'التقارير', index: 3, width: width, selected: selectedIndex == 3, onTap: onDestinationSelected),

            const Spacer(),

            // خروج
            Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: IconButton(
                icon: const Icon(Icons.logout_rounded, color: Colors.redAccent, size: 24),
                onPressed: () => _confirmSignOut(context),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _confirmSignOut(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text('خروج', style: GoogleFonts.cairo(fontWeight: FontWeight.bold)),
        content: const Text('هل تريد تسجيل الخروج؟'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('إلغاء')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
            onPressed: () { Navigator.pop(context); Supabase.instance.client.auth.signOut(); },
            child: const Text('خروج', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon; final String label; final int index; final bool selected; final int? badge; final double width;
  final ValueChanged<int> onTap;
  const _NavItem({required this.icon, required this.label, required this.index, required this.selected, required this.onTap, required this.width, this.badge});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => onTap(index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: width, padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: selected ? Colors.white12 : Colors.transparent,
          border: selected ? const Border(right: BorderSide(color: kAdminGold, width: 3)) : null,
        ),
        child: Column(children: [
          Stack(clipBehavior: Clip.none, children: [
            Icon(icon, color: selected ? kAdminGold : Colors.white60, size: 24),
            if (badge != null && badge! > 0)
              Positioned(top: -5, right: -8, child: Container(
                padding: const EdgeInsets.all(4), decoration: const BoxDecoration(color: Colors.redAccent, shape: BoxShape.circle),
                child: Text('$badge', style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold)),
              )),
          ]),
          const SizedBox(height: 4),
          Text(label, style: GoogleFonts.tajawal(color: selected ? kAdminGold : Colors.white60, fontSize: 9)),
        ]),
      ),
    );
  }
}
