import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:zego_uikit_prebuilt_call/zego_uikit_prebuilt_call.dart';

import '../../core/config/app_config.dart';

Widget buildMobileCallScreen(
  BuildContext context,
  String callID,
  String userID,
  String userName,
  bool isVideoCall,
) {
  final rawAppID = AppConfig.zegoAppId;
  final appSign = AppConfig.zegoAppSign;
  final appID = int.tryParse(rawAppID) ?? 0;

  if (appID == 0 || appSign.isEmpty) {
    return _errorScreen(context, 'خطأ في إعدادات الاتصال\nتحقق من ملف .env');
  }

  // ✅ Sanitize: Zego accepts [a-zA-Z0-9_-] only, max 64 chars
  final safeUserID = userID
      .replaceAll(RegExp(r'[^a-zA-Z0-9_\-]'), '_')
      .substring(0, userID.length.clamp(0, 64));
  final safeCallID = callID
      .replaceAll(RegExp(r'[^a-zA-Z0-9_\-]'), '_')
      .substring(0, callID.length.clamp(0, 64));

  // ✅ Build call config (WhatsApp-like)
  final config = isVideoCall
      ? ZegoUIKitPrebuiltCallConfig.oneOnOneVideoCall()
      : ZegoUIKitPrebuiltCallConfig.oneOnOneVoiceCall();

  // ✅ توجيه الصوت لمكبّر الصوت عند الانضمام (يتجنّب سمّاعة الأذن الصامتة
  //    بعد نزع البلوتوث). UIKit يبدّل تلقائياً للبلوتوث عند توصيله.
  config.useSpeakerWhenJoining = true;

  // ✅ Custom avatar — green circle with initial letter
  config.avatarBuilder = (ctx, size, user, _) => Container(
    width: size.width,
    height: size.height,
    decoration: const BoxDecoration(
      shape: BoxShape.circle,
      gradient: LinearGradient(
        colors: [Color(0xFF2E7D32), Color(0xFF0D6E6E)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
    ),
    child: Center(
      child: Text(
        (user?.name.isNotEmpty == true) ? user!.name[0].toUpperCase() : '؟',
        style: TextStyle(
          color: Colors.white,
          fontSize: size.width * 0.4,
          fontWeight: FontWeight.bold,
        ),
      ),
    ),
  );

  // ✅ Hang up confirmation — like WhatsApp
  config.hangUpConfirmDialog = ZegoCallHangUpConfirmDialogConfig(
    info:
        ZegoCallHangUpConfirmDialogInfo(
            title: 'إنهاء المكالمة',
            message: 'هل تريد إنهاء المكالمة؟',
          )
          ..cancelButtonName = 'إلغاء'
          ..confirmButtonName = 'إنهاء',
  );

  // ✅ For voice call: show caller name at top
  if (!isVideoCall) {
    config.topMenuBar.isVisible = true;
    config.topMenuBar.title = userName;
  }

  return Scaffold(
    backgroundColor: isVideoCall ? Colors.black : const Color(0xFF1B5E20),
    body: SafeArea(
      child: ZegoUIKitPrebuiltCall(
        appID: appID,
        appSign: appSign,
        userID: safeUserID,
        userName: userName,
        callID: safeCallID,
        config: config,
        events: ZegoUIKitPrebuiltCallEvents(
          onCallEnd: (event, defaultAction) {
            HapticFeedback.mediumImpact();
            defaultAction.call();
          },
        ),
        onDispose: () {
          debugPrint('📞 ZegoUIKitPrebuiltCall disposed');
        },
      ),
    ),
  );
}

Widget _errorScreen(BuildContext context, String message) {
  return Scaffold(
    backgroundColor: const Color(0xFF1B5E20),
    appBar: AppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      leading: IconButton(
        icon: const Icon(Icons.close, color: Colors.white),
        onPressed: () => Navigator.pop(context),
      ),
    ),
    body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, color: Colors.white70, size: 64),
          const SizedBox(height: 16),
          Text(
            message,
            style: GoogleFonts.tajawal(color: Colors.white, fontSize: 16),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    ),
  );
}
