import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class CallOverlay extends StatefulWidget {
  final String name;
  final bool isVideo;
  final VoidCallback onEnd;

  const CallOverlay({
    super.key,
    required this.name,
    this.isVideo = false,
    required this.onEnd,
  });

  @override
  State<CallOverlay> createState() => _CallOverlayState();
}

class _CallOverlayState extends State<CallOverlay> {
  bool _isMuted = false;
  bool _isSpeakerOn = false;
  final bool _isVideoOff = false;

  @override
  Widget build(BuildContext context) {
    const primary = Color(0xFF0D6E6E);
    
    return Scaffold(
      body: Container(
        width: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [primary, Color(0xFF074D4D)],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              const SizedBox(height: 60),
              CircleAvatar(
                radius: 60,
                backgroundColor: Colors.white24,
                child: Text(
                  widget.name.isNotEmpty ? widget.name[0] : '?',
                  style: const TextStyle(fontSize: 40, color: Colors.white, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 24),
              Text(
                widget.name,
                style: GoogleFonts.cairo(fontSize: 28, color: Colors.white, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                widget.isVideo 
                  ? (_isVideoOff ? 'Ø§Ù„Ùƒاميرا Ù…ØªÙˆÙ‚فة' : 'Ù…Ùƒالمة ÙÙŠØ¯ÙŠÙˆ جارية...') 
                  : 'Ù…Ùƒالمة ØµÙˆتية جارية...',
                style: GoogleFonts.cairo(fontSize: 16, color: Colors.white70),
              ),
              const Spacer(),
              if (widget.isVideo)
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 24),
                  height: 300,
                  decoration: BoxDecoration(
                    color: Colors.black26,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: Colors.white24),
                  ),
                  child: Center(
                    child: Icon(
                      _isVideoOff ? Icons.videocam_off : Icons.videocam, 
                      color: _isVideoOff ? Colors.redAccent : Colors.white54, 
                      size: 50
                    ),
                  ),
                ),
              const Spacer(),
              Padding(
                padding: const EdgeInsets.only(bottom: 60),
                child: Row(
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
                      label: 'Ø¥Ù†Ù‡اء', 
                      color: Colors.red, 
                      onTap: widget.onEnd,
                    ),
                    _CircleBtn(
                      icon: _isSpeakerOn ? Icons.volume_up : Icons.volume_down, 
                      label: 'Ù…Ùƒبر Ø§Ù„ØµÙˆت',
                      isActive: _isSpeakerOn,
                      onTap: () => setState(() => _isSpeakerOn = !_isSpeakerOn),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
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
              color: color != null ? Colors.white : (isActive ? const Color(0xFF0D6E6E) : Colors.white), 
              size: 30
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(label, style: GoogleFonts.cairo(color: Colors.white70, fontSize: 12)),
      ],
    );
  }
}
