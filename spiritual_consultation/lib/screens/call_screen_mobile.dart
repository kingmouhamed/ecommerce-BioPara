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

  debugPrint('📞 Zego Call Init: ID=$callID, User=$userID, Name=$userName, AppID=$appID');

  if (appID == 0 || appSign.isEmpty) {
    return Scaffold(
      body: Center(
        child: Text(
          'خطأ في إعدادات الاتصال (ZEGO_APP_ID/SIGN missing)',
          style: TextStyle(color: Colors.red),
        ),
      ),
    );
  }

  return Scaffold(
    body: SafeArea(
      child: ZegoUIKitPrebuiltCall(
        appID: appID,
        appSign: appSign,
        userID: userID,
        userName: userName,
        callID: callID,
        config: isVideoCall
            ? ZegoUIKitPrebuiltCallConfig.oneOnOneVideoCall()
            : ZegoUIKitPrebuiltCallConfig.oneOnOneVoiceCall(),
      ),
    ),
  );
}
