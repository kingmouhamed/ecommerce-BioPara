// lib/patient/screens/call_screen_mobile.dart
// ═══════════════════════════════════════════════════════════
//  BioPara — Active Call Screen (Android / iOS)
//
//  Uses ZegoExpressEngine directly — avoids conflict with
//  ZegoUIKitPrebuiltCallInvitationService already initialized
//  at startup in main_patient.dart.
//
//  Disconnect sync — two independent paths, both required:
//    • Zego: onRoomStreamUpdate(Delete) → admin left Zego room
//    • Supabase: call_end message → catches network/crash cases
//
//  Engine lifecycle: engine was created by ZegoCallService at
//  startup → DO NOT createEngineWithProfile / destroyEngine here.
// ═══════════════════════════════════════════════════════════
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:uuid/uuid.dart';
import 'package:zego_express_engine/zego_express_engine.dart';
import 'package:permission_handler/permission_handler.dart';
import 'dart:async';

import '../../core/config/app_config.dart';

/// Entry point called from call_screen.dart — signature matches CallScreen.
Widget buildMobileCallScreen(
  BuildContext context,
  String callID,
  String userID,
  String userName,
        },
      ),
    ),
=======
  bool isVideoCall, {
  String conversationId = '',
  Future<void> Function()? onCallEnd,
}) {
  return _MobileCallScreen(
    callID: callID,
    userID: userID,
    userName: userName,
    isVideoCall: isVideoCall,
    conversationId: conversationId,
    onCallEnd: onCallEnd,
>>>>>>> Stashed changes
  );
}

// ─────────────────────────────────────────────────────────────
class _MobileCallScreen extends StatefulWidget {
  final String callID;
  final String userID;
  final String userName;
  final bool isVideoCall;
  final String conversationId;

  /// Called when the PATIENT hangs up — used for additional cleanup
  /// by the caller (call_overlay.dart). Supabase call_end is sent
  /// directly by this screen, not via this callback.
  final Future<void> Function()? onCallEnd;

  const _MobileCallScreen({
    required this.callID,
    required this.userID,
    required this.userName,
    required this.isVideoCall,
    required this.conversationId,
    this.onCallEnd,
  });

  @override
  State<_MobileCallScreen> createState() => _MobileCallScreenState();
}

class _MobileCallScreenState extends State<_MobileCallScreen> {
  // ── Supabase ─────────────────────────────────────────────
  final _supabase = Supabase.instance.client;
  RealtimeChannel? _supabaseChannel;
  late final String _currentUserId;

  // ── Call UI state ────────────────────────────────────────
  bool _isMuted = false;
  bool _isCameraOff = false;
  bool _isSpeakerOn = true; // speakerphone ON by default on mobile
  bool _isDisposed = false;

  // ── Zego room state ──────────────────────────────────────
  bool _inRoom = false;
  final Set<String> _remoteStreamIds = {};

  // ── Duration timer ───────────────────────────────────────
  Timer? _durationTimer;
  int _durationSecs = 0;

  // ── Zego IDs — computed once, must match admin side ──────
  late final String _roomId;   // sanitized callID
  late final String _userId;   // sanitized Supabase UUID
  late final String _streamId; // roomId_userId

  // ── Video canvas widgets (video calls only) ──────────────
  Widget? _localView;
  Widget? _remoteView;

  // ─────────────────────────────────────────────────────────
  @override
  void initState() {
    super.initState();

    _currentUserId = _supabase.auth.currentUser?.id ?? 'user';

    // Sanitize: Zego accepts [a-zA-Z0-9_-] only
    _roomId = widget.callID.replaceAll(RegExp(r'[^a-zA-Z0-9_\-]'), '_');
    _userId = widget.userID.replaceAll(RegExp(r'[^a-zA-Z0-9_\-]'), '_');
    _streamId = '${_roomId}_$_userId';

    _startDurationTimer();
    _subscribeToCallEvents();
    // ⚠️ FIX: request mic permission BEFORE joinRoom so the engine can open
    // the audio device. On Android 13+ the engine silently fails if the
    // RECORD_AUDIO runtime permission hasn't been granted yet.
    _requestPermsAndJoin();
  }

  // ── Supabase Realtime subscription ───────────────────────
  // Catches admin's call_end even if the Zego Delete event is delayed.

  void _subscribeToCallEvents() {
    if (widget.conversationId.isEmpty) return;

    _supabaseChannel = _supabase
        .channel('mobile_call_${widget.callID}')
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
        )
        .subscribe();
  }

  void _handleCallEvent(Map<String, dynamic> msg) {
    if (_isDisposed || !mounted) return;

    final type = msg['message_type'] as String? ?? '';
    final senderId = msg['sender_id'] as String? ?? '';
    final rawMeta = msg['metadata'];
    final meta = rawMeta is Map<String, dynamic> ? rawMeta : <String, dynamic>{};
    final callIdFromMeta = meta['call_id'] as String? ?? '';

    // Only react to events for THIS call from the OTHER party
    if (callIdFromMeta != widget.callID) return;
    if (senderId == _currentUserId) return;

    if (type == 'call_end' || type == 'call_cancel') {
      debugPrint('📩 [Patient] Admin sent $type — closing call screen');
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!mounted || _isDisposed) return;
        _endCallByAdmin(); // admin hung up — don't re-send call_end
      });
    }
  }

  // ── Duration timer ───────────────────────────────────────

  void _startDurationTimer() {
    _durationTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) setState(() => _durationSecs++);
    });
  }

  // ── Zego room management ─────────────────────────────────

  Future<void> _requestPermsAndJoin() async {
    final micStatus = await Permission.microphone.request();
    debugPrint('🔑 [Patient Mobile] Microphone: $micStatus');
    if (widget.isVideoCall) {
      final camStatus = await Permission.camera.request();
      debugPrint('🔑 [Patient Mobile] Camera: $camStatus');
    }
    if (!micStatus.isGranted) {
      debugPrint(
        '⚠️ [Patient Mobile] Mic DENIED — no audio will be captured. '
        'User must grant RECORD_AUDIO in Settings → App Permissions.',
      );
    }
    _joinRoom();
  }

  Future<void> _joinRoom() async {
    final appID = int.tryParse(AppConfig.zegoAppId) ?? 0;
    final appSign = AppConfig.zegoAppSign;

    debugPrint('╔══ ZegoExpressEngine (Patient Android) ══╗');
    debugPrint('║  appID  : $appID');
    debugPrint('║  roomId : $_roomId  ← must match Windows admin');
    debugPrint('║  userId : $_userId');
    debugPrint('║  stream : $_streamId');
    debugPrint('║  isVideo: ${widget.isVideoCall}');
    debugPrint('╚══════════════════════════════════════════╝');

    if (appID == 0 || appSign.isEmpty) {
      debugPrint('⛔ [Patient] Zego AppID/AppSign missing — check .env');
      return;
    }

    try {
      // ── Callbacks BEFORE loginRoom ───────────────────────────

      ZegoExpressEngine.onRoomStateUpdate =
          (roomID, state, errorCode, extendedData) {
        debugPrint('🏠 [Patient] Room state: $state (err=$errorCode)');
      };

      ZegoExpressEngine.onPublisherStateUpdate =
          (streamID, state, errorCode, extendedData) {
        debugPrint(
          '📤 [Patient] Publisher [$streamID]: state=$state, err=$errorCode'
          '${errorCode != 0 ? " ← FIREWALL/UDP?" : ""}',
        );
      };

      ZegoExpressEngine.onPlayerStateUpdate =
          (streamID, state, errorCode, extendedData) {
        debugPrint(
          '📥 [Patient] Player [$streamID]: state=$state, err=$errorCode'
          '${errorCode != 0 ? " ← STREAM UNREACHABLE" : ""}',
        );
      };

      ZegoExpressEngine.onRoomUserUpdate =
          (roomID, updateType, userList) {
        debugPrint(
          '👤 [Patient] Users $updateType: '
          '${userList.map((u) => u.userID).join(", ")}',
        );
      };

      ZegoExpressEngine.onRoomStreamUpdate =
          (roomID, updateType, streamList, extendedData) {
        if (!mounted || _isDisposed) return;
        debugPrint(
          '📡 [Patient] Streams $updateType: '
          '${streamList.map((s) => s.streamID).join(", ")}',
        );

        if (updateType == ZegoUpdateType.Add) {
          for (final stream in streamList) {
            if (stream.streamID == _streamId) continue; // skip own
            _remoteStreamIds.add(stream.streamID);
            _playRemoteStream(stream.streamID);
          }
        } else {
          // ZegoUpdateType.Delete — remote party left or stream stopped
          for (final stream in streamList) {
            _remoteStreamIds.remove(stream.streamID);
            ZegoExpressEngine.instance.stopPlayingStream(stream.streamID);
            debugPrint('⏹️ [Patient] stopPlayingStream: ${stream.streamID}');
          }
          // All remote streams gone → admin hung up (Zego path)
          if (_remoteStreamIds.isEmpty && _inRoom && !_isDisposed) {
            debugPrint('👋 [Patient] All remote streams removed — admin left Zego room');
            WidgetsBinding.instance.addPostFrameCallback((_) {
              if (!mounted || _isDisposed) return;
              _endCallByAdmin();
            });
          }
        }
      };

      // ── Join room ────────────────────────────────────────────
      final zegoUser = ZegoUser(_userId, widget.userName);
      final roomConfig = ZegoRoomConfig(0, true, '');

      final result = await ZegoExpressEngine.instance
          .loginRoom(_roomId, zegoUser, config: roomConfig);

      if (result.errorCode != 0) {
        debugPrint('❌ [Patient] loginRoom failed: err=${result.errorCode}');
        return;
      }
      _inRoom = true;
      debugPrint('✅ [Patient] loginRoom OK — room=$_roomId');

      // ── Publish our stream ───────────────────────────────────
      // ⚠️ FIX: muteMicrophone(false) first, then startPublishingStream,
      // then setAudioRouteToSpeaker — the Zego audio session must be open
      // before the route can be changed. Calling setAudioRouteToSpeaker
      // before startPublishingStream causes Android to silently ignore it,
      // resulting in audio playing through the earpiece (or not at all).
      await ZegoExpressEngine.instance.muteMicrophone(false);
      await ZegoExpressEngine.instance
          .enableCamera(widget.isVideoCall && !_isCameraOff);

      if (widget.isVideoCall) {
        _setupLocalPreview(); // async, non-blocking
      }

      await ZegoExpressEngine.instance.startPublishingStream(_streamId);
      debugPrint('📡 [Patient] startPublishingStream: $_streamId');

      // ── Route audio to speaker AFTER publishing starts ───────
      // Default on Android is earpiece — force speaker so user can hear.
      // Must be AFTER startPublishingStream so the audio session is open.
      await ZegoExpressEngine.instance.setAudioRouteToSpeaker(_isSpeakerOn);
      debugPrint('🔊 [Patient] Speaker phone: $_isSpeakerOn');
    } catch (e) {
      debugPrint('⚠️ [Patient] _joinRoom error: $e');
    }
  }

  Future<void> _setupLocalPreview() async {
    if (!mounted || _isDisposed) return;
    final view = await ZegoExpressEngine.instance.createCanvasView((viewID) {
      ZegoExpressEngine.instance.startPreview(
        canvas: ZegoCanvas(viewID, viewMode: ZegoViewMode.AspectFill),
      );
    });
    if (mounted && !_isDisposed) setState(() => _localView = view);
  }

  /// Plays the admin's audio stream. Always calls startPlayingStream +
  /// mutePlayStreamAudio regardless of audio vs video call type.
  Future<void> _playRemoteStream(String streamID) async {
    debugPrint('▶️ [Patient] _playRemoteStream: $streamID');

    if (widget.isVideoCall) {
      final view =
          await ZegoExpressEngine.instance.createCanvasView((viewID) {
        // Start playing with video canvas
        ZegoExpressEngine.instance.startPlayingStream(
          streamID,
          canvas: ZegoCanvas(viewID, viewMode: ZegoViewMode.AspectFill),
        );
        // Explicitly unmute — belt-and-suspenders guarantee
        ZegoExpressEngine.instance.mutePlayStreamAudio(streamID, false);
        debugPrint('▶️ [Patient] startPlayingStream (video) + unmuted: $streamID');
      });
      if (mounted && !_isDisposed) setState(() => _remoteView = view);
    } else {
      // Audio only — no canvas needed; both calls must happen
      ZegoExpressEngine.instance.startPlayingStream(streamID);
      ZegoExpressEngine.instance.mutePlayStreamAudio(streamID, false);
      debugPrint('▶️ [Patient] startPlayingStream (audio) + unmuted: $streamID');
    }
  }

  Future<void> _leaveRoom() async {
    if (!_inRoom) return;
    _inRoom = false;

    // Clear callbacks immediately — prevents stale stream events firing
    // into a widget that is already being disposed.
    ZegoExpressEngine.onRoomStreamUpdate = null;
    ZegoExpressEngine.onRoomStateUpdate = null;
    ZegoExpressEngine.onRoomUserUpdate = null;
    ZegoExpressEngine.onPublisherStateUpdate = null;
    ZegoExpressEngine.onPlayerStateUpdate = null;

    try {
      // ── 1. Stop all remote streams ─────────────────────────────────────
      for (final id in List<String>.from(_remoteStreamIds)) {
        await ZegoExpressEngine.instance.stopPlayingStream(id);
        debugPrint('⏹️ [Patient] stopPlayingStream: $id');
      }
      _remoteStreamIds.clear();

      // ── 2. Stop local preview + disable camera ─────────────────────────
      if (widget.isVideoCall) {
        await ZegoExpressEngine.instance.stopPreview();
        await ZegoExpressEngine.instance.enableCamera(false);
      }

      // ── 3. Stop publishing our mic stream ──────────────────────────────
      await ZegoExpressEngine.instance.stopPublishingStream();
      debugPrint('⏹️ [Patient] stopPublishingStream');

      // ── 4. Reset audio state BEFORE logoutRoom ─────────────────────────
      // ⚠️ KEY FIX for "no audio on second call":
      // Explicitly mute the mic + reset speaker route so the engine fully
      // releases the Android audio focus / hardware mic lock.
      // On the NEXT call, _requestPermsAndJoin() will re-open mic with
      // muteMicrophone(false) + setAudioRouteToSpeaker(true) in fresh state.
      await ZegoExpressEngine.instance.muteMicrophone(true);
      await ZegoExpressEngine.instance.setAudioRouteToSpeaker(false); // back to earpiece default

      // ── 5. Leave the Zego room ─────────────────────────────────────────
      await ZegoExpressEngine.instance.logoutRoom();

      // DO NOT destroyEngine() — engine lives for the lifetime of the app.
      debugPrint('🔒 [Patient] Room left cleanly — audio session fully released');
    } catch (e) {
      debugPrint('⚠️ [Patient] _leaveRoom error: $e');
    }
  }

  /// Patient pressed the hang-up button.
  /// Sends call_end to Supabase so Windows admin overlay closes.
  Future<void> _endCallByPatient() async {
    if (_isDisposed) return;
    _isDisposed = true;

    HapticFeedback.mediumImpact();
    await _leaveRoom();

    // Send call_end signal — admin overlay listens for this
    if (widget.conversationId.isNotEmpty) {
      try {
        await _supabase.from('messages').insert({
          'id': const Uuid().v4(),
          'conversation_id': widget.conversationId,
          'sender_id': _currentUserId,
          'content': widget.isVideoCall
              ? 'انتهت مكالمة الفيديو'
              : 'انتهت المكالمة الصوتية',
          'message_type': 'call_end',
          'status': 'ended',
          'metadata': {
            'call_id': widget.callID,
            'call_status': 'ended',
            'call_duration': _fmt(Duration(seconds: _durationSecs)),
          },
        });
        debugPrint('📤 [Patient] call_end sent to Supabase');
      } catch (e) {
        debugPrint('⚠️ [Patient] call_end send error: $e');
      }
    }

    // Optional caller-level cleanup (e.g. call_overlay.dart)
    await widget.onCallEnd?.call();

    if (mounted) Navigator.of(context).pop();
  }

  /// Admin hung up (either via Zego stream delete or Supabase call_end).
  /// Do NOT re-send call_end — admin already sent it.
  Future<void> _endCallByAdmin() async {
    if (_isDisposed) return;
    _isDisposed = true;

    await _leaveRoom();
    if (mounted) Navigator.of(context).pop();
  }

  // ── Media controls ───────────────────────────────────────

  void _toggleMute() {
    setState(() => _isMuted = !_isMuted);
    ZegoExpressEngine.instance.muteMicrophone(_isMuted);
  }

  void _toggleCamera() {
    if (!widget.isVideoCall) return;
    setState(() => _isCameraOff = !_isCameraOff);
    ZegoExpressEngine.instance.enableCamera(!_isCameraOff);
  }

  void _toggleSpeaker() {
    setState(() => _isSpeakerOn = !_isSpeakerOn);
    ZegoExpressEngine.instance.setAudioRouteToSpeaker(_isSpeakerOn);
    debugPrint('🔊 [Patient] Speaker: $_isSpeakerOn');
  }

  String _fmt(Duration d) =>
      '${d.inMinutes.toString().padLeft(2, '0')}'
      ':${(d.inSeconds % 60).toString().padLeft(2, '0')}';

  @override
  void dispose() {
    _isDisposed = true;
    _durationTimer?.cancel();
    _supabaseChannel?.unsubscribe();
    _leaveRoom(); // fire-and-forget — UI is already gone
    super.dispose();
  }

  // ── Build ────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: widget.isVideoCall ? _buildVideoUI() : _buildAudioUI(),
    );
  }

  // ── Audio call UI ────────────────────────────────────────

  Widget _buildAudioUI() {
    const accent = Color(0xFF4CAF78);

    return Container(
      width: double.infinity,
      height: double.infinity,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFF1E2D20), Color(0xFF2D4A2E), Color(0xFF1A2E1A)],
        ),
      ),
      child: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 60),

            // Active call badge
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              decoration: BoxDecoration(
                color: accent.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: accent.withValues(alpha: 0.5)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.call_rounded, color: Color(0xFF4CAF78), size: 14),
                  const SizedBox(width: 6),
                  Text(
                    'مكالمة صوتية نشطة',
                    style: GoogleFonts.tajawal(
                      color: accent,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 52),

            // Avatar
            Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withValues(alpha: 0.12),
                border: Border.all(color: accent, width: 2.5),
                boxShadow: [
                  BoxShadow(
                    color: accent.withValues(alpha: 0.3),
                    blurRadius: 24,
                    spreadRadius: 4,
                  ),
                ],
              ),
              child: Center(
                child: Text(
                  widget.userName.isNotEmpty
                      ? widget.userName[0].toUpperCase()
                      : '?',
                  style: const TextStyle(
                    fontSize: 50,
                    color: Colors.white,
                    fontWeight: FontWeight.w300,
                  ),
                ),
              ),
            ),

            const SizedBox(height: 28),

            Text(
              widget.userName,
              style: GoogleFonts.cairo(
                fontSize: 28,
                color: Colors.white,
                fontWeight: FontWeight.w700,
                letterSpacing: -0.5,
              ),
            ),

            const SizedBox(height: 8),

            Text(
              _fmt(Duration(seconds: _durationSecs)),
              style: GoogleFonts.tajawal(
                fontSize: 18,
                color: accent,
                fontWeight: FontWeight.w600,
                letterSpacing: 3,
              ),
            ),

            // Waveform indicator (dimmed when muted)
            Padding(
              padding: const EdgeInsets.only(top: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  5,
                  (i) => Container(
                    margin: const EdgeInsets.symmetric(horizontal: 2),
                    width: 4,
                    height: 6.0 + i * 3.0,
                    decoration: BoxDecoration(
                      color: accent.withValues(
                        alpha: _isMuted ? 0.15 : 0.4 + i * 0.12,
                      ),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
              ),
            ),

            const Spacer(),

            _buildControls(isVideo: false),

            const SizedBox(height: 52),
          ],
        ),
      ),
    );
  }

  // ── Video call UI ────────────────────────────────────────

  Widget _buildVideoUI() {
    const accent = Color(0xFF4CAF78);

    return Stack(
      fit: StackFit.expand,
      children: [
        // Remote video — full screen
        _remoteView != null
            ? _remoteView!
            : Container(
                color: const Color(0xFF1A2E1A),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 88,
                      height: 88,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white.withValues(alpha: 0.12),
                        border: Border.all(color: accent, width: 2),
                      ),
                      child: Center(
                        child: Text(
                          widget.userName.isNotEmpty
                              ? widget.userName[0].toUpperCase()
                              : '?',
                          style: const TextStyle(
                            fontSize: 36,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'في انتظار الفيديو...',
                      style: GoogleFonts.tajawal(
                        color: Colors.white54,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),

        // Local preview — top-right pip
        if (_localView != null)
          Positioned(
            top: MediaQuery.of(context).padding.top + 12,
            right: 16,
            width: 96,
            height: 136,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Container(
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.white38, width: 1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: _localView!,
              ),
            ),
          ),

        // Bottom overlay: info + controls
        Positioned(
          bottom: 0,
          left: 0,
          right: 0,
          child: Container(
            padding: EdgeInsets.fromLTRB(
              24,
              24,
              24,
              MediaQuery.of(context).padding.bottom + 32,
            ),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.transparent,
                  Colors.black.withValues(alpha: 0.85),
                ],
              ),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  widget.userName,
                  style: GoogleFonts.cairo(
                    fontSize: 20,
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  _fmt(Duration(seconds: _durationSecs)),
                  style: GoogleFonts.tajawal(
                    fontSize: 14,
                    color: accent,
                    letterSpacing: 2,
                  ),
                ),
                const SizedBox(height: 20),
                _buildControls(isVideo: true),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // ── Controls row ─────────────────────────────────────────

  Widget _buildControls({required bool isVideo}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        // Mute / unmute microphone
        _CtrlBtn(
          icon: _isMuted ? Icons.mic_off_rounded : Icons.mic_rounded,
          label: _isMuted ? 'رفع الكتم' : 'كتم',
          isActive: _isMuted,
          onTap: _toggleMute,
        ),

        // End call (large red button, centre)
        _CtrlBtn(
          icon: Icons.call_end_rounded,
          label: 'إنهاء',
          color: const Color(0xFFE53935),
          size: 72,
          iconSize: 32,
          onTap: _endCallByPatient,
        ),

        // Speaker (audio) or Camera (video)
        if (!isVideo)
          _CtrlBtn(
            icon: _isSpeakerOn
                ? Icons.volume_up_rounded
                : Icons.volume_off_rounded,
            label: _isSpeakerOn ? 'سماعة' : 'أذن',
            isActive: _isSpeakerOn,
            onTap: _toggleSpeaker,
          )
        else
          _CtrlBtn(
            icon: _isCameraOff
                ? Icons.videocam_off_rounded
                : Icons.videocam_rounded,
            label: _isCameraOff ? 'تشغيل' : 'إيقاف',
            isActive: _isCameraOff,
            onTap: _toggleCamera,
          ),
      ],
    );
  }
}

// ─── Reusable Control Button ──────────────────────────────
class _CtrlBtn extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color? color;
  final bool isActive;
  final VoidCallback onTap;
  final double size;
  final double iconSize;

  const _CtrlBtn({
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
    final bg = color ??
        (isActive ? activeColor : Colors.white.withValues(alpha: 0.15));

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
              color: bg,
              shape: BoxShape.circle,
              border: Border.all(
                color: isActive
                    ? activeColor.withValues(alpha: 0.6)
                    : Colors.white.withValues(alpha: 0.1),
                width: 1.5,
              ),
              boxShadow: [
                if (color != null)
                  BoxShadow(
                    color: color!.withValues(alpha: 0.4),
                    blurRadius: 16,
                    spreadRadius: 2,
                  ),
                if (isActive && color == null)
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
            color: Colors.white60,
            fontSize: 11,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}
