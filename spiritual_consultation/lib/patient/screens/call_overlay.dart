// lib/patient/screens/call_overlay.dart
// ═══════════════════════════════════════════════════════════
//  BioPara — نظام مكالمات حقيقي (صوت + فيديو) مثل WhatsApp
//  يعتمد على Jitsi Meet للصوت/الفيديو الفعلي عبر WebRTC
// ═══════════════════════════════════════════════════════════
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:uuid/uuid.dart';
import 'dart:async';

import 'call_bridge.dart' as call_bridge;

enum CallMode { outgoing, incoming, active }

class CallOverlay extends StatefulWidget {
  final String name;
  final String callId;
  final String conversationId;
  final CallMode initialMode;
  final bool isVideo;
  final VoidCallback? onEnd;

  const CallOverlay({
    super.key,
    required this.name,
    required this.callId,
    required this.conversationId,
    required this.initialMode,
    this.isVideo = false,
    this.onEnd,
  });

  @override
  State<CallOverlay> createState() => _CallOverlayState();
}

class _CallOverlayState extends State<CallOverlay> with SingleTickerProviderStateMixin {
  late CallMode _mode;
  bool _isMuted = false;
  bool _isVideoOff = false;
  bool _jitsiStarted = false;

  // Timer for active call duration
  Timer? _durationTimer;
  int _durationSecs = 0;

  // Polling timer — fallback in case realtime misses the event
  Timer? _pollTimer;

  // Timeout for unanswered outgoing calls (60 seconds)
  Timer? _ringTimeout;

  // Animation controller for pulsing calling avatar
  late AnimationController _pulseController;

  // Supabase instance and real-time subscription
  final _supabase = Supabase.instance.client;
  RealtimeChannel? _channel;

  bool _disposed = false;

  @override
  void initState() {
    super.initState();
    _mode = widget.initialMode;

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);

    if (_mode == CallMode.active) {
      _startDurationTimer();
      _launchJitsi();
    }

    // ── Auto-cancel outgoing calls after 60s with no answer ──
    if (_mode == CallMode.outgoing) {
      _ringTimeout = Timer(const Duration(seconds: 60), () {
        if (mounted && !_disposed && _mode == CallMode.outgoing) {
          _cancelCall();
        }
      });
    }

    // ── Realtime: listen for call state changes ──
    _channel = _supabase
        .channel('call_state_${widget.callId}')
        .onPostgresChanges(
          event: PostgresChangeEvent.insert,
          schema: 'public',
          table: 'messages',
          filter: PostgresChangeFilter(
            type: PostgresChangeFilterType.eq,
            column: 'conversation_id',
            value: widget.conversationId,
          ),
          callback: (payload) => _handleCallEvent(payload.newRecord),
        );
    _channel?.subscribe();

    // ── Polling fallback (every 2s) — handles missed realtime events ──
    if (_mode != CallMode.active) {
      _pollTimer = Timer.periodic(const Duration(seconds: 2), (_) => _pollCallStatus());
    }
  }

  // ────────────────────────────────────────────────────────────
  // Handle incoming call event (realtime or poll)
  // ────────────────────────────────────────────────────────────
  void _handleCallEvent(Map<String, dynamic> msg) {
    if (_disposed || !mounted) return;
    final type = msg['message_type'] as String? ?? '';

    // Check call_id from metadata (primary) or content (fallback)
    final rawMeta = msg['metadata'];
    final metadata = rawMeta is Map<String, dynamic> ? rawMeta : <String, dynamic>{};
    final callIdFromMeta = metadata['call_id'] as String? ?? '';
    final content = msg['content'] as String? ?? '';

    // Only process events for THIS call
    if (callIdFromMeta != widget.callId && content != widget.callId) return;

    if (type == 'call_accept' && _mode != CallMode.active) {
      _pollTimer?.cancel();
      _ringTimeout?.cancel();
      setState(() => _mode = CallMode.active);
      _startDurationTimer();
      _launchJitsi();
    } else if (type == 'call_decline' || type == 'call_cancel' || type == 'call_end') {
      _pollTimer?.cancel();
      _ringTimeout?.cancel();
      _endJitsi();
      _exit();
    }
  }

  // ────────────────────────────────────────────────────────────
  // Poll Supabase for latest call status (fallback)
  // ────────────────────────────────────────────────────────────
  Future<void> _pollCallStatus() async {
    if (_disposed || !mounted || _mode == CallMode.active) return;
    try {
      final rows = await _supabase
          .from('messages')
          .select('message_type, content, metadata')
          .eq('conversation_id', widget.conversationId)
          .inFilter('message_type', ['call_accept', 'call_decline', 'call_cancel', 'call_end'])
          .order('created_at', ascending: false)
          .limit(5);

      if (rows.isEmpty) return;

      // Find the event matching our callId (check metadata.call_id or content)
      for (final row in rows) {
        final meta = row['metadata'];
        final metaMap = meta is Map<String, dynamic> ? meta : <String, dynamic>{};
        final callIdFromMeta = metaMap['call_id'] as String? ?? '';
        final content = row['content'] as String? ?? '';
        if (callIdFromMeta == widget.callId || content == widget.callId) {
          _handleCallEvent(row);
          return;
        }
      }
    } catch (_) {}
  }

  // ────────────────────────────────────────────────────────────
  // Jitsi Meet — real audio/video via JS bridge
  // ────────────────────────────────────────────────────────────
  void _launchJitsi() {
    if (!kIsWeb || _jitsiStarted) return;
    _jitsiStarted = true;

    // Register JS callback for when Jitsi ends
    call_bridge.setJitsiCallEndedCallback(() {
      if (mounted && !_disposed) _endCall();
    });

    // Build a short, alphanumeric room name from callId
    final roomName = 'biopara-${widget.callId.replaceAll('-', '').substring(0, 16)}';
    final displayName = widget.name;
    final isVideo = widget.isVideo;

    try {
      call_bridge.startJitsiCall(roomName, displayName, isVideo);
    } catch (e) {
      debugPrint('⚠️ Jitsi launch error: $e');
    }
  }

  void _endJitsi() {
    if (!kIsWeb || !_jitsiStarted) return;
    try {
      call_bridge.endJitsiCall();
    } catch (_) {}
    _jitsiStarted = false;
  }

  void _toggleJitsiMute() {
    if (!kIsWeb) return;
    final newMuted = !_isMuted;
    setState(() => _isMuted = newMuted);
    try {
      call_bridge.muteJitsiAudio(newMuted);
    } catch (_) {}
  }

  void _toggleJitsiVideo() {
    if (!kIsWeb) return;
    try {
      call_bridge.toggleJitsiVideo();
    } catch (_) {}
    setState(() => _isVideoOff = !_isVideoOff);
  }

  // ────────────────────────────────────────────────────────────
  // Timers
  // ────────────────────────────────────────────────────────────
  void _startDurationTimer() {
    _durationTimer?.cancel();
    _durationSecs = 0;
    _durationTimer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (mounted) setState(() => _durationSecs++);
    });
  }

  // ────────────────────────────────────────────────────────────
  // Cleanup
  // ────────────────────────────────────────────────────────────
  void _cleanup() {
    if (_disposed) return;
    _disposed = true;
    _durationTimer?.cancel();
    _pollTimer?.cancel();
    _ringTimeout?.cancel();
    if (_pulseController.isAnimating) _pulseController.stop();
    _pulseController.dispose();
    _channel?.unsubscribe();
    _channel = null;
    _endJitsi();
  }

  void _exit() {
    if (!mounted) return;
    _cleanup();
    Navigator.of(context).pop();
    widget.onEnd?.call();
  }

  @override
  void dispose() {
    _cleanup();
    super.dispose();
  }

  // ────────────────────────────────────────────────────────────
  // Actions
  // ────────────────────────────────────────────────────────────

  Future<void> _cancelCall() async {
    _pollTimer?.cancel();
    try {
      await _supabase.from('messages').insert({
        'id': const Uuid().v4(),
        'conversation_id': widget.conversationId,
        'sender_id': _supabase.auth.currentUser?.id ?? 'caller',
        'content': widget.isVideo ? 'مكالمة فيديو ملغاة' : 'مكالمة صوتية ملغاة',
        'message_type': 'call_cancel',
        'status': 'cancelled',
        'metadata': {'call_id': widget.callId, 'call_status': 'cancelled'},
      });
    } catch (e) {
      debugPrint('Cancel call error: $e');
    }
    _exit();
  }

  Future<void> _declineCall() async {
    try {
      await _supabase.from('messages').insert({
        'id': const Uuid().v4(),
        'conversation_id': widget.conversationId,
        'sender_id': _supabase.auth.currentUser?.id ?? 'receiver',
        'content': widget.isVideo ? 'مكالمة فيديو مرفوضة' : 'مكالمة صوتية مرفوضة',
        'message_type': 'call_decline',
        'status': 'declined',
        'metadata': {'call_id': widget.callId, 'call_status': 'declined'},
      });
    } catch (e) {
      debugPrint('Decline call error: $e');
    }
    _exit();
  }

  Future<void> _acceptCall() async {
    try {
      await _supabase.from('messages').insert({
        'id': const Uuid().v4(),
        'conversation_id': widget.conversationId,
        'sender_id': _supabase.auth.currentUser?.id ?? 'receiver',
        'content': widget.isVideo ? 'قُبلت مكالمة الفيديو' : 'قُبلت المكالمة الصوتية',
        'message_type': 'call_accept',
        'status': 'accepted',
        'metadata': {'call_id': widget.callId, 'call_status': 'accepted'},
      });
      _pollTimer?.cancel();
      if (mounted) {
        setState(() => _mode = CallMode.active);
        _startDurationTimer();
        _launchJitsi();
      }
    } catch (e) {
      debugPrint('Accept call error: $e');
    }
  }

  Future<void> _endCall() async {
    _pollTimer?.cancel();
    _endJitsi();
    final dur = _fmt(Duration(seconds: _durationSecs));
    try {
      await _supabase.from('messages').insert({
        'id': const Uuid().v4(),
        'conversation_id': widget.conversationId,
        'sender_id': _supabase.auth.currentUser?.id ?? 'user',
        'content': widget.isVideo ? 'انتهت مكالمة الفيديو' : 'انتهت المكالمة الصوتية',
        'message_type': 'call_end',
        'status': 'ended',
        'metadata': {
          'call_id': widget.callId,
          'call_status': 'ended',
          'call_duration': dur,
        },
      });
      // تحديث رسالة الـ call_invite الأصلية لتمييزها كمنتهية
      await _supabase.from('messages').update({
        'metadata': {
          'call_status': 'ended',
          'call_duration': dur,
        }
      }).eq('id', widget.callId);
    } catch (e) {
      debugPrint('End call error: $e');
    }
    _exit();
  }

  String _fmt(Duration d) =>
      '${d.inMinutes.toString().padLeft(2, '0')}:${(d.inSeconds % 60).toString().padLeft(2, '0')}';

  // ────────────────────────────────────────────────────────────
  // Build
  // ────────────────────────────────────────────────────────────
  @override
  Widget build(BuildContext context) {
    const primary = Color(0xFF1E2D20);
    const primaryMid = Color(0xFF2D4A2E);
    const accent = Color(0xFF4CAF78);

    return Scaffold(
      backgroundColor: primary,
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              primary,
              primaryMid,
              const Color(0xFF1A2E1A),
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              const SizedBox(height: 56),

              // ── Call Status Badge ──────────────────────────────
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                decoration: BoxDecoration(
                  color: _mode == CallMode.active
                      ? accent.withValues(alpha: 0.2)
                      : Colors.white.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: _mode == CallMode.active
                        ? accent.withValues(alpha: 0.6)
                        : Colors.white24,
                    width: 1,
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      widget.isVideo ? Icons.videocam_rounded : Icons.call_rounded,
                      color: _mode == CallMode.active ? accent : Colors.white60,
                      size: 14,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      widget.isVideo ? 'مكالمة فيديو' : 'مكالمة صوتية',
                      style: GoogleFonts.tajawal(
                        color: _mode == CallMode.active ? accent : Colors.white60,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 40),

              // ── Avatar Pulsing ──────────────────────────────────
              AnimatedBuilder(
                animation: _pulseController,
                builder: (context, child) {
                  final scale = _mode == CallMode.active
                      ? 1.0
                      : 1.0 + (_pulseController.value * 0.10);
                  final glowOpacity = _mode == CallMode.active
                      ? 0.15
                      : 0.15 + (_pulseController.value * 0.20);
                  final glowRadius = _mode == CallMode.active
                      ? 24.0
                      : 20.0 + (_pulseController.value * 20.0);

                  return Stack(
                    alignment: Alignment.center,
                    children: [
                      // Outer glow ring
                      if (_mode != CallMode.active)
                        Transform.scale(
                          scale: scale * 1.25,
                          child: Container(
                            width: 136,
                            height: 136,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: accent.withValues(alpha: glowOpacity * 0.5),
                                width: 2,
                              ),
                            ),
                          ),
                        ),
                      // Main avatar
                      Transform.scale(
                        scale: scale,
                        child: Container(
                          width: 120,
                          height: 120,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: Colors.white.withValues(alpha: 0.12),
                            boxShadow: [
                              BoxShadow(
                                color: accent.withValues(alpha: glowOpacity),
                                blurRadius: glowRadius,
                                spreadRadius: 4,
                              ),
                            ],
                          ),
                          child: Center(
                            child: Text(
                              widget.name.isNotEmpty ? widget.name[0].toUpperCase() : '?',
                              style: TextStyle(
                                fontSize: 50,
                                color: Colors.white,
                                fontWeight: FontWeight.w300,
                                shadows: [
                                  Shadow(
                                    color: accent.withValues(alpha: 0.5),
                                    blurRadius: 12,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ),
                      // Active call: green ring
                      if (_mode == CallMode.active)
                        Container(
                          width: 128,
                          height: 128,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: accent, width: 2.5),
                          ),
                        ),
                    ],
                  );
                },
              ),

              const SizedBox(height: 28),

              // ── Name ────────────────────────────────────────────
              Text(
                widget.name,
                style: GoogleFonts.cairo(
                  fontSize: 28,
                  color: Colors.white,
                  fontWeight: FontWeight.w700,
                  letterSpacing: -0.5,
                ),
              ),

              const SizedBox(height: 8),

              // ── Status / Timer ──────────────────────────────────
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 400),
                child: Text(
                  key: ValueKey(_mode),
                  _mode == CallMode.outgoing
                      ? 'جاري الاتصال...'
                      : _mode == CallMode.incoming
                          ? (widget.isVideo ? 'مكالمة فيديو واردة...' : 'مكالمة صوتية واردة...')
                          : _fmt(Duration(seconds: _durationSecs)),
                  style: GoogleFonts.tajawal(
                    fontSize: 16,
                    color: _mode == CallMode.active
                        ? accent
                        : Colors.white54,
                    fontWeight: FontWeight.w500,
                    letterSpacing: _mode == CallMode.active ? 2.0 : 0.0,
                  ),
                ),
              ),

              // ── Signal quality dots (cosmetic) ──────────────────
              if (_mode == CallMode.active)
                Padding(
                  padding: const EdgeInsets.only(top: 10),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(4, (i) => Container(
                      margin: const EdgeInsets.symmetric(horizontal: 2),
                      width: 4,
                      height: 4 + i * 2.0,
                      decoration: BoxDecoration(
                        color: accent.withValues(alpha: 0.6 + i * 0.1),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    )),
                  ),
                ),

              const Spacer(),

              // ── Info banner for Jitsi (active call) ─────────────
              if (_mode == CallMode.active && kIsWeb)
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 32),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  decoration: BoxDecoration(
                    color: accent.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: accent.withValues(alpha: 0.3)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.open_in_new, color: accent, size: 14),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'تم فتح نافذة المكالمة — تحدث في نافذة Jitsi المفتوحة',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.tajawal(
                            color: accent,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

              const SizedBox(height: 20),

              // ── Control buttons ──────────────────────────────────
              Padding(
                padding: const EdgeInsets.only(bottom: 56),
                child: _buildControls(accent),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildControls(Color accent) {
    // OUTGOING: cancel
    if (_mode == CallMode.outgoing) {
      return Column(
        children: [
          _CircleBtn(
            icon: Icons.call_end_rounded,
            label: 'إلغاء',
            color: const Color(0xFFE53935),
            size: 72,
            iconSize: 32,
            onTap: _cancelCall,
          ),
          const SizedBox(height: 8),
          Text(
            'اضغط لإلغاء الاتصال',
            style: GoogleFonts.tajawal(color: Colors.white38, fontSize: 11),
          ),
        ],
      );
    }

    // INCOMING: accept + decline
    if (_mode == CallMode.incoming) {
      return Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          Column(
            children: [
              _CircleBtn(
                icon: widget.isVideo ? Icons.videocam_rounded : Icons.call_rounded,
                label: 'قبول',
                color: const Color(0xFF43A047),
                size: 72,
                iconSize: 32,
                onTap: _acceptCall,
              ),
            ],
          ),
          Column(
            children: [
              _CircleBtn(
                icon: Icons.call_end_rounded,
                label: 'رفض',
                color: const Color(0xFFE53935),
                size: 72,
                iconSize: 32,
                onTap: _declineCall,
              ),
            ],
          ),
        ],
      );
    }

    // ACTIVE CALL: mute + end + speaker/video
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _CircleBtn(
              icon: _isMuted ? Icons.mic_off_rounded : Icons.mic_rounded,
              label: _isMuted ? 'رفع الكتم' : 'كتم',
              isActive: _isMuted,
              onTap: _toggleJitsiMute,
            ),
            _CircleBtn(
              icon: Icons.call_end_rounded,
              label: 'إنهاء',
              color: const Color(0xFFE53935),
              size: 72,
              iconSize: 32,
              onTap: _endCall,
            ),
            if (widget.isVideo)
              _CircleBtn(
                icon: _isVideoOff ? Icons.videocam_off_rounded : Icons.videocam_rounded,
                label: _isVideoOff ? 'تشغيل كاميرا' : 'إيقاف كاميرا',
                isActive: _isVideoOff,
                onTap: _toggleJitsiVideo,
              ),
          ],
        ),
      ],
    );
  }
}

// ─── Reusable Circle Button ─────────────────────────────────
class _CircleBtn extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color? color;
  final bool isActive;
  final VoidCallback onTap;
  final double size;
  final double iconSize;

  const _CircleBtn({
    required this.icon,
    required this.label,
    this.color,
    this.isActive = false,
    required this.onTap,
    this.size = 60,
    this.iconSize = 26,
  });

  @override
  Widget build(BuildContext context) {
    const activeColor = Color(0xFF4CAF78);
    final bgColor = color ?? (isActive ? activeColor : Colors.white.withValues(alpha: 0.12));
    final iconColor = color != null ? Colors.white : (isActive ? Colors.white : Colors.white);

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        GestureDetector(
          onTap: onTap,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            width: size,
            height: size,
            decoration: BoxDecoration(
              color: bgColor,
              shape: BoxShape.circle,
              border: Border.all(
                color: isActive
                    ? activeColor.withValues(alpha: 0.6)
                    : Colors.white.withValues(alpha: 0.08),
                width: 1.5,
              ),
              boxShadow: [
                if (color != null)
                  BoxShadow(
                    color: color!.withValues(alpha: 0.35),
                    blurRadius: 16,
                    spreadRadius: 2,
                  ),
                if (isActive)
                  BoxShadow(
                    color: activeColor.withValues(alpha: 0.3),
                    blurRadius: 12,
                    spreadRadius: 1,
                  ),
              ],
            ),
            child: Icon(icon, color: iconColor, size: iconSize),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: GoogleFonts.tajawal(
            color: Colors.white54,
            fontSize: 11,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}
