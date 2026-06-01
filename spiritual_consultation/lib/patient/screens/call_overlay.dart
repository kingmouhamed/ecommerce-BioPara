import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:uuid/uuid.dart';
import 'package:audioplayers/audioplayers.dart';
import 'dart:async';

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
  bool _isSpeakerOn = false;
  final bool _isVideoOff = false;
  
  // Timer for active call duration
  Timer? _durationTimer;
  int _durationSecs = 0;

  // Animation controller for pulsing calling avatar
  late AnimationController _pulseController;
  
  // Supabase instance and real-time subscription
  final _supabase = Supabase.instance.client;
  StreamSubscription<List<Map<String, dynamic>>>? _sub;

  // Loop player for call ringtone/dialing sound
  AudioPlayer? _ringPlayer;

  @override
  void initState() {
    super.initState();
    _mode = widget.initialMode;
    
    // 1. Initialize animations
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);

    // 2. Start duration timer if active initially
    if (_mode == CallMode.active) {
      _startDurationTimer();
    } else {
      _startRingtone();
    }

    // 3. Listen to all messages in this conversation in real-time
    // Bypasses RLS issues because each user reads the message stream they belong to,
    // and accepts, declines, cancels, or ends are separate message inserts.
    _sub = _supabase
        .from('messages')
        .stream(primaryKey: ['id'])
        .eq('conversation_id', widget.conversationId)
        .listen((data) {
          if (data.isNotEmpty) {
            for (var msg in data) {
              final type = msg['message_type'] as String? ?? 'text';
              final content = msg['content'] as String? ?? '';
              
              if (content == widget.callId) {
                if (mounted) {
                  if (type == 'call_accept') {
                    if (_mode != CallMode.active) {
                      _stopRingtone();
                      setState(() {
                        _mode = CallMode.active;
                      });
                      _startDurationTimer();
                    }
                  } else if (type == 'call_decline' || type == 'call_cancel' || type == 'call_end') {
                    _exit();
                  }
                }
              }
            }
          }
        }, onError: (e) {
          debugPrint('⚠️ CallOverlay real-time stream error: $e');
        });
  }

  void _startDurationTimer() {
    _durationTimer?.cancel();
    _durationSecs = 0;
    _durationTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted) {
        setState(() => _durationSecs++);
      }
    });
  }

  void _startRingtone() async {
    try {
      _ringPlayer = AudioPlayer();
      await _ringPlayer?.setReleaseMode(ReleaseMode.loop);
      // Play a realistic telephone ringing sound from a reliable public asset
      await _ringPlayer?.play(UrlSource('https://assets.mixkit.co/active_storage/sfx/1359/1359-84.wav'));
    } catch (e) {
      debugPrint('Audio play error: $e');
    }
  }

  void _stopRingtone() {
    try {
      _ringPlayer?.stop();
      _ringPlayer?.dispose();
      _ringPlayer = null;
    } catch (e) {
      debugPrint('Audio stop error: $e');
    }
  }

  void _cleanup() {
    _durationTimer?.cancel();
    _pulseController.dispose();
    _sub?.cancel();
    _stopRingtone();
  }

  void _exit() {
    _cleanup();
    if (mounted) {
      Navigator.of(context).pop();
      widget.onEnd?.call();
    }
  }

  @override
  void dispose() {
    _cleanup();
    super.dispose();
  }

  // ─── ACTIONS ───────────────────────────────────────────────
  
  // Caller cancels dialing
  Future<void> _cancelCall() async {
    try {
      await _supabase.from('messages').insert({
        'id': const Uuid().v4(),
        'conversation_id': widget.conversationId,
        'sender_id': _supabase.auth.currentUser?.id ?? 'caller',
        'content': widget.callId,
        'message_type': 'call_cancel',
        'status': 'cancelled',
      });
    } catch (e) {
      debugPrint('Error cancelling call: $e');
    }
    _exit();
  }

  // Receiver declines ringing
  Future<void> _declineCall() async {
    try {
      await _supabase.from('messages').insert({
        'id': const Uuid().v4(),
        'conversation_id': widget.conversationId,
        'sender_id': _supabase.auth.currentUser?.id ?? 'receiver',
        'content': widget.callId,
        'message_type': 'call_decline',
        'status': 'declined',
      });
    } catch (e) {
      debugPrint('Error declining call: $e');
    }
    _exit();
  }

  // Receiver accepts ringing
  Future<void> _acceptCall() async {
    try {
      await _supabase.from('messages').insert({
        'id': const Uuid().v4(),
        'conversation_id': widget.conversationId,
        'sender_id': _supabase.auth.currentUser?.id ?? 'receiver',
        'content': widget.callId,
        'message_type': 'call_accept',
        'status': 'accepted',
      });
      _stopRingtone();
      if (mounted) {
        setState(() {
          _mode = CallMode.active;
        });
        _startDurationTimer();
      }
    } catch (e) {
      debugPrint('Error accepting call: $e');
    }
  }

  // Either side ends active call
  Future<void> _endCall() async {
    try {
      await _supabase.from('messages').insert({
        'id': const Uuid().v4(),
        'conversation_id': widget.conversationId,
        'sender_id': _supabase.auth.currentUser?.id ?? 'user',
        'content': widget.callId,
        'message_type': 'call_end',
        'status': 'ended',
      });
    } catch (e) {
      debugPrint('Error ending call: $e');
    }
    _exit();
  }

  String _fmt(Duration d) =>
      '${d.inMinutes.toString().padLeft(2, '0')}:${(d.inSeconds % 60).toString().padLeft(2, '0')}';

  // ─── BUILD ─────────────────────────────────────────────────
  @override
  Widget build(BuildContext context) {
    const primary = Color(0xFF2D4A2E); // Beautiful Forest Green
    const primaryDark = Color(0xFF1E351F);
    
    return Scaffold(
      body: Container(
        width: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [primary, primaryDark],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              const SizedBox(height: 60),
              
              // Pulsing avatar for incoming/outgoing calls
              AnimatedBuilder(
                animation: _pulseController,
                builder: (context, child) {
                  final scale = 1.0 + (_pulseController.value * 0.12);
                  return Transform.scale(
                    scale: _mode == CallMode.active ? 1.0 : scale,
                    child: Container(
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.white.withValues(alpha: _mode == CallMode.active ? 0.1 : 0.2 + (_pulseController.value * 0.15)),
                            blurRadius: _mode == CallMode.active ? 20 : 25 + (_pulseController.value * 15),
                            spreadRadius: _mode == CallMode.active ? 2 : 4 + (_pulseController.value * 8),
                          ),
                        ],
                      ),
                      child: CircleAvatar(
                        radius: 60,
                        backgroundColor: Colors.white24,
                        child: Text(
                          widget.name.isNotEmpty ? widget.name[0] : '?',
                          style: const TextStyle(
                            fontSize: 44,
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
              
              const SizedBox(height: 32),
              Text(
                widget.name,
                style: GoogleFonts.cairo(
                  fontSize: 28,
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              
              // Call State Label
              Text(
                _mode == CallMode.outgoing
                    ? 'جاري الاتصال...'
                    : _mode == CallMode.incoming
                        ? (widget.isVideo ? 'مكالمة فيديو واردة...' : 'مكالمة صوتية واردة...')
                        : _fmt(Duration(seconds: _durationSecs)),
                style: GoogleFonts.tajawal(
                  fontSize: 16,
                  color: Colors.white70,
                  fontWeight: FontWeight.w500,
                  letterSpacing: _mode == CallMode.active ? 1.5 : 0.0,
                ),
              ),
              
              const Spacer(),
              
              // Video Feed Box placeholder (for video calls)
              if (widget.isVideo && _mode == CallMode.active)
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 24),
                  height: 280,
                  decoration: BoxDecoration(
                    color: Colors.black26,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: Colors.white24),
                  ),
                  child: Center(
                    child: Icon(
                      _isVideoOff ? Icons.videocam_off : Icons.videocam, 
                      color: _isVideoOff ? Colors.redAccent : Colors.white54, 
                      size: 54,
                    ),
                  ),
                ),
                
              const Spacer(),
              
              // ─── CONTROL BUTTONS ────────────────────────────────────
              Padding(
                padding: const EdgeInsets.only(bottom: 60),
                child: _buildControls(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildControls() {
    // 1. OUTGOING CALL (Dialing...) -> Single Cancel Button
    if (_mode == CallMode.outgoing) {
      return Column(
        children: [
          _CircleBtn(
            icon: Icons.call_end, 
            label: 'إلغاء', 
            color: Colors.redAccent, 
            onTap: _cancelCall,
          ),
        ],
      );
    }
    
    // 2. INCOMING CALL (Ringing...) -> Accept (Green) and Decline (Red) Side by Side
    if (_mode == CallMode.incoming) {
      return Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _CircleBtn(
            icon: Icons.call, 
            label: 'قبول', 
            color: Colors.green, 
            onTap: _acceptCall,
          ),
          _CircleBtn(
            icon: Icons.call_end, 
            label: 'رفض', 
            color: Colors.redAccent, 
            onTap: _declineCall,
          ),
        ],
      );
    }
    
    // 3. ACTIVE CALL -> Mute (Mic), End (Red), and Speaker buttons
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        _CircleBtn(
          icon: _isMuted ? Icons.mic_off : Icons.mic, 
          label: _isMuted ? 'ملغى الكتم' : 'كتم',
          isActive: _isMuted,
          onTap: () => setState(() => _isMuted = !_isMuted),
        ),
        _CircleBtn(
          icon: Icons.call_end, 
          label: 'إنهاء', 
          color: Colors.redAccent, 
          onTap: _endCall,
        ),
        _CircleBtn(
          icon: _isSpeakerOn ? Icons.volume_up : Icons.volume_down, 
          label: 'مكبر الصوت',
          isActive: _isSpeakerOn,
          onTap: () => setState(() => _isSpeakerOn = !_isSpeakerOn),
        ),
      ],
    );
  }
}

class _CircleBtn extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color? color;
  final bool isActive;
  final VoidCallback onTap;

  const _CircleBtn({
    required this.icon,
    required this.label,
    this.color,
    this.isActive = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        GestureDetector(
          onTap: onTap,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            width: 65, height: 65,
            decoration: BoxDecoration(
              color: color ?? (isActive ? Colors.white : Colors.white12),
              shape: BoxShape.circle,
              boxShadow: isActive ? [BoxShadow(color: Colors.white.withValues(alpha: 0.3), blurRadius: 10)] : [],
            ),
            child: Icon(
              icon, 
              color: color != null ? Colors.white : (isActive ? const Color(0xFF2D4A2E) : Colors.white), 
              size: 30,
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(label, style: GoogleFonts.cairo(color: Colors.white70, fontSize: 12)),
      ],
    );
  }
}