import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter/foundation.dart';

import 'package:shared_preferences/shared_preferences.dart';

class Auth {
  final GoTrueClient _client = Supabase.instance.client.auth;

  Future<void> signIn(String email, String password) async {
    await _client.signInWithPassword(email: email, password: password);
  }

  Future<void> signUp(String email, String password) async {
    await _client.signUp(email: email, password: password);
  }

  Future<void> signInWithPhone(String phone, {bool isWhatsApp = false}) async {
    await _client.signInWithOtp(
      phone: phone,
      channel: isWhatsApp ? OtpChannel.whatsapp : OtpChannel.sms,
    );
  }

  Future<void> verifyOtp(String phone, String token) async {
    final cleanToken = token.trim().replaceAll(' ', '');
    await _client.verifyOTP(
      phone: phone,
      token: cleanToken,
      type: OtpType.sms,
    );
  }

  Future<void> signOut() async {
    await _client.signOut();
  }

  User? get currentUser => _client.currentUser;
  bool get isLoggedIn => _client.currentUser != null;
  String get userEmail => _client.currentUser?.email ?? '';
  String get userId => _client.currentUser?.id ?? 'guest_user';
}

final authProvider = Provider((ref) => Auth());

/// مزود حالة تغيير المصادقة (stream)
final authStateProvider = StreamProvider<AuthState>((ref) {
  return Supabase.instance.client.auth.onAuthStateChange;
});

/// مزود لتفادي شاشة تسجيل الدخول للمريض الذي تحقق سابقاً
final patientBypassProvider = FutureProvider<String?>((ref) async {
  final prefs = await SharedPreferences.getInstance();
  final otpVerified = prefs.getBool('otp_verified') ?? false;
  if (!otpVerified) return null;

  final client = Supabase.instance.client;
  final currentSession = client.auth.currentSession;
  if (currentSession != null) {
    final userId = currentSession.user.id;
    await prefs.setString('saved_patient_user_id', userId);
    return userId;
  }

  // إذا كانت الجلسة فارغة ولكن تحقق سابقاً، نقوم بتسجيل دخول مجهول صامت لتأمين الصلاحيات
  try {
    debugPrint('🔄 Patient verified OTP before but session is null. Silent anonymous login...');
    final authResponse = await client.auth.signInAnonymously();
    final newUserId = authResponse.user?.id;
    if (newUserId != null) {
      await prefs.setString('saved_patient_user_id', newUserId);
      return newUserId;
    }
  } catch (e) {
    debugPrint('⚠️ Silent anonymous login fallback failed: $e');
  }

  return prefs.getString('saved_patient_user_id');
});

// ── Admin profile provider ──────────────────────────────────────────
/// يجلب بيانات الملف الشخصي الكامل للمسؤول من جدول profiles
final adminProfileProvider = FutureProvider<Map<String, dynamic>?>((ref) async {
  final authState = ref.watch(authStateProvider);
  final session = authState.valueOrNull?.session;
  if (session == null) return null;
  try {
    final data = await Supabase.instance.client
        .from('profiles')
        .select('id, full_name, avatar_url, is_admin')
        .eq('id', session.user.id)
        .maybeSingle();
    return data;
  } catch (e) {
    debugPrint('❌ adminProfileProvider error: $e');
    return null;
  }
});

/// يجلب is_admin مباشرة من جدول profiles — يُعاد حسابه عند كل تغيير في المصادقة
/// لا تستخدم أبداً email.startsWith('admin') — هذا هو الفحص الآمن
final isAdminProvider = FutureProvider<bool>((ref) async {
  final authState = ref.watch(authStateProvider);
  final session = authState.valueOrNull?.session;
  if (session == null) return false;

  try {
    final user = session.user;

    final data = await Supabase.instance.client
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle();

    if (data == null) {
      debugPrint('⚠️ Admin Check: Profile not found for UID: ${user.id}');
      return false;
    }

    final isAdmin = data['is_admin'] as bool? ?? false;
    debugPrint('✅ Admin Check Result: $isAdmin for ${user.email}');
    return isAdmin;
  } catch (e) {
    debugPrint('❌ Admin Check Error: $e');
    return false;
  }
});
