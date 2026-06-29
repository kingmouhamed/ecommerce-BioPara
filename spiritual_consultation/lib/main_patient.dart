// lib/main_patient.dart — BioPara Patient App Entry Point (Clean Rewrite)
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/services.dart';
import 'core/services/zego_call_service.dart';

import 'patient/screens/splash_screen.dart';
import 'core/utils/custom_error_screen.dart';
import 'core/utils/app_logger.dart';
import 'core/services/cache_service.dart';
import 'core/config/app_config.dart';

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
          measurementId: AppConfig.firebaseMeasurementId,
        ),
      );
    } else {
      await Firebase.initializeApp();
    }
  } catch (e) {
    debugPrint('Firebase init error: $e');
  }
}

@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await _initializeFirebase();
}

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
  } catch (e) {
    debugPrint('Font loading warning: $e');
  }
}

// ── ZegoCloud مُوحَّد في ZegoCallService ─────────────────────

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await CacheService().init();

  ErrorWidget.builder = (FlutterErrorDetails details) {
    AppLogger.e('Unhandled UI Render Error intercepted', details.exception, details.stack);
    return CustomErrorScreen(errorDetails: details);
  };

  GoogleFonts.config.allowRuntimeFetching = false;
  await _loadArabicFonts();
  await AppConfig.tryLoadDotEnvForLocalDev();
  await _initializeFirebase();
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  try {
    await Supabase.initialize(
      url: AppConfig.supabaseUrl,
      anonKey: AppConfig.supabaseAnonKey,
    );
  } catch (e) {
    debugPrint('Supabase init error: $e');
  }

  // ✅ ZegoCallService: تسجيل دخول المريض (Android/iOS فقط)
  // على Windows/Desktop لا نهيّئ Zego (غير مدعوم) — تُستعمل Jitsi.
  // يُستدعى بعد Supabase.initialize() مباشرةً
  if (ZegoCallService.isSupportedPlatform) {
    final user = Supabase.instance.client.auth.currentUser;
    if (user != null) {
      await ZegoCallService.instance.onUserLogin(
        user.id,
        'مريض BioPara',
      );
    }

    // الاستماع لتغييرات المصادقة مستقبلاً
    Supabase.instance.client.auth.onAuthStateChange.listen((event) async {
      if (event.event == AuthChangeEvent.signedIn &&
          event.session?.user != null) {
        await ZegoCallService.instance.onUserLogin(
          event.session!.user.id,
          'مريض BioPara',
        );
      } else if (event.event == AuthChangeEvent.signedOut) {
        await ZegoCallService.instance.onUserLogout();
      }
    });
  }

  // ProviderScope مباشرةً — بدون EasyLocalization (التطبيق عربي ثابت)
  runApp(
    const ProviderScope(
      child: BioParaPatientApp(),
    ),
  );
}

class BioParaPatientApp extends StatelessWidget {
  const BioParaPatientApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BioPara',
      debugShowCheckedModeBanner: false,
      // ✅ مطلوب لـ Zego: يفتح شاشة المكالمة تلقائياً عند قبول الدعوة
      navigatorKey: ZegoCallService.navigatorKey,
      // اللغة العربية ثابتة — لا حاجة لـ EasyLocalization
      locale: const Locale('ar'),
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
        textTheme: GoogleFonts.tajawalTextTheme(),
        useMaterial3: true,
      ),
      home: const SplashScreen(),
    );
  }
}
