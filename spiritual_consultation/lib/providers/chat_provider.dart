import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

/// Riverpod StreamProvider for listening to Supabase Realtime messages - FIXED with null safety
final chatStreamProvider =
    StreamProvider.family<List<Map<String, dynamic>>, String>((
      ref,
      consultationId,
    ) {
      return Supabase.instance.client
          .from('messages')
          .stream(primaryKey: ['id'])
          .eq('consultation_id', consultationId)
          .order('created_at', ascending: false)
          .limit(100);
    });
