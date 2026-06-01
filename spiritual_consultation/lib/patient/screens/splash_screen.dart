// lib/patient/screens/splash_screen.dart
// ═══════════════════════════════════════════════════
//  BioPara — شاشة البداية الاحترافية
// ═══════════════════════════════════════════════════
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../core/theme/app_theme.dart';
import 'onboarding_screen.dart';
import 'patient_auth_wrapper.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _pulseCtrl;
  late AnimationController _rotateCtrl;
  late AnimationController _introCtrl;

  // Staggered transitions
  late Animation<double> _logoFade;
  late Animation<double> _logoScale;
  late Animation<double> _ringFade;
  late Animation<double> _titleFade;
  late Animation<Offset> _titleSlide;
  late Animation<double> _subFade;
  late Animation<double> _progressFade;
  late Animation<double> _versionFade;

  @override
  void initState() {
    super.initState();
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersive);

    _pulseCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);

    _rotateCtrl = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 8),
    )..repeat();

    // Unified intro animation for staggered items
    _introCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2200),
    );

    _logoFade = CurvedAnimation(
      parent: _introCtrl,
      curve: const Interval(0.0, 0.4, curve: Curves.easeOut),
    );
    _logoScale = Tween<double>(begin: 0.5, end: 1.0).animate(CurvedAnimation(
      parent: _introCtrl,
      curve: const Interval(0.0, 0.4, curve: Curves.easeOutBack),
    ));

    _ringFade = CurvedAnimation(
      parent: _introCtrl,
      curve: const Interval(0.15, 0.5, curve: Curves.easeOut),
    );

    _titleFade = CurvedAnimation(
      parent: _introCtrl,
      curve: const Interval(0.3, 0.7, curve: Curves.easeOut),
    );
    _titleSlide = Tween<Offset>(
      begin: const Offset(0.0, 0.3),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _introCtrl,
      curve: const Interval(0.3, 0.7, curve: Curves.easeOut),
    ));

    _subFade = CurvedAnimation(
      parent: _introCtrl,
      curve: const Interval(0.45, 0.85, curve: Curves.easeOut),
    );

    _progressFade = CurvedAnimation(
      parent: _introCtrl,
      curve: const Interval(0.65, 0.95, curve: Curves.easeOut),
    );

    _versionFade = CurvedAnimation(
      parent: _introCtrl,
      curve: const Interval(0.8, 1.0, curve: Curves.easeOut),
    );

    _introCtrl.forward();
    _navigate();
  }

  Future<void> _navigate() async {
    await Future.delayed(const Duration(milliseconds: 2800));
    if (!mounted) return;

    SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);

    final prefs = await SharedPreferences.getInstance();
    final seenOnboarding = prefs.getBool('seen_onboarding') ?? false;

    if (!mounted) return;

    // أوقف كل المتحركات قبل الانتقال
    _pulseCtrl.stop();
    _rotateCtrl.stop();
    _introCtrl.stop();

    // انتقال بسيط بدون FadeTransition مخصص (يتجنب _dependents.isEmpty)
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (_) => seenOnboarding
            ? const PatientAuthWrapper()
            : const OnboardingScreen(),
      ),
    );
  }

  @override
  void dispose() {
    _pulseCtrl.dispose();
    _rotateCtrl.dispose();
    _introCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primary,
      body: Stack(
        children: [
          // ── الخلفية المتدرجة ──
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF1A2E1B), AppColors.primary, AppColors.primaryLight],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
            ),
          ),

          // ── دوائر خلفية زخرفية ──
          Positioned(
            top: -80,
            right: -80,
            child: AnimatedBuilder(
              animation: _pulseCtrl,
              builder: (ctx, child) => Container(
                width: 300,
                height: 300,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: AppColors.accent.withValues(
                      alpha: 0.08 + _pulseCtrl.value * 0.06,
                    ),
                    width: 1.5,
                  ),
                ),
              ),
            ),
          ),
          Positioned(
            bottom: -100,
            left: -60,
            child: AnimatedBuilder(
              animation: _pulseCtrl,
              builder: (ctx, child) => Container(
                width: 260,
                height: 260,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: AppColors.accent.withValues(
                      alpha: 0.06 + _pulseCtrl.value * 0.05,
                    ),
                    width: 1,
                  ),
                ),
              ),
            ),
          ),

          // ── المحتوى المركزي ──
          Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // الحلقة الدوارة + الشعار في Stack للتداخل الصحيح
                SizedBox(
                  width: 140,
                  height: 140,
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      // حلقة دوّارة
                      FadeTransition(
                        opacity: _ringFade,
                        child: AnimatedBuilder(
                          animation: _rotateCtrl,
                          builder: (ctx, child) => Transform.rotate(
                            angle: _rotateCtrl.value * 2 * 3.14159,
                            child: Container(
                              width: 130,
                              height: 130,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: AppColors.accent.withValues(alpha: 0.3),
                                  width: 1.5,
                                ),
                                gradient: SweepGradient(
                                  colors: [
                                    AppColors.accent.withValues(alpha: 0.0),
                                    AppColors.accent.withValues(alpha: 0.4),
                                    AppColors.accent.withValues(alpha: 0.0),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                      // الشعار فوق الحلقة
                      FadeTransition(
                        opacity: _logoFade,
                        child: ScaleTransition(
                          scale: _logoScale,
                          child: Container(
                            width: 110,
                            height: 110,
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.1),
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: AppColors.accent.withValues(alpha: 0.6),
                                width: 2.5,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: AppColors.accent.withValues(alpha: 0.3),
                                  blurRadius: 30,
                                  spreadRadius: 5,
                                ),
                              ],
                            ),
                            child: ClipOval(
                              child: Image.asset(
                                'assets/images/logo.png',
                                fit: BoxFit.contain,
                                errorBuilder: (ctx, err, stack) => const Icon(
                                  Icons.spa_rounded,
                                  size: 56,
                                  color: AppColors.accent,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 32),

                // اسم التطبيق
                FadeTransition(
                  opacity: _titleFade,
                  child: SlideTransition(
                    position: _titleSlide,
                    child: RichText(
                      text: TextSpan(
                        children: [
                          TextSpan(
                            text: 'Bio',
                            style: GoogleFonts.cairo(
                              fontSize: 42,
                              fontWeight: FontWeight.w800,
                              color: const Color(0xFF72BF44),
                              letterSpacing: 1,
                            ),
                          ),
                          TextSpan(
                            text: 'Para',
                            style: GoogleFonts.cairo(
                              fontSize: 42,
                              fontWeight: FontWeight.w800,
                              color: const Color(0xFF5BB8D4),
                              letterSpacing: 1,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 10),

                // الشعار الفرعي
                FadeTransition(
                  opacity: _subFade,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text('🌿', style: TextStyle(fontSize: 14)),
                      const SizedBox(width: 6),
                      Text(
                        'استشارة صحية وروحية ذكية',
                        style: GoogleFonts.tajawal(
                          fontSize: 15,
                          color: Colors.white.withValues(alpha: 0.75),
                          letterSpacing: 0.5,
                        ),
                      ),
                      const SizedBox(width: 6),
                      const Text('🌿', style: TextStyle(fontSize: 14)),
                    ],
                  ),
                ),

                const SizedBox(height: 60),

                // مؤشر التحميل مع النص
                FadeTransition(
                  opacity: _progressFade,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      SizedBox(
                        width: 120,
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(10),
                          child: LinearProgressIndicator(
                            backgroundColor: Colors.white.withValues(alpha: 0.15),
                            valueColor: const AlwaysStoppedAnimation<Color>(AppColors.accent),
                            minHeight: 3,
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'جاري التحميل...',
                        style: GoogleFonts.tajawal(
                          fontSize: 12,
                          color: Colors.white.withValues(alpha: 0.45),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // ── الشعار السفلي ──
          Positioned(
            bottom: 32,
            left: 0,
            right: 0,
            child: FadeTransition(
              opacity: _versionFade,
              child: Text(
                'BioPara Spiritual v1.0',
                textAlign: TextAlign.center,
                style: GoogleFonts.tajawal(
                  fontSize: 11,
                  color: Colors.white.withValues(alpha: 0.3),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
