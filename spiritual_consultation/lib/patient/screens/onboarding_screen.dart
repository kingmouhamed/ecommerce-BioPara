// lib/patient/screens/onboarding_screen.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../core/theme/app_theme.dart';
import 'login_screen.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _ctrl = PageController();
  int _page = 0;

  final List<_OnboardPage> _pages = const [
    _OnboardPage(
      icon: Icons.chat_bubble_outline_rounded,
      emoji: '🌿',
      title: 'استشارة روحية وصحية',
      subtitle: 'تواصل مباشرة مع مستشارنا المتخصص\nعبر رسائل نصية، صوتية أو مكالمة فيديو',
      gradient: [Color(0xFF1A2E1B), Color(0xFF2D4A2E)],
      accentColor: Color(0xFFC8963E),
    ),
    _OnboardPage(
      icon: Icons.store_rounded,
      emoji: '🫙',
      title: 'متجر الأعشاب الطبيعية',
      subtitle: 'اكتشف مجموعتنا المختارة من الأعشاب\nوالزيوت والعسل الطبيعي الأصيل',
      gradient: [Color(0xFF2D3A1E), Color(0xFF4A6A2E)],
      accentColor: Color(0xFF72BF44),
    ),
    _OnboardPage(
      icon: Icons.calendar_month_rounded,
      emoji: '📅',
      title: 'احجز موعدك بسهولة',
      subtitle: 'جلسات خاصة مع المستشار\nبمرونة تامة في اختيار الوقت والمدة',
      gradient: [Color(0xFF1E2E3A), Color(0xFF2E4A6E)],
      accentColor: Color(0xFF5BB8D4),
    ),
  ];

  void _next() {
    if (_page < _pages.length - 1) {
      _ctrl.nextPage(
        duration: const Duration(milliseconds: 500),
        curve: Curves.easeInOutCubic,
      );
    } else {
      _finish();
    }
  }

  void _skip() => _finish();

  Future<void> _finish() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('seen_onboarding', true);
    if (!mounted) return;
    // انتقال بسيط بدون PageRouteBuilder مخصص
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const LoginScreen()),
    );
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final page = _pages[_page];
    return Scaffold(
      body: AnimatedContainer(
        duration: const Duration(milliseconds: 500),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: page.gradient,
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // ── زر تخطي ──
              Align(
                alignment: AlignmentDirectional.topEnd,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: TextButton(
                    onPressed: _skip,
                    child: Text(
                      'تخطي',
                      style: GoogleFonts.tajawal(
                        color: Colors.white.withValues(alpha: 0.7),
                        fontSize: 14,
                      ),
                    ),
                  ),
                ),
              ),

              // ── الصفحات ──
              Expanded(
                child: PageView.builder(
                  controller: _ctrl,
                  onPageChanged: (i) => setState(() => _page = i),
                  itemCount: _pages.length,
                  itemBuilder: (_, i) => _buildPage(_pages[i]),
                ),
              ),

              // ── نقاط التنقل + زر ──
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 0, 24, 32),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(
                        _pages.length,
                        (i) => AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          width: _page == i ? 24 : 7,
                          height: 7,
                          decoration: BoxDecoration(
                            color: _page == i
                                ? page.accentColor
                                : Colors.white.withValues(alpha: 0.3),
                            borderRadius: BorderRadius.circular(4),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 28),
                    GestureDetector(
                      onTap: _next,
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 300),
                        height: 58,
                        decoration: BoxDecoration(
                          color: page.accentColor,
                          borderRadius: BorderRadius.circular(AppRadius.xl),
                          boxShadow: [
                            BoxShadow(
                              color: page.accentColor.withValues(alpha: 0.4),
                              blurRadius: 20,
                              offset: const Offset(0, 8),
                            ),
                          ],
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              _page == _pages.length - 1 ? 'ابدأ الآن 🌿' : 'التالي',
                              style: GoogleFonts.cairo(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            if (_page < _pages.length - 1) ...[
                              const SizedBox(width: 8),
                              const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white, size: 16),
                            ],
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPage(_OnboardPage data) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 160,
            height: 160,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.08),
              shape: BoxShape.circle,
              border: Border.all(
                color: data.accentColor.withValues(alpha: 0.4),
                width: 2,
              ),
            ),
            child: Stack(
              alignment: Alignment.center,
              children: [
                Icon(data.icon, size: 70, color: data.accentColor),
                Positioned(
                  top: 15,
                  right: 15,
                  child: Text(data.emoji, style: const TextStyle(fontSize: 28)),
                ),
              ],
            ),
          ),

          const SizedBox(height: 48),

          Text(
            data.title,
            textAlign: TextAlign.center,
            style: GoogleFonts.cairo(
              fontSize: 26,
              fontWeight: FontWeight.w800,
              color: Colors.white,
              height: 1.3,
            ),
          ),

          const SizedBox(height: 16),

          Text(
            data.subtitle,
            textAlign: TextAlign.center,
            style: GoogleFonts.tajawal(
              fontSize: 15,
              color: Colors.white.withValues(alpha: 0.72),
              height: 1.7,
            ),
          ),

          const SizedBox(height: 32),

          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(width: 30, height: 1.5, color: data.accentColor.withValues(alpha: 0.4)),
              const SizedBox(width: 8),
              Container(
                width: 8, height: 8,
                decoration: BoxDecoration(
                  color: data.accentColor.withValues(alpha: 0.5),
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 8),
              Container(width: 30, height: 1.5, color: data.accentColor.withValues(alpha: 0.4)),
            ],
          ),
        ],
      ),
    );
  }
}

class _OnboardPage {
  final IconData icon;
  final String emoji;
  final String title;
  final String subtitle;
  final List<Color> gradient;
  final Color accentColor;

  const _OnboardPage({
    required this.icon,
    required this.emoji,
    required this.title,
    required this.subtitle,
    required this.gradient,
    required this.accentColor,
  });
}
