import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class PresenceState {
  final bool isTyping;
  final bool isRecording;
  const PresenceState({this.isTyping = false, this.isRecording = false});
}

class PresenceNotifier extends StateNotifier<PresenceState> {
  final String conversationId;
  final _supabase = Supabase.instance.client;
  RealtimeChannel? _channel;
  
  PresenceNotifier(this.conversationId) : super(const PresenceState()) {
    _init();
  }

  void _init() {
    _channel = _supabase.channel('presence_$conversationId');
    
    _channel!
      .onPresenceSync((_) {
        final presenceStateMap = _channel!.presenceState();
        bool typing = false;
        bool recording = false;
        
        final myId = _supabase.auth.currentUser?.id;
        
        for (final presence in presenceStateMap) {
          for (final p in presence.presences) {
            if (p.payload['user_id'] != myId) {
              if (p.payload['isTyping'] == true) typing = true;
              if (p.payload['isRecording'] == true) recording = true;
            }
          }
        }
        
        if (mounted) {
          state = PresenceState(isTyping: typing, isRecording: recording);
        }
      })
      .subscribe((status, error) {
        if (status == RealtimeSubscribeStatus.subscribed) {
          _updatePresence(false, false);
        }
      });
  }

  Future<void> updateTyping(bool typing) async {
    await _updatePresence(typing, state.isRecording);
  }

  Future<void> updateRecording(bool recording) async {
    await _updatePresence(state.isTyping, recording);
  }

  Future<void> _updatePresence(bool typing, bool recording) async {
    if (_channel != null) {
      final myId = _supabase.auth.currentUser?.id;
      if (myId == null) return;
      
      try {
        await _channel!.track({
          'user_id': myId,
          'isTyping': typing,
          'isRecording': recording,
        });
      } catch (_) {}
    }
  }

  @override
  void dispose() {
    _channel?.unsubscribe();
    super.dispose();
  }
}

final presenceProvider =
    StateNotifierProvider.family<PresenceNotifier, PresenceState, String>(
  (ref, id) => PresenceNotifier(id),
);
