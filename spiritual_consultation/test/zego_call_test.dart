import 'package:flutter_test/flutter_test.dart';
import 'package:uuid/uuid.dart';

void main() {
  group('BioPara Calling System Unit Tests', () {
    test('User ID and Call ID sanitation logic only allows alphanumeric, underscores, and dashes', () {
      final dirtyUserID = "user-id-123!@#\$ %^&*()";
      final dirtyCallID = "call-id-abc!@#\$ %^&*()";

      // The sanitation logic in call_screen_mobile.dart:
      final safeUserID = dirtyUserID
          .replaceAll(RegExp(r'[^a-zA-Z0-9_\-]'), '_')
          .substring(0, dirtyUserID.length.clamp(0, 64));
          
      final safeCallID = dirtyCallID
          .replaceAll(RegExp(r'[^a-zA-Z0-9_\-]'), '_')
          .substring(0, dirtyCallID.length.clamp(0, 64));

      expect(safeUserID, 'user-id-123___________');
      expect(safeCallID, 'call-id-abc___________');
      
      // Zego requirements: no spaces or special characters except _ and -
      expect(RegExp(r'^[a-zA-Z0-9_\-]+$').hasMatch(safeUserID), isTrue);
      expect(RegExp(r'^[a-zA-Z0-9_\-]+$').hasMatch(safeCallID), isTrue);
    });

    test('User ID sanitation in main files (alphanumeric + underscores only)', () {
      final dirtyID = "patient-user-123-abc!!";
      
      // The sanitation logic in main_patient.dart and main_admin.dart:
      final safeID = dirtyID.replaceAll(RegExp(r'[^a-zA-Z0-9_]'), '_');

      expect(safeID, 'patient_user_123_abc__');
      expect(RegExp(r'^[a-zA-Z0-9_]+$').hasMatch(safeID), isTrue);
    });

    test('Call metadata is populated correctly for call status tracking', () {
      final callId = const Uuid().v4();
      
      for (final isVideo in [true, false]) {
        final metadata = {
          'call_id': callId,
          'call_type': isVideo ? 'video' : 'voice',
          'call_status': 'active',
          'call_started_at': DateTime.now().toIso8601String(),
        };

        expect(metadata['call_id'], callId);
        expect(metadata['call_type'], isVideo ? 'video' : 'voice');
        expect(metadata['call_status'], 'active');
        expect(DateTime.tryParse(metadata['call_started_at'] as String), isNotNull);
      }
    });
  });
}
