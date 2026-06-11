// lib/main_admin.dart
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:easy_localization/easy_localization.dart';

import 'admin/screens/admin_login_screen.dart';
import 'admin/screens/admin_dashboard_screen.dart';
import 'admin/debug_helper.dart'; // ✅ Debug helper
import 'core/providers/auth_provider.dart';
import 'core/utils/custom_error_screen.dart';
import 'core/utils/app_logger.dart';
import 'core/services/cache_service.dart';

// ── Load Arabic fonts locally (fixes Web CanvasKit garbled text) ──────────
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
    debugPrint('⚠️ Font loading: $e');
  }
}

// ── Main ───────────────────────────────────────────────────
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await EasyLocalization.ensureInitialized();
  await CacheService().init();

  // Set global custom error rendering widget
  ErrorWidget.builder = (FlutterErrorDetails details) {
    AppLogger.e('Unhandled Admin UI Render Error intercepted', details.exception, details.stack);
    return CustomErrorScreen(errorDetails: details);
  };

  // Prevent GoogleFonts from fetching from internet (use local assets)
  GoogleFonts.config.allowRuntimeFetching = false;
  await _loadArabicFonts();

  await dotenv.load(fileName: '.env');

  try {
    await Supabase.initialize(
      url: dotenv.env['SUPABASE_URL']!,
      anonKey: dotenv.env['SUPABASE_ANON_KEY']!,
    );
    debugPrint('✅ Supabase initialized (Admin App)');
    
    // ── Check Database Schema (debug only) ───────────────────
    if (kDebugMode) await debugCheckSchema();
    // ──────────────────────────────────────────────────────────
  } catch (e) {
    debugPrint('❌ Supabase init error: $e');
  }

  runApp(
    EasyLocalization(
      supportedLocales: const [Locale('ar'), Locale('fr')],
      path: 'assets/translations',
      fallbackLocale: const Locale('ar'),
      child: const ProviderScope(child: BioParaAdminApp()),
    ),
  );
}

class BioParaAdminApp extends StatelessWidget {
  const BioParaAdminApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BioPara Admin',
      debugShowCheckedModeBanner: false,
      localizationsDelegates: context.localizationDelegates,
      supportedLocales: context.supportedLocales,
      locale: context.locale,
      theme: ThemeData(
        primaryColor: const Color(0xFF2E7D32),
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2E7D32)),
        fontFamily: 'Tajawal',
        textTheme: GoogleFonts.tajawalTextTheme(
          Theme.of(context).textTheme,
        ),
        useMaterial3: true,
      ),
      home: const AdminAuthWrapper(),
    );
  }
}

class AdminAuthWrapper extends ConsumerWidget {
  const AdminAuthWrapper({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateProvider);

    return authState.when(
      data: (state) {
        if (state.session == null) return const AdminLoginScreen();

        final isAdminAsync = ref.watch(isAdminProvider);
        return isAdminAsync.when(
          data: (isAdmin) {
            if (isAdmin) {
              debugPrint('✅ AdminAuthWrapper: Admin confirmed');
              return const AdminDashboardScreen();
            }
            debugPrint('🚫 AdminAuthWrapper: User is not an admin');
            return const AdminLoginScreen();
          },
          loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
          error: (e, _) => const AdminLoginScreen(),
        );
      },
      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (e, _) => const AdminLoginScreen(),
    );
  }
}
