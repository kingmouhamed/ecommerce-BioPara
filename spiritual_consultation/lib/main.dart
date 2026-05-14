// lib/main.dart
// ═══════════════════════════════════════════════════════════
//  BioPara — Default Entry Point (Patient App)
//  يُستخدم لـ flutter run بدون -t
//  مكافئ لـ main_patient.dart
// ═══════════════════════════════════════════════════════════
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

import 'patient/screens/login_screen.dart';
import 'patient/screens/chat_screen.dart';
import 'core/providers/auth_provider.dart';

Future<void> _initializeFirebase() async {
  try {
    if (kIsWeb) {
      final apiKey = dotenv.env['FIREBASE_API_KEY'];
      if (apiKey == null || apiKey.isEmpty) {
        debugPrint('⚠️ Firebase Web initialization skipped: FIREBASE_API_KEY is missing in .env');
        return;
      }
      await Firebase.initializeApp(
        options: FirebaseOptions(
          apiKey: apiKey,
          appId: dotenv.env['FIREBASE_APP_ID'] ?? '',
          messagingSenderId: dotenv.env['FIREBASE_MESSAGING_SENDER_ID'] ?? '',
          projectId: dotenv.env['FIREBASE_PROJECT_ID'] ?? '',
          measurementId: dotenv.env['FIREBASE_MEASUREMENT_ID'],
        ),
      );
    } else {
      await Firebase.initializeApp();
    }
    debugPrint('✅ Firebase initialized successfully.');
  } catch (e) {
    debugPrint('❌ Firebase initialization error: $e');
  }
}

@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await _initializeFirebase();
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: '.env');
  await _initializeFirebase();
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  await initializeDateFormatting('ar', null);

  try {
    await Supabase.initialize(
      url: dotenv.env['SUPABASE_URL']!,
      anonKey: dotenv.env['SUPABASE_ANON_KEY']!,
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
      title: 'BioPara',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color(0xFF3D5A3E),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF3D5A3E),
          primary: const Color(0xFF3D5A3E),
          secondary: const Color(0xFFC8963E),
          surface: const Color(0xFFF5F0E8),
        ),
        scaffoldBackgroundColor: const Color(0xFFF5F0E8),
        textTheme: GoogleFonts.tajawalTextTheme(
          Theme.of(context).textTheme,
        ),
        useMaterial3: true,
      ),
      builder: (context, child) {
        return Directionality(
            textDirection: TextDirection.rtl,
            child: child ?? const SizedBox.shrink());
      },
      home: const AuthWrapper(),
    );
  }
}

class AuthWrapper extends ConsumerWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateProvider);

    return authState.when(
      data: (state) {
        if (state.session == null) return const LoginScreen();

        final isAdminAsync = ref.watch(isAdminProvider);
        final userId = state.session!.user.id;

        return isAdminAsync.when(
          data: (isAdmin) {
            if (isAdmin) {
              // Default app: block admins (use main_admin.dart for admin access)
              debugPrint('🚫 AuthWrapper: Admin blocked in default app, signing out');
              Supabase.instance.client.auth.signOut();
              return const LoginScreen();
            }
            debugPrint('✅ AuthWrapper: Patient → ChatScreen');
            return ChatScreen(conversationId: userId);
          },
          loading: () => const Scaffold(
            body: Center(child: CircularProgressIndicator(color: Color(0xFF0D6E6E))),
          ),
          error: (err, _) {
            debugPrint('❌ AuthWrapper Admin Check Error: $err');
            return ChatScreen(conversationId: userId);
          },
        );
      },
      loading: () => const Scaffold(
        body: Center(child: CircularProgressIndicator(color: Color(0xFF0D6E6E))),
      ),
      error: (err, _) {
        debugPrint('❌ AuthState Error: $err');
        return const LoginScreen();
      },
    );
  }
}
