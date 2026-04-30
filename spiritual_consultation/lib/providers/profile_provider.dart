import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/profile_model.dart';

final profileProvider = FutureProvider<Profile?>((ref) async {
  final supabase = Supabase.instance.client;
  final userId = supabase.auth.currentUser?.id;
  
  if (userId == null) return null;

  final response = await supabase
      .from('profiles')
      .select()
      .eq('id', userId)
      .maybeSingle();
  
  if (response == null) return null;
  return Profile.fromMap(response);
});
