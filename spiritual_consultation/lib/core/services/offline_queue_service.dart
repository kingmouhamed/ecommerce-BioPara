import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class OfflineQueueService {
  static const String _queueKey = 'offline_message_queue';

  static Future<void> enqueueMessage(Map<String, dynamic> messagePayload) async {
    final prefs = await SharedPreferences.getInstance();
    final List<String> queue = prefs.getStringList(_queueKey) ?? [];
    queue.add(jsonEncode(messagePayload));
    await prefs.setStringList(_queueKey, queue);
  }

  static Future<void> syncQueue() async {
    final prefs = await SharedPreferences.getInstance();
    final List<String> queue = prefs.getStringList(_queueKey) ?? [];
    if (queue.isEmpty) return;

    final client = Supabase.instance.client;
    List<String> remainingQueue = [];

    for (String item in queue) {
      try {
        final payload = jsonDecode(item) as Map<String, dynamic>;
        await client.from('messages').insert(payload);
      } catch (e) {
        remainingQueue.add(item); // Keep it in queue if failed
      }
    }

    await prefs.setStringList(_queueKey, remainingQueue);
  }
}
