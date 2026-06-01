import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter/foundation.dart';


/// Helper to check database schema from within the app context.
/// You can call this from your main_admin.dart temporarily.
Future<void> debugCheckSchema() async {
  final db = Supabase.instance.client;
  debugPrint('--- Debug: Checking conversations schema ---');
  try {
    // Try to fetch one row with all columns
    final res = await db.from('conversations').select().limit(1).maybeSingle();
    if (res != null) {
      debugPrint('✅ Columns found in conversations: ${res.keys.join(", ")}');
    } else {
      debugPrint('ℹ️ Table conversations is empty, but query succeeded.');
    }
  } catch (e) {
    debugPrint('❌ Error checking conversations: $e');
  }

  debugPrint('\n--- Debug: Checking messages schema ---');
  try {
    final res = await db.from('messages').select().limit(1).maybeSingle();
    if (res != null) {
      debugPrint('✅ Columns found in messages: ${res.keys.join(", ")}');
    }
  } catch (e) {
    debugPrint('❌ Error checking messages: $e');
  }

  debugPrint('\n--- Debug: Checking intake_forms schema ---');
  try {
    final res = await db.from('intake_forms').select().limit(1).maybeSingle();
    if (res != null) {
      debugPrint('✅ Columns found in intake_forms: ${res.keys.join(", ")}');
    }
  } catch (e) {
    debugPrint('❌ Error checking intake_forms: $e');
  }
}
