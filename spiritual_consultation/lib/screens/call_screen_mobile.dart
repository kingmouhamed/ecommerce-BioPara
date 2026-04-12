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
  int appID = int.tryParse(dotenv.env['ZEGO_APP_ID'] ?? '0') ?? 0;
  String appSign = dotenv.env['ZEGO_APP_SIGN'] ?? '';

  return SafeArea(
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
  );
}
