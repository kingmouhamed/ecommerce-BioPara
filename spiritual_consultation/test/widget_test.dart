import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:spiritual_consultation/main.dart';
import 'package:spiritual_consultation/patient/screens/chat_screen.dart';

void main() {
  group('BioPara Spiritual App Tests', () {
    setUpAll(() async {
      TestWidgetsFlutterBinding.ensureInitialized();
      SharedPreferences.setMockInitialValues({});
      await dotenv.load(fileName: '.env');
      try {
        await Supabase.initialize(
          url: dotenv.env['SUPABASE_URL']!,
          anonKey: dotenv.env['SUPABASE_ANON_KEY']!,
        );
      } catch (_) {
        // Supabase may already be initialized in test environment
      }
    });

    testWidgets('App renders without exploding', (WidgetTester tester) async {
      await tester.pumpWidget(
        const ProviderScope(child: BioParaSpiritualApp()),
      );
      expect(find.byType(MaterialApp), findsOneWidget);
    });

    testWidgets('ChatScreen can be constructed', (WidgetTester tester) async {
      const screen = ChatScreen(
        conversationId: '00000000-0000-0000-0000-000000000000',
      );

      expect(screen, isA<ChatScreen>());
    });
  });
}
