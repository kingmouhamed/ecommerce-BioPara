// lib/patient/screens/patient_auth_wrapper.dart
// ═══════════════════════════════════════════════════
//  BioPara Patient Auth Wrapper — بدون Riverpod reactive watching
//  يستخدم Supabase stream مباشرةً بدل ref.watch لتفادي _dependents.isEmpty
// ═══════════════════════════════════════════════════
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'login_screen.dart';
import 'chat_screen.dart';
import '../../core/services/zego_call_service.dart';

class PatientAuthWrapper extends StatefulWidget {
  const PatientAuthWrapper({super.key});

  @override
  State<PatientAuthWrapper> createState() => _PatientAuthWrapperState();
}

class _PatientAuthWrapperState extends State<PatientAuthWrapper> {
  final _supabase = Supabase.instance.client;
  StreamSubscription<AuthState>? _authSub;

  // null = loading, '' = no user, non-empty = conversationId
  String? _conversationId;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _resolveUser();
  }

  Future<void> _resolveUser() async {
    // 1. تحقق من bypass (OTP مسبق)
    final prefs = await SharedPreferences.getInstance();
    final otpVerified = prefs.getBool('otp_verified') ?? false;

    if (!mounted) return;

    if (otpVerified) {
      // محاولة استخدام الجلسة الحالية
      final session = _supabase.auth.currentSession;
      if (session != null) {
        final uid = session.user.id;
        await ZegoCallService.instance.onUserLogin(uid, 'مريض BioPara');
        setState(() {
          _conversationId = uid;
          _loading = false;
        });
        return;
      }

      // محاولة تسجيل دخول مجهول صامت
      try {
        final resp = await _supabase.auth.signInAnonymously();
        final uid = resp.user?.id;
        if (uid != null && mounted) {
          await prefs.setString('saved_patient_user_id', uid);
          await ZegoCallService.instance.onUserLogin(uid, 'مريض BioPara');
          setState(() {
            _conversationId = uid;
            _loading = false;
          });
          return;
        }
      } catch (_) {}

      // استخدام المعرف المحفوظ كملاذ أخير
      final saved = prefs.getString('saved_patient_user_id');
      if (saved != null && mounted) {
        setState(() {
          _conversationId = saved;
          _loading = false;
        });
        return;
      }
    }

    // 2. تحقق من الجلسة العادية
    final session = _supabase.auth.currentSession;
    if (session != null) {
      final uid = session.user.id;
      final isAdmin = await _checkIsAdmin(uid);
      if (!mounted) return;
      if (isAdmin) {
        // المسؤول لا يدخل من تطبيق المريض
        await _supabase.auth.signOut();
        if (!mounted) return;
        setState(() { _conversationId = null; _loading = false; });
      } else {
        await ZegoCallService.instance.onUserLogin(uid, 'مريض BioPara');
        setState(() { _conversationId = uid; _loading = false; });
      }
      return;
    }

    // 3. لا توجد جلسة — اظهر تسجيل الدخول
    if (!mounted) return;
    setState(() { _conversationId = null; _loading = false; });

    // 4. الاستماع لتغييرات المصادقة مستقبلاً
    _authSub = _supabase.auth.onAuthStateChange.listen((event) async {
      if (!mounted) return;
      final session = event.session;
      if (session == null) {
        if (mounted) setState(() { _conversationId = null; });
        return;
      }
      final uid = session.user.id;
      final isAdmin = await _checkIsAdmin(uid);
      if (!mounted) return;
      if (isAdmin) {
        await _supabase.auth.signOut();
        if (mounted) setState(() { _conversationId = null; });
      } else {
        await ZegoCallService.instance.onUserLogin(uid, 'مريض BioPara');
        if (mounted) setState(() { _conversationId = uid; });
      }
    });
  }

  Future<bool> _checkIsAdmin(String uid) async {
    try {
      final data = await _supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', uid)
          .maybeSingle();
      return data?['is_admin'] as bool? ?? false;
    } catch (_) {
      return false;
    }
  }

  @override
  void dispose() {
    _authSub?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        backgroundColor: Color(0xFFF5F0E8),
        body: Center(
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF3D5A3E)),
          ),
        ),
      );
    }

    if (_conversationId != null && _conversationId!.isNotEmpty) {
      return ChatScreen(conversationId: _conversationId!);
    }

    return const LoginScreen();
  }
}
