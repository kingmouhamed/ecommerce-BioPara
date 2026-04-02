import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class Auth {
  final GoTrueClient _client = Supabase.instance.client.auth;

  /// تسجيل الدخول بالبريد وكلمة المرور
  Future<void> signIn(String email, String password) async {
    await _client.signInWithPassword(email: email, password: password);
  }

  /// إنشاء حساب جديد
  Future<void> signUp(String email, String password) async {
    await _client.signUp(email: email, password: password);
  }

  /// تسجيل الخروج
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

/// مزود حالة تغيير المصادقة (stream) — يُستخدم في AuthWrapper
final authStateProvider = StreamProvider<AuthState>((ref) {
  return Supabase.instance.client.auth.onAuthStateChange;
});
