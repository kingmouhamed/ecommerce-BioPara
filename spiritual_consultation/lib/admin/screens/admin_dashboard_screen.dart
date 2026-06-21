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
        return AdminHomeTab(
          onViewAllPatients: () => _onTabChanged(1),
          onViewAppointments: () => _onTabChanged(2),
          onViewReports: () => _onTabChanged(3),
        );
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

  void _confirmSignOut(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(
          'خروج',
          style: GoogleFonts.cairo(fontWeight: FontWeight.bold),
        ),
        content: const Text('هل تريد تسجيل الخروج؟'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
            onPressed: () {
              Navigator.pop(context);
              Supabase.instance.client.auth.signOut();
            },
            child: const Text('خروج', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomNavBar(int unread) {
    return Container(
      decoration: BoxDecoration(
        color: kAdminPrimary,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.2),
            blurRadius: 12,
            offset: const Offset(0, -3),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            _BottomNavItem(
              icon: Icons.space_dashboard_rounded,
              label: 'الرئيسية',
              selected: _selectedIndex == 0,
              onTap: () => _onTabChanged(0),
            ),
            _BottomNavItem(
              icon: Icons.groups_rounded,
              label: 'المرضى',
              selected: _selectedIndex == 1,
              badge: unread,
              onTap: () => _onTabChanged(1),
            ),
            _BottomNavItem(
              icon: Icons.event_note_rounded,
              label: 'المواعيد',
              selected: _selectedIndex == 2,
              onTap: () => _onTabChanged(2),
            ),
            _BottomNavItem(
              icon: Icons.analytics_rounded,
              label: 'التقارير',
              selected: _selectedIndex == 3,
              onTap: () => _onTabChanged(3),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final unreadAsync = ref.watch(adminUnreadProvider);
    final unread = unreadAsync.valueOrNull ?? 0;

    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 600;
    final railWidth = screenWidth < 400 ? 70.0 : 80.0;

    return Scaffold(
      backgroundColor: kAdminBg,
      // ✅ BottomNavigationBar — mobile only
      bottomNavigationBar: isMobile ? _buildBottomNavBar(unread) : null,
      appBar: isMobile
          ? AppBar(
              backgroundColor: kAdminPrimary,
              elevation: 0,
              title: Text(
                'لوحة التحكم',
                style: GoogleFonts.cairo(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
              centerTitle: true,
              actions: [
                IconButton(
                  icon: const Icon(Icons.logout_rounded, color: Colors.white),
                  onPressed: () => _confirmSignOut(context),
                ),
              ],
            )
          : null,
      body: SafeArea(
        bottom: false, // let BottomNavBar handle bottom
        child: Row(
          children: [
            // ✅ Content — always fills available space
            Expanded(
              child: FadeTransition(
                opacity: _fadeAnim,
                child: _buildContent(),
              ),
            ),

            // ✅ Sidebar Rail — tablet/desktop only
            if (!isMobile) ...[
              const VerticalDivider(
                width: 1,
                thickness: 1,
                color: Colors.black12,
              ),
              _AdminNavRail(
                width: railWidth,
                selectedIndex: _selectedIndex,
                unreadCount: unread,
                onDestinationSelected: _onTabChanged,
                onSignOut: () => _confirmSignOut(context),
              ),
            ],
          ],
        ),
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
  final VoidCallback onSignOut;

  const _AdminNavRail({
    required this.width,
    required this.selectedIndex,
    required this.unreadCount,
    required this.onDestinationSelected,
    required this.onSignOut,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      decoration: const BoxDecoration(
        color: kAdminPrimary,
        boxShadow: [
          BoxShadow(
            color: Colors.black26,
            blurRadius: 10,
            offset: Offset(-2, 0),
          ),
        ],
      ),
      child: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 20),

            // صورة المدير الشخصية
            Container(
              width: width * 0.6,
              height: width * 0.6,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: kAdminGold.withValues(alpha: 0.5),
                  width: 1.5,
                ),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: Image.asset('assets/images/King.png', fit: BoxFit.cover),
              ),
            ),
            const SizedBox(height: 30),

            // الأيقونات
            _NavItem(
              icon: Icons.space_dashboard_rounded,
              label: 'الرئيسية',
              index: 0,
              width: width,
              selected: selectedIndex == 0,
              onTap: onDestinationSelected,
            ),
            _NavItem(
              icon: Icons.groups_rounded,
              label: 'المرضى',
              index: 1,
              width: width,
              selected: selectedIndex == 1,
              badge: unreadCount,
              onTap: onDestinationSelected,
            ),
            _NavItem(
              icon: Icons.event_note_rounded,
              label: 'المواعيد',
              index: 2,
              width: width,
              selected: selectedIndex == 2,
              onTap: onDestinationSelected,
            ),
            _NavItem(
              icon: Icons.analytics_rounded,
              label: 'التقارير',
              index: 3,
              width: width,
              selected: selectedIndex == 3,
              onTap: onDestinationSelected,
            ),

            const Spacer(),

            // خروج
            Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: IconButton(
                icon: const Icon(
                  Icons.logout_rounded,
                  color: Colors.redAccent,
                  size: 24,
                ),
                onPressed: onSignOut,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final int index;
  final bool selected;
  final int? badge;
  final double width;
  final ValueChanged<int> onTap;
  
  const _NavItem({
    required this.icon,
    required this.label,
    required this.index,
    required this.selected,
    required this.onTap,
    required this.width,
    this.badge,
  });

  @override
  Widget build(BuildContext context) {
    // ✅ Custom sizing based on Rail width (FIX-05)
    final iconSize = width > 75 ? 26.0 : 22.0;
    final labelSize = width > 75 ? 10.0 : 9.0;

    return ConstrainedBox(
      constraints: const BoxConstraints(minHeight: 60), // ✅ minimum touch target
      child: InkWell(
        onTap: () => onTap(index),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          width: width,
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            color: selected ? Colors.white12 : Colors.transparent,
            border: selected
                ? const Border(right: BorderSide(color: kAdminGold, width: 3))
                : null,
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Stack(
                clipBehavior: Clip.none,
                children: [
                  Icon(
                    icon,
                    color: selected ? kAdminGold : Colors.white60,
                    size: iconSize,
                  ),
                  if (badge != null && badge! > 0)
                    Positioned(
                      top: -5,
                      right: -8,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(
                          color: Colors.redAccent,
                          shape: BoxShape.circle,
                        ),
                        child: Text(
                          badge! > 99 ? '99+' : '$badge',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 8,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 4),
              Text(
                label,
                style: GoogleFonts.tajawal(
                  color: selected ? kAdminGold : Colors.white60,
                  fontSize: labelSize,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ── عنصر التنقل السفلي للهواتف ───────────────────────────────────
class _BottomNavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool selected;
  final int? badge;
  final VoidCallback onTap;

  const _BottomNavItem({
    required this.icon,
    required this.label,
    required this.selected,
    required this.onTap,
    this.badge,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        splashColor: Colors.white12,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            border: selected
                ? const Border(top: BorderSide(color: kAdminGold, width: 2.5))
                : null,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Stack(
                clipBehavior: Clip.none,
                children: [
                  Icon(
                    icon,
                    size: 26, // ✅ Larger icon for mobile touch target
                    color: selected ? kAdminGold : Colors.white60,
                  ),
                  if (badge != null && badge! > 0)
                    Positioned(
                      top: -6,
                      right: -10,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(
                          color: Colors.redAccent,
                          shape: BoxShape.circle,
                        ),
                        child: Text(
                          badge! > 99 ? '99+' : '$badge',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 3),
              Text(
                label,
                style: GoogleFonts.tajawal(
                  fontSize: 11, // ✅ Readable label size
                  color: selected ? kAdminGold : Colors.white60,
                  fontWeight: selected ? FontWeight.bold : FontWeight.normal,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
