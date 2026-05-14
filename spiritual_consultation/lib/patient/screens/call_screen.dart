import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';

// استيراد Zego ÙÙ‚ط Ø¹Ù„Ù‰ Ø§Ù„Ù…Ù†صات غير Ø§Ù„Ùˆيب
import 'call_screen_mobile.dart' if (dart.library.html) 'call_screen_web.dart';

class CallScreen extends StatelessWidget {
  final String callID;
  final String userID;
  final String userName;
  final bool isVideoCall;

  const CallScreen({
    super.key,
    required this.callID,
    required this.userID,
    required this.userName,
    this.isVideoCall = true,
  });

  @override
  Widget build(BuildContext context) {
    // Ø¹Ù„Ù‰ Ø§Ù„Ùˆيب: Ø¥Ø¸Ù‡ار رسالة Ùˆاضحة Ø¨Ø¯Ù„Ø§Ù‹ Ù…Ù† Ø§Ù„Ø§Ù†Ù‡يار
    if (kIsWeb) {
      return Scaffold(
        backgroundColor: const Color(0xFF1B5E20),
        appBar: AppBar(
          backgroundColor: const Color(0xFF1B5E20),
          foregroundColor: Colors.white,
          title: const Text('Ø§Ù„Ù…Ùƒالمة'),
        ),
        body: const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.phone_disabled, color: Colors.white70, size: 64),
              SizedBox(height: 20),
              Text(
                'Ø§Ù„Ù…Ùƒالمات غير Ù…Ø¯Ø¹Ùˆمة Ø¹Ù„Ù‰ المتصفح',
                style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 10),
              Text(
                'ÙŠØ±Ø¬Ù‰ استخدام ØªØ·Ø¨ÙŠÙ‚ Ø§Ù„Ù‡اتف Ù„Ù„Ù…Ùƒالمات',
                style: TextStyle(color: Colors.white70, fontSize: 14),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      );
    }

    // على الجوال: تشغيل Zego بشكل طبيعي
    return buildMobileCallScreen(context, callID, userID, userName, isVideoCall);
  }
}
