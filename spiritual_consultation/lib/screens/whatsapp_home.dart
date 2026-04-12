import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'call_screen.dart';
import 'settings_screen.dart';
import 'select_contact_screen.dart';
import '../widgets/status_tab_content.dart';
import '../widgets/calls_tab_content.dart';
import '../widgets/conversations_tab_content.dart';
import '../widgets/camera_tab_content.dart';

class WhatsAppHome extends ConsumerStatefulWidget {
  final String userId;
  const WhatsAppHome({super.key, required this.userId});

  @override
  ConsumerState<WhatsAppHome> createState() => _WhatsAppHomeState();
}

class _WhatsAppHomeState extends ConsumerState<WhatsAppHome>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // ألوان BioPara
  static const Color primaryGreen = Color(0xFF2E7D32);
  static const Color accentGreen  = Color(0xFF4CAF50);

  // بحث
  bool _isSearching = false;
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this, initialIndex: 1);
    _tabController.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  // ─── AppBar Actions ─────────────────────────────────────

  void _toggleSearch() {
    setState(() {
      _isSearching = !_isSearching;
      if (!_isSearching) _searchController.clear();
    });
  }

  void _showMoreMenu(BuildContext context) {
    final RenderBox button = context.findRenderObject() as RenderBox;
    final RenderBox overlay =
        Overlay.of(context).context.findRenderObject() as RenderBox;
    final RelativeRect position = RelativeRect.fromRect(
      Rect.fromPoints(
        button.localToGlobal(Offset.zero, ancestor: overlay),
        button.localToGlobal(button.size.bottomRight(Offset.zero),
            ancestor: overlay),
      ),
      Offset.zero & overlay.size,
    );
    final navigator = Navigator.of(context);
    showMenu(
      context: context,
      position: position,
      items: [
        const PopupMenuItem(value: 'new_group', child: Text('مجموعة جديدة')),
        const PopupMenuItem(value: 'settings',  child: Text('الإعدادات')),
        const PopupMenuItem(value: 'logout',    child: Text('تسجيل الخروج')),
      ],
    ).then((value) {
      if (value == 'logout') {
        Supabase.instance.client.auth.signOut();
      } else if (value == 'settings') {
        if (!mounted) return;
        navigator.push(MaterialPageRoute(builder: (_) => const SettingsScreen()));
      }
      // Non-logout items: we purposefully ignore context here
      // since it's informational only and mounted check is in place
    });
  }

  // ─── FAB Actions ────────────────────────────────────────

  void _onChatsFAB() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => const SelectContactScreen(),
      ),
    );
  }

  void _onStatusCameraFAB() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('📸 ميزة الحالة قريباً!'),
        backgroundColor: primaryGreen,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _onStatusEditFAB() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('✏️ إضافة حالة نصية قريباً!'),
        backgroundColor: primaryGreen,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _onCallsFAB() {
    final userId = Supabase.instance.client.auth.currentUser?.id;
    if (userId == null) return;

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => CallScreen(
          callID:      widget.userId,
          userID:      userId,
          userName:    'المستخدم',
          isVideoCall: false,
        ),
      ),
    );
  }

  // ─── Build ───────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: _isSearching ? _buildSearchBar() : _buildMainAppBar(),
      body: TabBarView(
        controller: _tabController,
        physics: const NeverScrollableScrollPhysics(),
        children: [
          // Tab 0 — Active Camera
          const CameraTabContent(),
          // Tab 1 — Chats (List of all conversations)
          ConversationsTabContent(searchQuery: _searchController.text),
          // Tab 2 — Status (Updates)
          const StatusTabContent(),
          // Tab 3 — Calls (History)
          const CallsTabContent(),
        ],
      ),
      floatingActionButton: _buildFAB(),
    );
  }

  // ─── AppBar Variants ─────────────────────────────────────

  AppBar _buildMainAppBar() {
    return AppBar(
      backgroundColor: primaryGreen,
      elevation: 1,
      title: const Text(
        'BioPara',
        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.search, color: Colors.white),
          tooltip: 'بحث',
          onPressed: _toggleSearch,
        ),
        Builder(
          builder: (ctx) => IconButton(
            icon: const Icon(Icons.more_vert, color: Colors.white),
            tooltip: 'المزيد',
            onPressed: () => _showMoreMenu(ctx),
          ),
        ),
      ],
      bottom: TabBar(
        controller: _tabController,
        indicatorColor: Colors.white,
        indicatorWeight: 3,
        labelColor: Colors.white,
        unselectedLabelColor: Colors.white.withValues(alpha: 0.7),
        isScrollable: false,
        tabs: const [
          Tab(icon: Icon(Icons.camera_alt, size: 20)),
          Tab(text: 'الدردشات'),
          Tab(text: 'المستجدات'),
          Tab(text: 'المكالمات'),
        ],
      ),
    );
  }

  AppBar _buildSearchBar() {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 1,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back, color: primaryGreen),
        onPressed: _toggleSearch,
      ),
      title: TextField(
        controller: _searchController,
        autofocus: true,
        textDirection: TextDirection.rtl,
        decoration: const InputDecoration(
          hintText: 'بحث في المحادثات...',
          border: InputBorder.none,
          hintStyle: TextStyle(color: Colors.grey),
        ),
        onChanged: (val) => setState(() {}),
      ),
      actions: [
        if (_searchController.text.isNotEmpty)
          IconButton(
            icon: const Icon(Icons.clear, color: Colors.grey),
            onPressed: () => setState(() => _searchController.clear()),
          ),
      ],
    );
  }

  // ─── Placeholder Widget ──────────────────────────────────

  Widget _buildPlaceholder({required IconData icon, required String label}) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: accentGreen.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, size: 60, color: accentGreen.withValues(alpha: 0.6)),
          ),
          const SizedBox(height: 20),
          Text(
            label,
            style: const TextStyle(
              color: Colors.grey,
              fontSize: 18,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  // ─── Contextual FAB ──────────────────────────────────────

  Widget? _buildFAB() {
    switch (_tabController.index) {
      case 0: // Camera
        return null;

      case 1: // Chats → open chat
        return FloatingActionButton(
          backgroundColor: accentGreen,
          tooltip: 'محادثة جديدة',
          onPressed: _onChatsFAB,
          child: const Icon(Icons.message, color: Colors.white),
        );

      case 2: // Status → two FABs
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            FloatingActionButton(
              mini: true,
              backgroundColor: Colors.white,
              tooltip: 'حالة نصية',
              heroTag: 'status_edit',
              onPressed: _onStatusEditFAB,
              child: const Icon(Icons.edit, color: primaryGreen),
            ),
            const SizedBox(height: 12),
            FloatingActionButton(
              backgroundColor: accentGreen,
              tooltip: 'إضافة حالة',
              heroTag: 'status_camera',
              onPressed: _onStatusCameraFAB,
              child: const Icon(Icons.camera_alt, color: Colors.white),
            ),
          ],
        );

      case 3: // Calls → start call
        return FloatingActionButton(
          backgroundColor: accentGreen,
          tooltip: 'مكالمة جديدة',
          onPressed: _onCallsFAB,
          child: const Icon(Icons.add_call, color: Colors.white),
        );

      default:
        return null;
    }
  }
}
