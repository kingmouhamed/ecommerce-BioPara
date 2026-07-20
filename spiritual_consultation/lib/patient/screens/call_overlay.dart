// lib/patient/screens/call_overlay.dart
// ═══════════════════════════════════════════════════════════
//  BioPara — شاشة إشارة المكالمة (رنين / واردة / نشطة)
//
//  منطق الوسائط:
//    • Mobile (Android/iOS): عند القبول → pushReplacement إلى CallScreen
//      → ZegoUIKitPrebuiltCall يتكفل بـ room/streams/UI كاملاً
//      → onCallEnd callback يُرسل Supabase call_end عند الإغلاق
//    • Desktop (Windows):    ZegoExpressEngine مباشرة
//      → createEngineWithProfile → loginRoom → startPublishingStream
//      → onRoomStreamUpdate(Add) → startPlayingStream للصوت الوارد
//      → onRoomStreamUpdate(Delete) → stopPlayingStream + إنهاء المكالمة تلقائياً
// ═══════════════════════════════════════════════════════════
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/services.dart'; // HapticFeedback
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:uuid/uuid.dart';
import 'package:zego_express_engine/zego_express_engine.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:flutter_ringtone_player/flutter_ringtone_player.dart';
import 'dart:async';

import '../../core/config/app_config.dart';
import '../../core/services/zego_call_service.dart';
import 'call_screen.dart';

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

class _CallOverlayState extends State<CallOverlay>
    with SingleTickerProviderStateMixin {
  late CallMode _mode;
  bool _isMuted = false;
  bool _isVideoOff = false;
  bool _isSpeakerMuted = false;

  // ── Ringing ─────────────────────────────────────────────
  final _ringtonePlayer = FlutterRingtonePlayer();
  Timer? _ringTimer;


  // ── Zego desktop state ───────────────────────────────────
  bool _inZegoRoom = false;
  bool _zegoEngineCreatedByUs = false;
  // Tracks active remote stream IDs so we can stop them on leave
  // and detect when the remote party has disconnected.
  final Set<String> _remoteStreamIds = {};

  // Sanitized Zego IDs — computed once in initState
  late final String _zegoRoomId;
  late final String _zegoUserId;
  late final String _zegoStreamId;

  // ── Call UI timers ───────────────────────────────────────
  Timer? _durationTimer;
  int _durationSecs = 0;
  Timer? _pollTimer;
  Timer? _ringTimeout;

  late AnimationController _pulseController;

  final _supabase = Supabase.instance.client;
  RealtimeChannel? _channel;

  bool _disposed = false;

  // ─────────────────────────────────────────────────────────
  @override
  void initState() {
    super.initState();
    _mode = widget.initialMode;

    // Sanitize IDs: Zego only allows [a-zA-Z0-9_-]
    _zegoRoomId = widget.callId.replaceAll(RegExp(r'[^a-zA-Z0-9_\-]'), '_');
    // ⚠️ FIX: Always use the hardcoded adminUserId for the admin stream so
    // the patient side can deterministically resolve it.
    // If this overlay is shown on the patient side (incoming from admin),
    // the patient's own userId is used — but in practice CallOverlay is only
    // used for the admin (Windows) and the patient fallback overlay.
    // Using currentUser?.id here would produce a different streamID every
    // session and cause a permanent stream mismatch.
    _zegoUserId = ZegoCallService.adminUserId; // always 'biopara_admin'
    _zegoStreamId = '${_zegoRoomId}_$_zegoUserId';

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);

    if (_mode == CallMode.active) {
      _startDurationTimer();
      _onCallActive();
    }

    // ── Start ringing immediately ─────────────────────────
    if (_mode == CallMode.incoming || _mode == CallMode.outgoing) {
      _startRinging();
    }

    if (_mode == CallMode.outgoing) {
      _ringTimeout = Timer(const Duration(seconds: 60), () {
        if (mounted && !_disposed && _mode == CallMode.outgoing) {
          _cancelCall();
        }
      });
    }

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

    if (_mode != CallMode.active) {
      _pollTimer =
          Timer.periodic(const Duration(seconds: 2), (_) => _pollCallStatus());
    }
  }

  // ── Supabase Signaling ───────────────────────────────────

  void _handleCallEvent(Map<String, dynamic> msg) {
    if (_disposed || !mounted) return;
    final type = msg['message_type'] as String? ?? '';

    final rawMeta = msg['metadata'];
    final metadata =
        rawMeta is Map<String, dynamic> ? rawMeta : <String, dynamic>{};
    final callIdFromMeta = metadata['call_id'] as String? ?? '';
    final content = msg['content'] as String? ?? '';

    if (callIdFromMeta != widget.callId && content != widget.callId) return;

    if (type == 'call_accept' && _mode != CallMode.active) {
      _pollTimer?.cancel();
      _ringTimeout?.cancel();
      setState(() => _mode = CallMode.active);
      _startDurationTimer();
      _onCallActive();
    } else if (type == 'call_decline' ||
        type == 'call_cancel' ||
        type == 'call_end') {
      _pollTimer?.cancel();
      _ringTimeout?.cancel();
      _exit();
    }
  }

  Future<void> _pollCallStatus() async {
    if (_disposed || !mounted || _mode == CallMode.active) return;
    try {
      final rows = await _supabase
          .from('messages')
          .select('message_type, content, metadata')
          .eq('conversation_id', widget.conversationId)
          .inFilter('message_type',
              ['call_accept', 'call_decline', 'call_cancel', 'call_end'])
          .order('created_at', ascending: false)
          .limit(5);

      if (rows.isEmpty) return;

      for (final row in rows) {
        final meta = row['metadata'];
        final metaMap =
            meta is Map<String, dynamic> ? meta : <String, dynamic>{};
        final callIdFromMeta = metaMap['call_id'] as String? ?? '';
        final content = row['content'] as String? ?? '';
        if (callIdFromMeta == widget.callId || content == widget.callId) {
          _handleCallEvent(row);
          return;
        }
      }
    } catch (_) {}
  }

  // ── Ringing ───────────────────────────────────────────────

  /// Plays the device system ringtone (incoming) or notification tone (outgoing)
  /// on a loop, and triggers periodic haptic feedback on Android.
  /// On Windows this silently does nothing (platform not supported).
  void _startRinging() {
    if (ZegoCallService.isSupportedPlatform) {
      // Android / iOS: use the native system ringtone
      if (_mode == CallMode.incoming) {
        _ringtonePlayer.playRingtone(looping: true, asAlarm: false);
      } else {
        // Outgoing: softer repeated notification tone
        _ringtonePlayer.playNotification(looping: true);
      }
    }
    // Immediate first vibration pulse then repeat every 3 s.
    // HapticFeedback.vibrate() is silently ignored on platforms that
    // don't support it (e.g. Windows), so no platform guard needed.
    HapticFeedback.vibrate();
    _ringTimer = Timer.periodic(const Duration(seconds: 3), (_) {
      if (mounted && (_mode == CallMode.incoming || _mode == CallMode.outgoing)) {
        HapticFeedback.vibrate();
      }
    });
  }

  /// Stops both the ringtone and the haptic timer.
  /// Safe to call multiple times.
  void _stopRinging() {
    _ringTimer?.cancel();
    _ringTimer = null;
    if (ZegoCallService.isSupportedPlatform) {
      _ringtonePlayer.stop();
    }
  }

  void _startDurationTimer() {
    _durationTimer?.cancel();
    _durationSecs = 0;
    _durationTimer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (mounted) setState(() => _durationSecs++);
    });
  }

  // ── Zego Media Management (Desktop) ─────────────────────

  /// Routes to the correct media backend when the call becomes active.
  ///
  /// Mobile → CallScreen (ZegoUIKitPrebuiltCall handles everything).
  /// Desktop → ZegoExpressEngine directly (raw room + stream management).
  void _onCallActive() {
    _stopRinging(); // stop before transitioning — covers accept + auto-accept
    if (!mounted || _disposed) return;

    if (ZegoCallService.isSupportedPlatform) {
      // ── Mobile path ────────────────────────────────────────
      // Delegate to an async helper so we can properly await
      // permission requests before navigating to CallScreen.
      _activateMobilePath();
    } else {
      // ── Desktop path ───────────────────────────────────────

      _joinZegoRoom();
    }
  }

  /// Async helper for the mobile path of [_onCallActive].
  /// Awaits microphone (and camera) permission requests BEFORE navigating
  /// to [CallScreen], so ZegoExpressEngine can open the audio device
  /// immediately upon loginRoom + startPublishingStream.
  Future<void> _activateMobilePath() async {
    if (!mounted || _disposed) return;

    final user = _supabase.auth.currentUser;
    final capturedConvId = widget.conversationId;
    final capturedCallId = widget.callId;
    final capturedIsVideo = widget.isVideo;

    // ── Android: request permissions BEFORE navigating to CallScreen ────
    // Must be awaited so the OS dialog is dismissed before ZegoExpressEngine
    // tries to open the microphone device. Without this, loginRoom +
    // startPublishingStream silently fail on Android 13+ → no audio.
    final micStatus = await Permission.microphone.request();
    debugPrint('🔑 [Patient] Microphone: $micStatus');
    if (capturedIsVideo) {
      final camStatus = await Permission.camera.request();
      debugPrint('🔑 [Patient] Camera: $camStatus');
    }
    if (!micStatus.isGranted) {
      debugPrint(
        '⚠️ [Patient] Mic DENIED — call will have no audio. '
        'Go to Settings → App Info → Permissions → Microphone.',
      );
    }

    if (!mounted || _disposed) return;
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (_) => CallScreen(
          callID: capturedCallId,
          userID: user?.id ?? 'user',
          userName:
              user?.userMetadata?['full_name'] as String? ?? 'BioPara مريض',
          isVideoCall: capturedIsVideo,
          conversationId: capturedConvId,
          onCallEnd: () async {},
        ),
      ),
    );
  }

  Future<void> _joinZegoRoom() async {

    if (_inZegoRoom || _disposed) return;

    final appID = int.tryParse(AppConfig.zegoAppId) ?? 0;
    final appSign = AppConfig.zegoAppSign;
    if (appID == 0 || appSign.isEmpty) {
      debugPrint('⛔ CallOverlay: Zego AppID/AppSign missing — check .env');
      return;
    }

    // ── Request mic (+ camera for video) permissions ─────────
    // On Windows this checks the OS-level privacy setting.
    // If denied: guide user to Windows Settings → Privacy → Microphone.
    final permsToRequest = [
      Permission.microphone,
      if (widget.isVideo) Permission.camera,
    ];
    final statuses = await permsToRequest.request();
    statuses.forEach((perm, status) {
      debugPrint('🔑 Permission $perm → $status');
    });
    final micGranted = statuses[Permission.microphone]?.isGranted ?? false;
    if (!micGranted) {
      debugPrint(
        '⚠️ Microphone permission not granted. '
        'On Windows: Settings → Privacy & Security → Microphone → '
        'enable "Let desktop apps access your microphone".',
      );
      // Continue anyway — Zego may still capture audio if OS allows it
    }

    try {
      // Desktop: ZegoCallService never creates the engine, so we do it here.
      if (!ZegoCallService.isSupportedPlatform && !kIsWeb) {
        await ZegoExpressEngine.createEngineWithProfile(
          ZegoEngineProfile(
            appID,
            ZegoScenario.StandardVideoCall,
            appSign: appSign,
          ),
        );
        _zegoEngineCreatedByUs = true;
        debugPrint('🔧 ZegoExpressEngine created (desktop)');
      }

      // ── Register callbacks BEFORE loginRoom ──────────────────
      // Room state — useful for debugging connection issues
      ZegoExpressEngine.onRoomStateUpdate =
          (roomID, state, errorCode, extendedData) {
        debugPrint('🏠 Zego room state: $state (err=$errorCode)');
      };

      // User presence — secondary signal (requires isUserStatusNotify = true)
      ZegoExpressEngine.onRoomUserUpdate =
          (roomID, updateType, userList) {
        debugPrint(
          '👤 Zego users $updateType in $roomID: '
          '${userList.map((u) => u.userID).join(", ")}',
        );
      };

      // Publisher state — tells us if our mic stream is actually going out
      ZegoExpressEngine.onPublisherStateUpdate =
          (streamID, state, errorCode, extendedData) {
        debugPrint(
          '📤 Publisher [$streamID]: state=$state, err=$errorCode'
          '${errorCode != 0 ? " ← CHECK FIREWALL/UDP" : ""}',
        );
      };

      // Player state — tells us if we're actually receiving the remote stream
      ZegoExpressEngine.onPlayerStateUpdate =
          (streamID, state, errorCode, extendedData) {
        debugPrint(
          '📥 Player [$streamID]: state=$state, err=$errorCode'
          '${errorCode != 0 ? " ← STREAM NOT RECEIVED" : ""}',
        );
      };

      // Stream update — primary audio trigger
      // Add:    startPlayingStream for incoming audio
      // Delete: stopPlayingStream + auto-end when remote party hangs up
      ZegoExpressEngine.onRoomStreamUpdate =
          (roomID, updateType, streamList, extendedData) {
        if (_disposed) return;
        debugPrint(
          '📡 onRoomStreamUpdate [$roomID]: $updateType '
          '→ ${streamList.map((s) => s.streamID).join(", ")}',
        );

        if (updateType == ZegoUpdateType.Add) {
          for (final stream in streamList) {
            // Skip our own publishing stream
            if (stream.streamID == _zegoStreamId) continue;
            _remoteStreamIds.add(stream.streamID);
            // Pull remote audio — no canvas needed for audio-only
            ZegoExpressEngine.instance.startPlayingStream(stream.streamID);
            // Explicitly force audio unmuted (belt-and-suspenders)
            ZegoExpressEngine.instance
                .mutePlayStreamAudio(stream.streamID, false);
            debugPrint('▶️ startPlayingStream + unmuted: ${stream.streamID}');
          }
        } else {
          // ZegoUpdateType.Delete — remote party left or stream stopped
          for (final stream in streamList) {
            _remoteStreamIds.remove(stream.streamID);
            ZegoExpressEngine.instance.stopPlayingStream(stream.streamID);
            debugPrint('⏹️ stopPlayingStream: ${stream.streamID}');
          }
          // All remote streams gone → remote party hung up
          if (_remoteStreamIds.isEmpty && _inZegoRoom && !_disposed) {
            _onRemotePartyLeft();
          }
        }
      };

      // ── Login to the Zego room ───────────────────────────────
      final rawUserName =
          _supabase.auth.currentUser?.userMetadata?['full_name'] as String? ??
              ZegoCallService.adminUserName;
      final zegoUser = ZegoUser(_zegoUserId, rawUserName);
      // ZegoRoomConfig(maxMemberCount, isUserStatusNotify, token)
      // isUserStatusNotify = true so onRoomUserUpdate fires
      final roomConfig = ZegoRoomConfig(0, true, '');

      final loginResult = await ZegoExpressEngine.instance
          .loginRoom(_zegoRoomId, zegoUser, config: roomConfig);
      if (loginResult.errorCode != 0) {
        debugPrint(
          '❌ Zego loginRoom failed — err=${loginResult.errorCode}. '
          'Check AppID/AppSign and network.',
        );
        return;
      }
      _inZegoRoom = true;
      debugPrint('✅ Zego loginRoom OK — room=$_zegoRoomId');

      // ── Start publishing our audio stream ────────────────────
      // Explicitly unmute before publishing
      await ZegoExpressEngine.instance.muteMicrophone(false);
      // Disable camera for audio-only calls; enable for video calls
      await ZegoExpressEngine.instance
          .enableCamera(widget.isVideo && !_isVideoOff);
      // Begin capturing mic + publishing to the room
      await ZegoExpressEngine.instance.startPublishingStream(_zegoStreamId);
      debugPrint('📡 startPublishingStream: $_zegoStreamId');
    } catch (e) {
      debugPrint('⚠️ CallOverlay _joinZegoRoom error: $e');
    }
  }

  /// Called when the remote party's stream disappears from the Zego room.
  /// Stops the timer and closes the overlay on the Windows side.
  void _onRemotePartyLeft() {
    debugPrint('👋 Remote party left — ending call UI');
    // Defer to avoid calling Navigator from inside a Zego SDK callback
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted || _disposed) return;
      _exit();
    });
  }

  Future<void> _leaveZegoRoom() async {
    if (!_inZegoRoom) return;
    _inZegoRoom = false;

    // Clear all callbacks immediately to prevent calls into a destroyed state
    ZegoExpressEngine.onRoomStreamUpdate = null;
    ZegoExpressEngine.onRoomStateUpdate = null;
    ZegoExpressEngine.onRoomUserUpdate = null;
    ZegoExpressEngine.onPublisherStateUpdate = null;
    ZegoExpressEngine.onPlayerStateUpdate = null;

    try {
      // Stop playing every tracked remote stream
      for (final streamId in List<String>.from(_remoteStreamIds)) {
        await ZegoExpressEngine.instance.stopPlayingStream(streamId);
      }
      _remoteStreamIds.clear();

      await ZegoExpressEngine.instance.stopPublishingStream();
      await ZegoExpressEngine.instance.logoutRoom();

      if (_zegoEngineCreatedByUs) {
        await ZegoExpressEngine.destroyEngine();
        _zegoEngineCreatedByUs = false;
        debugPrint('🗑️ ZegoExpressEngine destroyed');
      }
      debugPrint('🔒 Zego room left cleanly');
    } catch (e) {
      debugPrint('⚠️ CallOverlay _leaveZegoRoom error: $e');
    }
  }

  // ── Lifecycle ────────────────────────────────────────────

  void _cleanup() {
    if (_disposed) return;
    _disposed = true;
    _stopRinging(); // covers cancel, decline, end, dispose, remote-hang-up
    _leaveZegoRoom(); // fire-and-forget — UI is already gone
    _durationTimer?.cancel();
    _pollTimer?.cancel();
    _ringTimeout?.cancel();
    if (_pulseController.isAnimating) _pulseController.stop();
    _pulseController.dispose();
    _channel?.unsubscribe();
    _channel = null;
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

  // ── Supabase Call Actions ────────────────────────────────

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
        'content':
            widget.isVideo ? 'مكالمة فيديو مرفوضة' : 'مكالمة صوتية مرفوضة',
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
        'content':
            widget.isVideo ? 'قُبلت مكالمة الفيديو' : 'قُبلت المكالمة الصوتية',
        'message_type': 'call_accept',
        'status': 'accepted',
        'metadata': {'call_id': widget.callId, 'call_status': 'accepted'},
      });
      _pollTimer?.cancel();
      if (mounted) {
        setState(() => _mode = CallMode.active);
        _startDurationTimer();
        _onCallActive();
      }
    } catch (e) {
      debugPrint('Accept call error: $e');
    }
  }

  /// Admin (Windows) presses the red End Call button.
  /// Leaves the Zego room, sends call_end to Supabase, closes overlay.
  Future<void> _endCall() async {
    _pollTimer?.cancel();
    // Leave Zego room first to stop audio immediately
    await _leaveZegoRoom();
    final dur = _fmt(Duration(seconds: _durationSecs));
    try {
      await _supabase.from('messages').insert({
        'id': const Uuid().v4(),
        'conversation_id': widget.conversationId,
        'sender_id': _supabase.auth.currentUser?.id ?? 'user',
        'content':
            widget.isVideo ? 'انتهت مكالمة الفيديو' : 'انتهت المكالمة الصوتية',
        'message_type': 'call_end',
        'status': 'ended',
        'metadata': {
          'call_id': widget.callId,
          'call_status': 'ended',
          'call_duration': dur,
        },
      });
      await _supabase.from('messages').update({
        'metadata': {'call_status': 'ended', 'call_duration': dur},
      }).eq('id', widget.callId);
    } catch (e) {
      debugPrint('End call error: $e');
    }
    _exit();
  }

  // ── Media Controls ───────────────────────────────────────

  void _toggleMute() {
    setState(() => _isMuted = !_isMuted);
    if (_inZegoRoom) {
      ZegoExpressEngine.instance.muteMicrophone(_isMuted);
    }
  }

  void _toggleVideo() {
    setState(() => _isVideoOff = !_isVideoOff);
    if (_inZegoRoom) {
      ZegoExpressEngine.instance.enableCamera(!_isVideoOff);
    }
  }

  void _toggleSpeaker() {
    setState(() => _isSpeakerMuted = !_isSpeakerMuted);
    for (final streamId in _remoteStreamIds) {
      ZegoExpressEngine.instance.mutePlayStreamAudio(streamId, _isSpeakerMuted);
    }
  }

  // ── Helpers ──────────────────────────────────────────────

  String _fmt(Duration d) =>
      '${d.inMinutes.toString().padLeft(2, '0')}:${(d.inSeconds % 60).toString().padLeft(2, '0')}';

  // ── Build ────────────────────────────────────────────────

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
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [primary, primaryMid, Color(0xFF1A2E1A)],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              const SizedBox(height: 56),

              // ── Call Type Badge ──────────────────────────
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
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
                      widget.isVideo
                          ? Icons.videocam_rounded
                          : Icons.call_rounded,
                      color:
                          _mode == CallMode.active ? accent : Colors.white60,
                      size: 14,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      widget.isVideo ? 'مكالمة فيديو' : 'مكالمة صوتية',
                      style: GoogleFonts.tajawal(
                        color: _mode == CallMode.active
                            ? accent
                            : Colors.white60,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 40),

              // ── Pulsing Avatar ───────────────────────────
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
                      if (_mode != CallMode.active)
                        Transform.scale(
                          scale: scale * 1.25,
                          child: Container(
                            width: 136,
                            height: 136,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: accent
                                    .withValues(alpha: glowOpacity * 0.5),
                                width: 2,
                              ),
                            ),
                          ),
                        ),
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
                                color:
                                    accent.withValues(alpha: glowOpacity),
                                blurRadius: glowRadius,
                                spreadRadius: 4,
                              ),
                            ],
                          ),
                          child: Center(
                            child: Text(
                              widget.name.isNotEmpty
                                  ? widget.name[0].toUpperCase()
                                  : '?',
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

              AnimatedSwitcher(
                duration: const Duration(milliseconds: 400),
                child: Text(
                  key: ValueKey(_mode),
                  _mode == CallMode.outgoing
                      ? 'جاري الاتصال...'
                      : _mode == CallMode.incoming
                          ? (widget.isVideo
                              ? 'مكالمة فيديو واردة...'
                              : 'مكالمة صوتية واردة...')
                          : _fmt(Duration(seconds: _durationSecs)),
                  style: GoogleFonts.tajawal(
                    fontSize: 16,
                    color:
                        _mode == CallMode.active ? accent : Colors.white54,
                    fontWeight: FontWeight.w500,
                    letterSpacing: _mode == CallMode.active ? 2.0 : 0.0,
                  ),
                ),
              ),

              if (_mode == CallMode.active)
                Padding(
                  padding: const EdgeInsets.only(top: 10),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(
                      4,
                      (i) => Container(
                        margin: const EdgeInsets.symmetric(horizontal: 2),
                        width: 4,
                        height: 4 + i * 2.0,
                        decoration: BoxDecoration(
                          color:
                              accent.withValues(alpha: 0.6 + i * 0.1),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                  ),
                ),

              const Spacer(),

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

    if (_mode == CallMode.incoming) {
      return Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _CircleBtn(
            icon: widget.isVideo
                ? Icons.videocam_rounded
                : Icons.call_rounded,
            label: 'قبول',
            color: const Color(0xFF43A047),
            size: 72,
            iconSize: 32,
            onTap: _acceptCall,
          ),
          _CircleBtn(
            icon: Icons.call_end_rounded,
            label: 'رفض',
            color: const Color(0xFFE53935),
            size: 72,
            iconSize: 32,
            onTap: _declineCall,
          ),
        ],
      );
    }

    // ACTIVE CALL controls
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        _CircleBtn(
          icon: _isMuted ? Icons.mic_off_rounded : Icons.mic_rounded,
          label: _isMuted ? 'رفع الكتم' : 'كتم',
          isActive: _isMuted,
          onTap: _toggleMute,
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
            icon: _isVideoOff
                ? Icons.videocam_off_rounded
                : Icons.videocam_rounded,
            label: _isVideoOff ? 'تشغيل كاميرا' : 'إيقاف كاميرا',
            isActive: _isVideoOff,
            onTap: _toggleVideo,
          )
        else
          _CircleBtn(
            icon: _isSpeakerMuted
                ? Icons.volume_off_rounded
                : Icons.volume_up_rounded,
            label: _isSpeakerMuted ? 'صوت مكتوم' : 'سماعة',
            isActive: !_isSpeakerMuted,
            onTap: _toggleSpeaker,
          ),
      ],
    );
  }
}

// ─── Reusable Circle Button ──────────────────────────────────
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
    final bgColor = color ??
        (isActive ? activeColor : Colors.white.withValues(alpha: 0.12));

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
            child: Icon(icon, color: Colors.white, size: iconSize),
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
