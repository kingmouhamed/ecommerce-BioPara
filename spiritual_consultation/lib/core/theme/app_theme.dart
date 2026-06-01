// lib/core/theme/app_theme.dart
// ═══════════════════════════════════════════════════
//  BioPara — نظام التصميم المركزي
//  جميع الألوان والأنماط تُعرَّف هنا فقط
// ═══════════════════════════════════════════════════
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// ─── ألوان هوية BioPara ────────────────────────────────────────
abstract class AppColors {
  // الألوان الأساسية
  static const Color primary      = Color(0xFF2D4A2E); // أخضر غابي داكن
  static const Color primaryLight = Color(0xFF4A7C4E); // أخضر فاتح
  static const Color forest       = Color(0xFF1E3320); // أخضر الغابة (أعمق)

  // الذهبي
  static const Color accent       = Color(0xFFC8963E); // ذهبي دافئ
  static const Color accentLight  = Color(0xFFE8D5B0); // ذهبي فاتح

  // الخلفيات
  static const Color background   = Color(0xFFF5F0E8); // كريمي دافئ
  static const Color surface      = Color(0xFFFDFAF5); // أبيض دافئ (بطاقات)
  static const Color inputBg      = Color(0xFFFDFAF5); // خلفية حقول الإدخال

  // النصوص
  static const Color textPrimary  = Color(0xFF1A2E1B); // أخضر داكن جداً
  static const Color textSecondary= Color(0xFF6B7B6C); // رمادي أخضر

  // الحالات
  static const Color success      = Color(0xFF2D7A4E); // نجاح (أخضر)
  static const Color danger       = Color(0xFFB94040); // خطر (أحمر)
  static const Color warning      = Color(0xFFD97706); // تحذير (برتقالي)
  static const Color info         = Color(0xFF3B82F6); // معلومات (أزرق)

  // حدود وظلال
  static const Color border       = Color(0xFFD4C9B0); // حدود دافئة
  static const Color shadow       = Color(0x15000000); // ظل خفيف

  // ألوان خاصة بالمحادثة
  static const Color bubbleSent   = Color(0xFF2D4A2E); // فقاعة المرسل
  static const Color bubbleReceived = Colors.white;    // فقاعة المستقبل
  static const Color linkBg       = Color(0xFFECE5D8); // خلفية رابط

  // ألوان الأدمن
  static const Color adminPrimary = Color(0xFF1A2E1B);
  static const Color adminGold    = Color(0xFFC8963E);
  static const Color adminBg      = Color(0xFFF0EDE8);
}

/// ─── أنماط النص ────────────────────────────────────────────────
abstract class AppTextStyles {
  // عناوين (Cairo)
  static TextStyle heading1(BuildContext context) => GoogleFonts.cairo(
    fontSize: 28, fontWeight: FontWeight.w800, color: AppColors.textPrimary,
  );
  static TextStyle heading2(BuildContext context) => GoogleFonts.cairo(
    fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.textPrimary,
  );
  static TextStyle heading3(BuildContext context) => GoogleFonts.cairo(
    fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary,
  );
  static TextStyle subtitle(BuildContext context) => GoogleFonts.cairo(
    fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textPrimary,
  );

  // نص عادي (Tajawal)
  static TextStyle body(BuildContext context) => GoogleFonts.tajawal(
    fontSize: 15, color: AppColors.textPrimary,
  );
  static TextStyle bodySmall(BuildContext context) => GoogleFonts.tajawal(
    fontSize: 13, color: AppColors.textSecondary,
  );
  static TextStyle caption(BuildContext context) => GoogleFonts.tajawal(
    fontSize: 11, color: AppColors.textSecondary,
  );
  static TextStyle label(BuildContext context) => GoogleFonts.tajawal(
    fontSize: 12, color: AppColors.textSecondary,
  );

  // زر
  static TextStyle button(BuildContext context) => GoogleFonts.cairo(
    fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white,
  );
  static TextStyle buttonSmall(BuildContext context) => GoogleFonts.cairo(
    fontSize: 13, fontWeight: FontWeight.bold, color: Colors.white,
  );

  // سعر
  static TextStyle price(BuildContext context) => GoogleFonts.cairo(
    fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.primary,
  );
}

/// ─── ثوابت الأبعاد ──────────────────────────────────────────────
abstract class AppSpacing {
  static const double xs  = 4.0;
  static const double sm  = 8.0;
  static const double md  = 16.0;
  static const double lg  = 24.0;
  static const double xl  = 32.0;
  static const double xxl = 48.0;
}

/// ─── ثوابت الحواف ───────────────────────────────────────────────
abstract class AppRadius {
  static const double sm  = 8.0;
  static const double md  = 12.0;
  static const double lg  = 16.0;
  static const double xl  = 20.0;
  static const double xxl = 28.0;
  static const double pill= 50.0;
}

/// ─── ظلال متكررة ────────────────────────────────────────────────
abstract class AppShadows {
  static List<BoxShadow> get card => [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.07),
      blurRadius: 16, offset: const Offset(0, 4),
    ),
  ];

  static List<BoxShadow> get elevated => [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.12),
      blurRadius: 24, offset: const Offset(0, 8),
    ),
  ];

  static List<BoxShadow> get subtle => [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.04),
      blurRadius: 10, offset: const Offset(0, 2),
    ),
  ];

  static List<BoxShadow> primaryGlow(Color color) => [
    BoxShadow(
      color: color.withValues(alpha: 0.35),
      blurRadius: 20, offset: const Offset(0, 6),
    ),
  ];
}

/// ─── التدرجات الشائعة ───────────────────────────────────────────
abstract class AppGradients {
  static const LinearGradient primary = LinearGradient(
    colors: [AppColors.primary, AppColors.primaryLight],
    begin: Alignment.topRight,
    end: Alignment.bottomLeft,
  );

  static const LinearGradient primaryHorizontal = LinearGradient(
    colors: [AppColors.primary, AppColors.primaryLight],
    begin: Alignment.centerRight,
    end: Alignment.centerLeft,
  );

  static const LinearGradient gold = LinearGradient(
    colors: [AppColors.accent, Color(0xFFE8B86D)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient background = LinearGradient(
    colors: [AppColors.background, Color(0xFFEDE8DC)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );
}

/// ─── ثيم التطبيق الكامل ─────────────────────────────────────────
abstract class AppTheme {
  static ThemeData get patientTheme => ThemeData(
    useMaterial3: true,
    primaryColor: AppColors.primary,
    scaffoldBackgroundColor: AppColors.background,
    colorScheme: ColorScheme.fromSeed(
      seedColor: AppColors.primary,
      primary: AppColors.primary,
      secondary: AppColors.accent,
      surface: AppColors.surface,
    ),
    textTheme: GoogleFonts.tajawalTextTheme(),
    appBarTheme: AppBarTheme(
      backgroundColor: AppColors.primary,
      foregroundColor: Colors.white,
      elevation: 0,
      centerTitle: true,
      titleTextStyle: GoogleFonts.cairo(
        fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white,
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.lg),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        textStyle: GoogleFonts.cairo(
          fontSize: 16, fontWeight: FontWeight.bold,
        ),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: AppColors.surface,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppRadius.lg),
        borderSide: const BorderSide(color: AppColors.border),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppRadius.lg),
        borderSide: const BorderSide(color: AppColors.border),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppRadius.lg),
        borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
      ),
      hintStyle: GoogleFonts.tajawal(color: AppColors.textSecondary),
    ),
    cardTheme: CardThemeData(
      color: AppColors.surface,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.xl),
        side: const BorderSide(color: AppColors.border, width: 0.5),
      ),
      shadowColor: Colors.black.withValues(alpha: 0.05),
    ),
    dividerTheme: const DividerThemeData(
      color: AppColors.border,
      thickness: 0.8,
    ),
    snackBarTheme: SnackBarThemeData(
      backgroundColor: AppColors.primary,
      contentTextStyle: GoogleFonts.tajawal(color: Colors.white),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.md),
      ),
      behavior: SnackBarBehavior.floating,
    ),
  );

  static ThemeData get adminTheme => ThemeData(
    useMaterial3: true,
    primaryColor: AppColors.adminPrimary,
    scaffoldBackgroundColor: AppColors.adminBg,
    colorScheme: ColorScheme.fromSeed(seedColor: AppColors.adminPrimary),
    textTheme: GoogleFonts.tajawalTextTheme(),
    fontFamily: 'Tajawal',
  );
}
