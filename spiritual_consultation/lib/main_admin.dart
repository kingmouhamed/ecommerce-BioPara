// lib/main_admin.dart
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

import 'core/services/zego_call_service.dart';
import 'admin/screens/admin_login_screen.dart';
import 'admin/screens/admin_dashboard_screen.dart';
import 'admin/widgets/admin_call_listener.dart';
import 'admin/debug_helper.dart'; // ✅ Debug helper
import 'core/providers/auth_provider.dart';
import 'core/utils/custom_error_screen.dart';
import 'core/utils/app_logger.dart';
import 'core/services/cache_service.dart';
import 'core/services/admin_presence_service.dart';
import 'core/config/app_config.dart';

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

// ── Firebase init ──────────────────────────────────────────────
Future<void> _initializeFirebase() async {
  try {
    if (kIsWeb) {
      final apiKey = AppConfig.firebaseApiKey;
      if (apiKey.isEmpty) return;
      await Firebase.initializeApp(
        options: FirebaseOptions(
          apiKey: apiKey,
          appId: AppConfig.firebaseAppId,
          messagingSenderId: AppConfig.firebaseMessagingSenderId,
          projectId: AppConfig.firebaseProjectId,
          measurementId: AppConfig.firebaseMeasurementId.isEmpty ? null : AppConfig.firebaseMeasurementId,
        ),
      );
    } else {
      await Firebase.initializeApp();
    }
    debugPrint('✅ Firebase initialized (Admin)');
  } catch (e) {
    debugPrint('⚠️ Firebase init error (Admin): $e');
  }
}

@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await _initializeFirebase();
}

// ── ZegoCloud مُوحَّد في ZegoCallService ─────────────────────

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

  await AppConfig.tryLoadDotEnvForLocalDev();

  // ── Backend Initializations with Timeout ──
  debugPrint('🚀 Starting Admin backend initialization...');
  try {
    final List<Future<dynamic>> initFutures = [
      _initializeFirebase().then((_) {
        try {
          FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
        } catch (e) {
          debugPrint('⚠️ Error registering Firebase background message handler: $e');
        }
      }),
      Supabase.initialize(
        url: AppConfig.supabaseUrl,
        anonKey: AppConfig.supabaseAnonKey,
      ).then((_) {
        debugPrint('✅ Supabase initialized (Admin App)');
        if (kDebugMode) {
          debugCheckSchema().catchError((err) {
            debugPrint('⚠️ Schema check failed: $err');
          });
        }
      }),
    ];

    if (ZegoCallService.isSupportedPlatform) {
      initFutures.add(
        ZegoCallService.instance.onUserLogin(
          ZegoCallService.adminUserId,
          ZegoCallService.adminUserName,
          isAdminMode: true,
        ).then((_) {
          // الاستماع لتغييرات المصادقة (logout فقط)
          Supabase.instance.client.auth.onAuthStateChange.listen((event) async {
            if (event.event == AuthChangeEvent.signedOut) {
              await ZegoCallService.instance.onUserLogout();
            }
          });
        }),
      );
    }

    await Future.wait(initFutures).timeout(const Duration(seconds: 3));
    debugPrint('✅ All Admin backend services initialized successfully or timed out.');
  } catch (e) {
    debugPrint('⚠️ Admin backend initialization timed out or encountered an error: $e');
  }

  // تتبّع منصة الأدمن — يعمل على جميع المنصات.
  try {
    AdminPresenceService.instance.startTracking();
  } catch (e) {
    debugPrint('⚠️ Error starting AdminPresence tracking: $e');
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
      // ✅ مطلوب لـ Zego: يفتح شاشة المكالمة تلقائياً عند قبول الدعوة
      navigatorKey: ZegoCallService.navigatorKey,
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
              // مستمع المكالمات العام (Windows/سطح المكتب) — يلتقط مكالمات
              // المرضى مهما كانت الشاشة الحالية ويعرض CallOverlay فوق الكل.
              return const AdminCallListener(child: AdminDashboardScreen());
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
