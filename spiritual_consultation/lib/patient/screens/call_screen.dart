import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';

import 'call_screen_mobile.dart' if (dart.library.html) 'call_screen_web.dart';

class CallScreen extends StatelessWidget {
  final String callID;
  final String userID;
  final String userName;
  final bool isVideoCall;

  /// Conversation ID — required by the mobile screen for its own
  /// Supabase subscription (detects admin's call_end in real time).
  final String conversationId;

  /// Optional extra cleanup for the caller (call_overlay.dart).
  /// The mobile screen handles the Supabase call_end signal itself.
  final Future<void> Function()? onCallEnd;

  const CallScreen({
    super.key,
    required this.callID,
    required this.userID,
    required this.userName,
    this.isVideoCall = true,
    this.conversationId = '',
    this.onCallEnd,
  });

  @override
  Widget build(BuildContext context) {
    if (kIsWeb) {
      return Scaffold(
        backgroundColor: const Color(0xFF1B5E20),
        appBar: AppBar(
          backgroundColor: const Color(0xFF1B5E20),
          foregroundColor: Colors.white,
          title: const Text('المكالمة'),
          leading: Directionality(
            textDirection: TextDirection.ltr,
            child: IconButton(
              icon: const Icon(Icons.arrow_back, color: Colors.white),
              onPressed: () => Navigator.pop(context),
            ),
          ),
        ),
        body: const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.phone_disabled, color: Colors.white70, size: 64),
              SizedBox(height: 20),
              Text(
                'المكالمات غير مدعومة على المتصفح',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 10),
              Text(
                'يرجى استخدام تطبيق الهاتف للمكالمات',
                style: TextStyle(color: Colors.white70, fontSize: 14),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      );
    }

    return buildMobileCallScreen(
      context,
      callID,
      userID,
      userName,
      isVideoCall,
      conversationId: conversationId,
      onCallEnd: onCallEnd,
    );
  }
}
