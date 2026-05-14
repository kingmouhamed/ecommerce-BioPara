import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../core/providers/auth_provider.dart';
import 'chat_screen.dart';
// Admin screen removed from patient app

// ── ألوان BioPara ────────────────────────────
const Color _primary       = Color(0xFF2D4A2E);
const Color _primaryLight  = Color(0xFF4A7C4E);
const Color _accent        = Color(0xFFC8963E);
const Color _background    = Color(0xFFF5F0E8);
const Color _surface       = Color(0xFFFDFAF5);
const Color _textPrimary   = Color(0xFF1A2E1B);
const Color _textSecondary = Color(0xFF6B7B6C);
const Color _inputBorder   = Color(0xFFD4C9B0);

class OtpScreen extends ConsumerStatefulWidget {
  final String phoneNumber;
  const OtpScreen({super.key, required this.phoneNumber});

  @override
  ConsumerState<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends ConsumerState<OtpScreen>
    with TickerProviderStateMixin {
  // ── 6 controllers + focus nodes لكل خانة ──
  final List<TextEditingController> _ctrls =
      List.generate(6, (_) => TextEditingController());
  final List<FocusNode> _foci = List.generate(6, (_) => FocusNode());

  bool _isLoading  = false;
  bool _resending  = false;
  String? _error;

  // ── مؤقت إعادة الإرسال ──
  int _countdown = 60;
  Timer? _timer;

  // ── انيميشن ──
  late AnimationController _iconCtrl;
  late AnimationController _cardCtrl;

  @override
  void initState() {
    super.initState();
    _iconCtrl = AnimationController(vsync: this, duration: 400.ms);
    _cardCtrl = AnimationController(vsync: this, duration: 500.ms);
    _iconCtrl.forward();
    Future.delayed(150.ms, () => _cardCtrl.forward());
    _startCountdown();
  }

  void _startCountdown() {
    _countdown = 60;
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (!mounted) { t.cancel(); return; }
      setState(() {
        if (_countdown > 0) { _countdown--; } else { t.cancel(); }
      });
    });
  }

  @override
  void dispose() {
    for (final c in _ctrls) { c.dispose(); }
    for (final f in _foci)  { f.dispose(); }
    _timer?.cancel();
    _iconCtrl.dispose();
    _cardCtrl.dispose();
    super.dispose();
  }

  String get _otp => _ctrls.map((c) => c.text).join();

  Future<void> _verify() async {
    final otp = _otp;
    if (otp.length < 6) {
      setState(() => _error = 'يرجى إدخال الرمز كاملاً (6 أرقام)');
      return;
    }
    setState(() { _isLoading = true; _error = null; });
    try {
      await ref.read(authProvider).verifyOtp(widget.phoneNumber, otp);
      if (!mounted) return;
      final user = Supabase.instance.client.auth.currentUser;
      // Patient app: always route to ChatScreen — admin check handled by PatientAuthWrapper
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(
          builder: (_) => ChatScreen(
            conversationId: user?.id ?? '00000000-0000-0000-0000-000000000000')),
        (r) => false);
    } catch (e) {
      if (!mounted) return;
      setState(() => _error = 'رمز غير صحيح، حاول مرة أخرى');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _resend() async {
    if (_countdown > 0 || _resending) return;
    setState(() { _resending = true; _error = null; });
    try {
      await ref.read(authProvider).signInWithPhone(widget.phoneNumber);
      for (final c in _ctrls) { c.clear(); }
      _foci[0].requestFocus();
      _startCountdown();
    } catch (e) {
      if (mounted) setState(() => _error = 'فشل إعادة الإرسال، حاول لاحقاً');
    } finally {
      if (mounted) setState(() => _resending = false);
    }
  }

  // ── بناء خانة OTP واحدة ──
  Widget _buildBox(int i) {
    return SizedBox(
      width: 48,
      height: 58,
      child: AnimatedContainer(
        duration: 200.ms,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: _foci[i].hasFocus
                ? _primaryLight
                : _ctrls[i].text.isNotEmpty
                    ? _accent
                    : _inputBorder,
            width: _foci[i].hasFocus ? 2 : 1.5,
          ),
          boxShadow: _foci[i].hasFocus
              ? [BoxShadow(color: _accent.withValues(alpha: 0.2), blurRadius: 0, spreadRadius: 3)]
              : [],
        ),
        child: KeyboardListener(
          focusNode: FocusNode(),
          onKeyEvent: (event) {
            // معالجة مفتاح الحذف للرجوع للخانة السابقة
            if (event is KeyDownEvent &&
                event.logicalKey == LogicalKeyboardKey.backspace &&
                _ctrls[i].text.isEmpty &&
                i > 0) {
              _ctrls[i - 1].clear();
              FocusScope.of(context).requestFocus(_foci[i - 1]);
              setState(() {});
            }
          },
          child: TextField(
            controller: _ctrls[i],
            focusNode: _foci[i],
            textAlign: TextAlign.center,
            keyboardType: TextInputType.number,
            maxLength: 1,
            style: GoogleFonts.cairo(
              fontSize: 22, fontWeight: FontWeight.bold, color: _textPrimary),
            decoration: const InputDecoration(
              counterText: '',
              border: InputBorder.none,
              contentPadding: EdgeInsets.zero,
            ),
            inputFormatters: [FilteringTextInputFormatter.digitsOnly],
            onChanged: (val) {
              setState(() {});
              if (val.isNotEmpty) {
                if (i < 5) {
                  // ── الانتقال للخانة التالية ──
                  FocusScope.of(context).requestFocus(_foci[i + 1]);
                } else {
                  // ── الخانة الأخيرة: إخفاء لوحة المفاتيح والتحقق ──
                  FocusScope.of(context).unfocus();
                  Future.delayed(150.ms, _verify);
                }
              } else if (val.isEmpty && i > 0) {
                // ── الرجوع للخانة السابقة عند الحذف ──
                FocusScope.of(context).requestFocus(_foci[i - 1]);
              }
            },
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _background,
      body: Stack(
        children: [
          // ── خلفية تدرج ──
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFFF5F0E8), Color(0xFFEDE8DC)],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
            ),
          ),
          SafeArea(
            child: GestureDetector(
              onTap: () => FocusScope.of(context).unfocus(),
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                child: Column(
                  children: [
                    // ── Header ──
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: _primary),
                          onPressed: () => Navigator.pop(context),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // ── أيقونة الرسالة ──
                    FadeTransition(
                      opacity: _iconCtrl,
                      child: Container(
                        width: 90, height: 90,
                        decoration: BoxDecoration(
                          color: _surface,
                          shape: BoxShape.circle,
                          border: Border.all(color: _accent.withValues(alpha: 0.4), width: 2),
                          boxShadow: [
                            BoxShadow(color: _primary.withValues(alpha: 0.12), blurRadius: 24, offset: const Offset(0, 6)),
                          ],
                        ),
                        child: const Icon(Icons.mark_email_read_rounded, color: _primary, size: 44),
                      ).animate().scale(begin: const Offset(0.7, 0.7), end: const Offset(1, 1), duration: 400.ms, curve: Curves.elasticOut),
                    ),
                    const SizedBox(height: 20),

                    // ── العنوان ──
                    Text('التحقق من الرقم',
                      style: GoogleFonts.cairo(fontSize: 24, fontWeight: FontWeight.bold, color: _textPrimary))
                      .animate().fadeIn(duration: 300.ms),
                    const SizedBox(height: 8),
                    Text('أدخل الرمز المكون من 6 أرقام المرسل إلى',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.tajawal(fontSize: 14, color: _textSecondary)),
                    const SizedBox(height: 6),
                    Directionality(
                      textDirection: TextDirection.ltr,
                      child: Text(widget.phoneNumber,
                        style: GoogleFonts.cairo(fontSize: 16, fontWeight: FontWeight.bold, color: _primary)),
                    ),

                    const SizedBox(height: 36),

                    // ── بطاقة OTP ──
                    FadeTransition(
                      opacity: _cardCtrl,
                      child: Container(
                        decoration: BoxDecoration(
                          color: _surface,
                          borderRadius: BorderRadius.circular(28),
                          border: Border.all(color: _inputBorder.withValues(alpha: 0.5)),
                          boxShadow: [
                            BoxShadow(color: Colors.black.withValues(alpha: 0.07), blurRadius: 32, offset: const Offset(0, 4)),
                          ],
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
                        child: Column(
                          children: [
                            // ── شريط التقدم ──
                            Row(
                              children: [
                                Text('الخطوة 2 من 2',
                                  style: GoogleFonts.tajawal(fontSize: 12, color: _textSecondary)),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(4),
                                    child: LinearProgressIndicator(
                                      value: 1.0,
                                      backgroundColor: _inputBorder,
                                      valueColor: const AlwaysStoppedAnimation<Color>(_accent),
                                      minHeight: 4,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 28),

                            // ── 6 خانات OTP ──
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: List.generate(6, (i) => _buildBox(i)),
                            ),

                            // ── رسالة الخطأ ──
                            if (_error != null) ...[
                              const SizedBox(height: 12),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(Icons.error_outline_rounded, color: Colors.redAccent, size: 16),
                                  const SizedBox(width: 6),
                                  Text(_error!,
                                    style: GoogleFonts.tajawal(fontSize: 13, color: Colors.redAccent)),
                                ],
                              ).animate().shakeX(duration: 400.ms),
                            ],

                            const SizedBox(height: 28),

                            // ── زر التحقق ──
                            GestureDetector(
                              onTap: _isLoading ? null : () {
                                HapticFeedback.mediumImpact();
                                _verify();
                              },
                              child: Container(
                                width: double.infinity,
                                height: 56,
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    colors: [_primary, _primaryLight],
                                    begin: Alignment.centerRight,
                                    end: Alignment.centerLeft,
                                  ),
                                  borderRadius: BorderRadius.circular(16),
                                  boxShadow: [
                                    BoxShadow(color: _primary.withValues(alpha: 0.35), blurRadius: 18, offset: const Offset(0, 6)),
                                  ],
                                ),
                                child: Center(
                                  child: _isLoading
                                    ? const SizedBox(width: 24, height: 24,
                                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
                                    : Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Text('تحقق وادخل',
                                            style: GoogleFonts.cairo(
                                              fontSize: 17, fontWeight: FontWeight.w600, color: Colors.white)),
                                          const SizedBox(width: 8),
                                          const Icon(Icons.verified_rounded, color: Colors.white, size: 20),
                                        ],
                                      ),
                                ),
                              ),
                            ),

                            const SizedBox(height: 20),

                            // ── إعادة الإرسال مع مؤقت ──
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text('لم يصلك الرمز؟  ',
                                  style: GoogleFonts.tajawal(fontSize: 13, color: _textSecondary)),
                                GestureDetector(
                                  onTap: _countdown == 0 ? _resend : null,
                                  child: _countdown > 0
                                    ? RichText(
                                        text: TextSpan(
                                          style: GoogleFonts.tajawal(fontSize: 13, color: _textSecondary),
                                          children: [
                                            TextSpan(text: 'إعادة الإرسال بعد '),
                                            TextSpan(
                                              text: '$_countdown',
                                              style: GoogleFonts.cairo(
                                                fontSize: 13,
                                                fontWeight: FontWeight.bold,
                                                color: _accent,
                                              ),
                                            ),
                                            TextSpan(text: ' ث'),
                                          ],
                                        ),
                                      )
                                    : Text(
                                        _resending ? 'جاري الإرسال...' : 'إعادة الإرسال',
                                        style: GoogleFonts.tajawal(
                                          fontSize: 13,
                                          color: _accent,
                                          fontWeight: FontWeight.w600,
                                          decoration: TextDecoration.underline,
                                          decorationColor: _accent,
                                        )),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // ── شارة الأمان ──
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.lock_outline_rounded, size: 15, color: _accent),
                        const SizedBox(width: 6),
                        Text('بياناتك محمية بتشفير SSL',
                          style: GoogleFonts.tajawal(fontSize: 12, color: _textSecondary)),
                      ],
                    ).animate().fadeIn(delay: 400.ms),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
