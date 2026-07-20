import 'package:flutter/material.dart';

// على الويب لا نستخدم Zego - هذا الملف بديل فارغ
Widget buildMobileCallScreen(
  BuildContext context,
  String callID,
  String userID,
  String userName,
  bool isVideoCall, {
  String conversationId = '',
  Future<void> Function()? onCallEnd,
}) {
  // لن يتم استدعاء هذا الكود على الويب لأن call_screen.dart يتحقق من kIsWeb أولاً
  return const SizedBox.shrink();
}