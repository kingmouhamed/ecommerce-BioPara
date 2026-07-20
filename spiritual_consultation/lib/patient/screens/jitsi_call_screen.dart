// lib/patient/screens/jitsi_call_screen.dart
// ═══════════════════════════════════════════════════════════
//  BioPara — شاشة مكالمة Jitsi داخل WebView
//  تعمل على Windows / macOS / Linux (WebView2) و Android / iOS.
//  الطرفان (المريض والمسؤول) يدخلان نفس الغرفة المشتقة من callId،
//  فتتم المكالمة الصوتية/المرئية الحقيقية عبر WebRTC (Jitsi Meet).
//
//  ملاحظة: الإشارة (رنين/قبول/رفض) تُدار في CallOverlay عبر Supabase،
//  وهذه الشاشة مسؤولة فقط عن الوسائط (الصوت/الفيديو).
// ═══════════════════════════════════════════════════════════
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

class JitsiCallScreen extends StatefulWidget {
  /// اسم الغرفة (يجب أن يكون متطابقاً عند الطرفين).
  final String room;

  /// الاسم المعروض داخل المكالمة.
  final String displayName;

  /// مكالمة فيديو أم صوتية فقط.
  final bool isVideo;

  /// يُستدعى عند إنهاء المكالمة (لإبلاغ CallOverlay وإغلاق الإشارة).
  final VoidCallback? onHangup;

  const JitsiCallScreen({
    super.key,
    required this.room,
    required this.displayName,
    this.isVideo = false,
    this.onHangup,
  });

  @override
  State<JitsiCallScreen> createState() => _JitsiCallScreenState();
}

class _JitsiCallScreenState extends State<JitsiCallScreen> {
  bool _loading = true;

  /// رابط غرفة Jitsi مع إعدادات تبسّط الواجهة وتبدأ الفيديو حسب نوع المكالمة.
  String get _jitsiUrl {
    final encodedName = Uri.encodeComponent(widget.displayName);
    // startWithVideoMuted = true في المكالمة الصوتية فقط
    final videoMuted = widget.isVideo ? 'false' : 'true';
    return 'https://meet.jit.si/${widget.room}'
        '#userInfo.displayName=%22$encodedName%22'
        '&config.startWithVideoMuted=$videoMuted'
        '&config.startWithAudioMuted=false'
        '&config.prejoinPageEnabled=false'
        '&config.disableDeepLinking=true'
        '&interfaceConfig.MOBILE_APP_PROMO=false';
  }

  Future<void> _hangup() async {
    widget.onHangup?.call();
    if (mounted) Navigator.of(context).maybePop();
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) _hangup();
      },
      child: Scaffold(
        backgroundColor: Colors.black,
        body: SafeArea(
          child: Stack(
            children: [
              InAppWebView(
                initialUrlRequest: URLRequest(url: WebUri(_jitsiUrl)),
                initialSettings: InAppWebViewSettings(
                  mediaPlaybackRequiresUserGesture: false,
                  allowsInlineMediaPlayback: true,
                  javaScriptEnabled: true,
                  iframeAllow: 'camera; microphone; fullscreen; display-capture; autoplay',
                  iframeAllowFullscreen: true,
                ),
                // منح صلاحيات الكاميرا/المايك تلقائياً (Android/iOS/Windows WebView2)
                onPermissionRequest: (controller, request) async {
                  return PermissionResponse(
                    resources: request.resources,
                    action: PermissionResponseAction.GRANT,
                  );
                },
                onLoadStop: (controller, url) {
                  if (mounted) setState(() => _loading = false);
                },
                onReceivedError: (controller, request, error) {
                  if (mounted) setState(() => _loading = false);
                },
              ),

              if (_loading)
                Container(
                  color: Colors.black,
                  child: Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const CircularProgressIndicator(color: Color(0xFF4CAF78)),
                        const SizedBox(height: 16),
                        Text(
                          'جاري الاتصال...',
                          style: GoogleFonts.tajawal(color: Colors.white70, fontSize: 14),
                        ),
                      ],
                    ),
                  ),
                ),

              // زر إنهاء المكالمة (احتياطي فوق واجهة Jitsi)
              Positioned(
                bottom: 24,
                left: 0,
                right: 0,
                child: Center(
                  child: GestureDetector(
                    onTap: _hangup,
                    child: Container(
                      width: 64,
                      height: 64,
                      decoration: const BoxDecoration(
                        color: Color(0xFFE53935),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.call_end_rounded,
                          color: Colors.white, size: 30),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
