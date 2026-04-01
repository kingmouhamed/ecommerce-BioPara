import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class Auth {
  final GoTrueClient _client = Supabase.instance.client.auth;

  Future<void> signIn(String email, String password) async {
    await _client.signInWithPassword(email: email, password: password);
  }

  Future<void> signOut() async {
    await _client.signOut();
  }

  User? get currentUser => _client.currentUser;
}

final authProvider = Provider((ref) => Auth());
