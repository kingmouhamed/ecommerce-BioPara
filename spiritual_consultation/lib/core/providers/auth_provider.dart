import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter/foundation.dart';

class Auth {
  final GoTrueClient _client = Supabase.instance.client.auth;

  /// تسجيل Ø§Ù„Ø¯Ø®Ùˆل بالبريد ÙˆÙƒلمة Ø§Ù„Ù…Ø±Ùˆر
  Future<void> signIn(String email, String password) async {
    await _client.signInWithPassword(email: email, password: password);
  }

  /// Ø¥Ù†شاء حساب جديد
  Future<void> signUp(String email, String password) async {
    await _client.signUp(email: email, password: password);
  }

  /// تسجيل Ø§Ù„Ø¯Ø®Ùˆل Ø¨Ø§Ù„Ù‡اتف (إرسال OTP)
  Future<void> signInWithPhone(String phone) async {
    await _client.signInWithOtp(phone: phone);
  }

  /// Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† رمز OTP
  Future<void> verifyOtp(String phone, String token) async {
    // ØªÙ†ظيف الرمز Ù…Ù† أي مسافات
    final cleanToken = token.trim().replaceAll(' ', '');
    await _client.verifyOTP(
      phone: phone,
      token: cleanToken,
      type: OtpType.sms,
    );
  }

  /// تسجيل Ø§Ù„Ø®Ø±Ùˆج
  Future<void> signOut() async {
    await _client.signOut();
  }

  /// المستخدم الحالي
  User? get currentUser => _client.currentUser;

  /// هل المستخدم مسجّل دخوله؟
  bool get isLoggedIn => _client.currentUser != null;

  /// بريد المستخدم الحالي
  String get userEmail => _client.currentUser?.email ?? '';

  /// ID المستخدم الحالي
  String get userId => _client.currentUser?.id ?? 'guest_user';
}

final authProvider = Provider((ref) => Auth());

/// Ù…Ø²Ùˆد حالة تغيير Ø§Ù„Ù…ØµØ§Ø¯Ù‚ة (stream) â€” ÙŠÙØ³ØªØ®Ø¯Ù… في AuthWrapper
final authStateProvider = StreamProvider<AuthState>((ref) {
  return Supabase.instance.client.auth.onAuthStateChange;
});

/// يجلب is_admin مباشرة من جدول profiles â€” يُعاد Ø­Ø³Ø§Ø¨Ù‡ Ø¹Ù†د Ùƒل تغيير ÙÙŠ Ø§Ù„Ù…ØµØ§Ø¯Ù‚ة
final isAdminProvider = FutureProvider<bool>((ref) async {
  // ✅ المفتاح: Ù†Ø±Ø§Ù‚ب authState Ø­ØªÙ‰ يُعاد حساب Ù‡ذا Provider Ø¹Ù†د تسجيل الدخول/Ø§Ù„Ø®Ø±Ùˆج
  final authState = ref.watch(authStateProvider);

  // إذا ÙƒØ§Ù†ت الجلسة لا تزال ØªÙØ­Ù…ÙŽÙ‘Ù„ØŒ Ø§Ù†تظر
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
      debugPrint('âš ï¸ Admin Check: Profile not found for UID: ${user.id}');
      return false;
    }

    final isAdmin = data['is_admin'] as bool? ?? false;
    debugPrint('✅ Admin Check Result: $isAdmin for ${user.email}');
    return isAdmin;
  } catch (e) {
    debugPrint('âŒ Admin Check Error: $e');
    return false;
  }
});
