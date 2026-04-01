import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'screens/chat_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // HTML Renderer is usually set via CLI (flutter run -d chrome --web-renderer html).

  try {
    // Initialize Supabase with the provided URL and Anon Key
    await Supabase.initialize(
      url: 'https://fvtkbnoodktzumzkxtkv.supabase.co',
      anonKey:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2dGtibm9vZGt0enVtemt4dGt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNzMwMzAsImV4cCI6MjA4NDc0OTAzMH0.C35VopeG7wTzVo0opnCO0Ru2IzVaVn5TcdZyH5d1Mog',
    );
    debugPrint('✅ Supabase initialized successfully.');
  } catch (e) {
    debugPrint('❌ Supabase init error: $e');
  }

  runApp(const ProviderScope(child: BioParaSpiritualApp()));
}

class BioParaSpiritualApp extends StatelessWidget {
  const BioParaSpiritualApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BioPara Spiritual',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color(0xFF2E7D32),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF2E7D32),
          primary: const Color(0xFF2E7D32),
        ),
        useMaterial3: true,
      ),
      // Support for Arabic text display by default
      builder: (context, child) {
        return Directionality(textDirection: TextDirection.rtl, child: child!);
      },
      home: const ChatScreen(
        consultationId: '00000000-0000-0000-0000-000000000000',
      ),
    );
  }
}
