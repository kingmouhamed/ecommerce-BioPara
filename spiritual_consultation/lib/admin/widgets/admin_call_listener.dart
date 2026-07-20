// lib/admin/widgets/admin_call_listener.dart
// ═══════════════════════════════════════════════════════════
//  BioPara — مستمع المكالمات العام لتطبيق المسؤول (Windows/سطح المكتب)
//
//  يلتقط أي دعوة مكالمة (call_invite) واردة من المرضى عبر Supabase،
//  مهما كانت الشاشة الحالية (Dashboard, Products, Reports...)، ويعرض
//  CallOverlay (شاشة قبول/رفض) فوق كل شيء.
//
//  لا يعمل على الموبايل: هناك ZegoCloud يتكفّل بالاستقبال العام أصلاً،
//  وشاشة المحادثة تتكفّل بحالة Jitsi النادرة. هذا يمنع ازدواج العرض.
// ═══════════════════════════════════════════════════════════
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../../core/services/zego_call_service.dart';
import '../../patient/screens/call_overlay.dart';

class AdminCallListener extends StatefulWidget {
  final Widget child;
  const AdminCallListener({super.key, required this.child});

  @override
  State<AdminCallListener> createState() => _AdminCallListenerState();
}

class _AdminCallListenerState extends State<AdminCallListener> {
  final _supabase = Supabase.instance.client;
  RealtimeChannel? _sub;
  final Set<String> _processed = {};
  bool _overlayOpen = false;

  @override
  void initState() {
    super.initState();
    // فقط على سطح المكتب/Windows/الويب — الموبايل يستعمل Zego.
    if (!ZegoCallService.isSupportedPlatform) {
      _subscribe();
    }
  }

  void _subscribe() {
    final adminId = _supabase.auth.currentUser?.id;
    _sub = _supabase
        .channel('admin_global_incoming_calls')
        .onPostgresChanges(
          event: PostgresChangeEvent.insert,
          schema: 'public',
          table: 'messages',
          callback: (payload) {
            final msg = payload.newRecord;
            final type = msg['message_type'] as String? ?? '';
            final status = msg['status'] as String? ?? '';
            final senderId = msg['sender_id'] as String? ?? '';
            final msgId = msg['id'] as String? ?? '';

            final isCallInvite = type == 'call_invite' || type == 'callInvite';
            if (!isCallInvite ||
                status != 'ringing' ||
                senderId == adminId ||
                msgId.isEmpty ||
                _processed.contains(msgId)) {
              return;
            }

            _processed.add(msgId);
            _showIncoming(msg);
          },
        )
        .subscribe();
  }

  void _showIncoming(Map<String, dynamic> msg) {
    if (_overlayOpen || !mounted) return;

    final msgId = msg['id'] as String? ?? '';
    final convId = msg['conversation_id'] as String? ?? '';
    final content = msg['content'] as String? ?? '';
    final isVideo = content.contains('فيديو') || content.contains('video');
    if (convId.isEmpty) return;

    // اسم المريض من الـ metadata إن وُجد، وإلا اسم عام.
    String patientName = 'مريض';
    final meta = msg['metadata'];
    if (meta is Map && meta['caller_name'] is String) {
      patientName = meta['caller_name'] as String;
    }

    _overlayOpen = true;
    final navigator = ZegoCallService.navigatorKey.currentState ??
        Navigator.of(context, rootNavigator: true);

    navigator
        .push(
      MaterialPageRoute(
        fullscreenDialog: true,
        builder: (_) => CallOverlay(
          name: patientName,
          callId: msgId,
          conversationId: convId,
          initialMode: CallMode.incoming,
          isVideo: isVideo,
        ),
      ),
    )
        .whenComplete(() {
      _overlayOpen = false;
    });
  }

  @override
  void dispose() {
    _sub?.unsubscribe();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => widget.child;
}
