import 'package:flutter/material.dart';
import 'package:zego_uikit_prebuilt_call/zego_uikit_prebuilt_call.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

Widget buildMobileCallScreen(
  BuildContext context,
  String callID,
  String userID,
  String userName,
  bool isVideoCall,
) {
  final rawAppID = dotenv.env['ZEGO_APP_ID'];
  final appSign = dotenv.env['ZEGO_APP_SIGN'] ?? '';
  final appID = int.tryParse(rawAppID ?? '') ?? 0;

  if (appID == 0 || appSign.isEmpty) {
    return const Scaffold(body: Center(child: Text('خطأ في إعدادات الاتصال')));
  }

  // تنظيف المعرفات لضمان التوافق (إزالة المسافات أو الرموز الغريبة)
  final safeUserID = userID.replaceAll(RegExp(r'[^a-zA-Z0-9]'), '_');
  final safeCallID = callID.replaceAll(RegExp(r'[^a-zA-Z0-9]'), '_');

  return Scaffold(
    backgroundColor: Colors.black,
    appBar: AppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      leading: IconButton(
        icon: const Icon(Icons.close, color: Colors.white),
        onPressed: () => Navigator.pop(context),
      ),
    ),
    body: SafeArea(
      child: ZegoUIKitPrebuiltCall(
        appID: appID,
        appSign: appSign,
        userID: safeUserID,
        userName: userName,
        callID: safeCallID,
        config: isVideoCall
            ? ZegoUIKitPrebuiltCallConfig.oneOnOneVideoCall()
            : ZegoUIKitPrebuiltCallConfig.oneOnOneVoiceCall(),
      ),
    ),
  );
}