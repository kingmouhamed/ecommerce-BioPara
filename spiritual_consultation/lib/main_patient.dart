// lib/main_patient.dart
// BioPara Patient App Entry Point
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/services.dart';

import 'patient/screens/login_screen.dart';
import 'patient/screens/chat_screen.dart';
import 'core/providers/auth_provider.dart';

// ── Firebase ────────────────────────────────────────────────
Future<void> _initializeFirebase() async {
  try {
    if (kIsWeb) {
      final apiKey = dotenv.env['FIREBASE_API_KEY'];
      if (apiKey == null || apiKey.isEmpty) return;
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
    debugPrint('Firebase initialized (Patient App)');
  } catch (e) {
    debugPrint('Firebase init error: $e');
  }
}

@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await _initializeFirebase();
}

// ── Load Arabic fonts from local assets (fixes CanvasKit web rendering) ──
Future<void> _loadArabicFonts() async {
  try {
    final tajawal = FontLoader('Tajawal')
      ..addFont(rootBundle.load('assets/fonts/Tajawal-Regular.ttf'))
      ..addFont(rootBundle.load('assets/fonts/Tajawal-Medium.ttf'))
      ..addFont(rootBundle.load('assets/fonts/Tajawal-Bold.ttf'))
      ..addFont(rootBundle.load('assets/fonts/Tajawal-ExtraBold.ttf'));
    await tajawal.load();

    final cairo = FontLoader('Cairo')
      ..addFont(rootBundle.load('assets/fonts/Cairo-Regular.ttf'))
      ..addFont(rootBundle.load('assets/fonts/Cairo-Medium.ttf'))
      ..addFont(rootBundle.load('assets/fonts/Cairo-SemiBold.ttf'))
      ..addFont(rootBundle.load('assets/fonts/Cairo-Bold.ttf'))
      ..addFont(rootBundle.load('assets/fonts/Cairo-ExtraBold.ttf'));
    await cairo.load();

    debugPrint('✅ Arabic fonts loaded from assets (TTF)');
  } catch (e) {
    debugPrint('⚠️ Font loading warning: $e');
  }
}

// ── Main ────────────────────────────────────────────────────
void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Prevent GoogleFonts from fetching from internet (use local assets)
  GoogleFonts.config.allowRuntimeFetching = false;
  await _loadArabicFonts();

  await dotenv.load(fileName: '.env');
  await _initializeFirebase();
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  await initializeDateFormatting('ar', null);

  try {
    await Supabase.initialize(
      url: dotenv.env['SUPABASE_URL']!,
      anonKey: dotenv.env['SUPABASE_ANON_KEY']!,
    );
    debugPrint('Supabase initialized (Patient App)');
  } catch (e) {
    debugPrint('Supabase init error: $e');
  }

  runApp(const ProviderScope(child: BioParaPatientApp()));
}

// ── Patient App ─────────────────────────────────────────────
class BioParaPatientApp extends StatelessWidget {
  const BioParaPatientApp({super.key});

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
        fontFamily: 'Tajawal',
        textTheme: GoogleFonts.tajawalTextTheme(
          Theme.of(context).textTheme,
        ),
        useMaterial3: true,
      ),
      builder: (context, child) => Directionality(
        textDirection: TextDirection.rtl,
        child: child ?? const SizedBox.shrink(),
      ),
      home: const PatientAuthWrapper(),
    );
  }
}

// ── Patient Auth Wrapper ─────────────────────────────────────
class PatientAuthWrapper extends ConsumerWidget {
  const PatientAuthWrapper({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateProvider);

    return authState.when(
      data: (state) {
        if (state.session == null) return const LoginScreen();

        final userId = state.session!.user.id;
        final isAdminAsync = ref.watch(isAdminProvider);

        return isAdminAsync.when(
          data: (isAdmin) {
            if (isAdmin) {
              debugPrint('PatientAuthWrapper: Admin blocked, signing out');
              Supabase.instance.client.auth.signOut();
              return const LoginScreen();
            }
            return ChatScreen(conversationId: userId);
          },
          loading: () => const _LoadingScreen(color: Color(0xFF0D6E6E)),
          error: (e, _) => ChatScreen(conversationId: userId),
        );
      },
      loading: () => const _LoadingScreen(color: Color(0xFF0D6E6E)),
      error: (e, _) => const LoginScreen(),
    );
  }
}

// ── Loading Screen ───────────────────────────────────────────
class _LoadingScreen extends StatelessWidget {
  final Color color;
  const _LoadingScreen({required this.color});

  @override
  Widget build(BuildContext context) => Scaffold(
        backgroundColor: const Color(0xFFF5F0E8),
        body: Center(
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(color),
          ),
        ),
      );
}
