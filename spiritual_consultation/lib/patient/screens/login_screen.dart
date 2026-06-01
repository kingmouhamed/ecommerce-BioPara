// lib/patient/screens/login_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/providers/auth_provider.dart';
import 'otp_screen.dart';

// ── ألوان هوية BioPara ────────────────────────────
const Color _primary = Color(0xFF2D4A2E);
const Color _primaryLight = Color(0xFF4A7C4E);
const Color _accent = Color(0xFFC8963E);
const Color _background = Color(0xFFF5F0E8);
const Color _surface = Color(0xFFFDFAF5);
const Color _textPrimary = Color(0xFF1A2E1B);
const Color _textSecondary = Color(0xFF6B7B6C);
const Color _inputBorder = Color(0xFFD4C9B0);

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen>
    with TickerProviderStateMixin {
  final _phoneController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  final _phoneFocusNode = FocusNode();

  bool _isLoading = false;
  bool _phoneFocused = false;
  String? _phoneError;

  // انيميشن الدخول (بدون flutter_animate)
  late AnimationController _logoCtrl;
  late AnimationController _cardCtrl;
  late AnimationController _btnCtrl;
  late Animation<double> _logoFade;
  late Animation<Offset> _logoSlide;
  late Animation<double> _cardFade;
  late Animation<Offset> _cardSlide;
  late Animation<double> _btnFade;

  @override
  void initState() {
    super.initState();

    _logoCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 300));
    _cardCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 400));
    _btnCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 500));

    _logoFade = CurvedAnimation(parent: _logoCtrl, curve: Curves.easeOut);
    _logoSlide = Tween<Offset>(
      begin: const Offset(0, -0.3),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _logoCtrl, curve: Curves.easeOut));
    _cardFade = CurvedAnimation(parent: _cardCtrl, curve: Curves.easeOut);
    _cardSlide = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _cardCtrl, curve: Curves.easeOut));
    _btnFade = CurvedAnimation(parent: _btnCtrl, curve: Curves.easeOut);

    _logoCtrl.forward();
    Future.delayed(const Duration(milliseconds: 100), () { if (mounted) _cardCtrl.forward(); });
    Future.delayed(const Duration(milliseconds: 200), () { if (mounted) _btnCtrl.forward(); });

    _phoneFocusNode.addListener(() {
      setState(() => _phoneFocused = _phoneFocusNode.hasFocus);
    });
  }

  @override
  void dispose() {
    _phoneController.dispose();
    _phoneFocusNode.dispose();
    _logoCtrl.dispose();
    _cardCtrl.dispose();
    _btnCtrl.dispose();
    super.dispose();
  }

  // ── إرسال النموذج ──
  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _isLoading = true;
      _phoneError = null;
    });
    final auth = ref.read(authProvider);
    try {
      final rawPhone = _phoneController.text.trim();
      final cleanPhone = rawPhone.startsWith('0') ? rawPhone.substring(1) : rawPhone;
      final phone = '+212$cleanPhone';
      await auth.signInWithPhone(phone);
      if (!mounted) return;
      Navigator.of(context).push(
        MaterialPageRoute(builder: (_) => OtpScreen(phoneNumber: phone)),
      );
    } catch (e) {
      if (!mounted) return;
      setState(() => _phoneError = _getErrorMessage(e.toString()));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  String _getErrorMessage(String error) {
    if (error.contains('Invalid login')) return 'البريد أو كلمة المرور غير صحيحة';
    if (error.contains('rate limit')) return 'طلبات كثيرة، يرجى الانتظار دقيقة';
    if (error.contains('network')) return 'تحقق من اتصالك بالإنترنت';
    return 'حدث خطأ: $error';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _background,
      body: Stack(
        children: [
          // ── خلفية تدرج دافئ ──
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFFF5F0E8), Color(0xFFEDE8DC)],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
            ),
          ),
          // ── المحتوى الرئيسي ──
          SafeArea(
            child: GestureDetector(
              onTap: () => FocusScope.of(context).unfocus(),
              child: Center(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        // ── قسم الشعار ──
                        FadeTransition(
                          opacity: _logoFade,
                          child: SlideTransition(
                            position: _logoSlide,
                            child: _buildLogoSection(),
                          ),
                        ),
                        const SizedBox(height: 36),

                        // ── بطاقة تسجيل الدخول ──
                        FadeTransition(
                          opacity: _cardFade,
                          child: SlideTransition(
                            position: _cardSlide,
                            child: _buildCard(),
                          ),
                        ),
                        const SizedBox(height: 20),

                        // ── شارة الأمان ──
                        FadeTransition(
                          opacity: _btnFade,
                          child: _buildTrustBadge(),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ── قسم الشعار ──────────────────────────────────────
  Widget _buildLogoSection() {
    return Column(
      children: [
        Container(
          width: 100,
          height: 100,
          decoration: BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
            border: Border.all(color: _accent.withValues(alpha: 0.4), width: 2),
            boxShadow: [
              BoxShadow(color: _primary.withValues(alpha: 0.15), blurRadius: 32, offset: const Offset(0, 8)),
              BoxShadow(color: Colors.white.withValues(alpha: 0.8), blurRadius: 8, offset: const Offset(0, -2)),
            ],
          ),
          child: ClipOval(
            child: Image.asset(
              'assets/images/logo.png',
              fit: BoxFit.contain,
              errorBuilder: (ctx, err, st) => const Icon(Icons.spa_rounded, color: _primary, size: 50),
            ),
          ),
        ),
        const SizedBox(height: 16),
        RichText(
          text: TextSpan(
            children: [
              TextSpan(
                text: 'Bio',
                style: GoogleFonts.cairo(fontSize: 36, fontWeight: FontWeight.w800, color: const Color(0xFF72BF44)),
              ),
              TextSpan(
                text: 'Para',
                style: GoogleFonts.cairo(fontSize: 36, fontWeight: FontWeight.w800, color: const Color(0xFF5BB8D4)),
              ),
            ],
          ),
        ),
        const SizedBox(height: 6),
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('استشارة صحية وروحية',
                style: GoogleFonts.tajawal(fontSize: 15, color: _textSecondary, letterSpacing: 0.5)),
            const SizedBox(width: 6),
            const Text('🌿', style: TextStyle(fontSize: 14)),
          ],
        ),
      ],
    );
  }

  // ── بطاقة النموذج ──────────────────────────────────────
  Widget _buildCard() {
    return Container(
      decoration: BoxDecoration(
        color: _surface,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: _inputBorder.withValues(alpha: 0.5)),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 40, offset: const Offset(0, -4)),
          BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 12, offset: const Offset(0, 4)),
        ],
      ),
      padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text('تسجيل الدخول',
              style: GoogleFonts.cairo(fontSize: 22, fontWeight: FontWeight.bold, color: _textPrimary),
              textAlign: TextAlign.center),
          const SizedBox(height: 6),
          Text('أدخل رقم هاتفك لتصلك رسالة التحقق',
              style: GoogleFonts.tajawal(fontSize: 14, color: _textSecondary),
              textAlign: TextAlign.center),

          const SizedBox(height: 14),
          Row(
            children: [
              Text('الخطوة 1 من 2', style: GoogleFonts.tajawal(fontSize: 12, color: _textSecondary)),
              const SizedBox(width: 10),
              Expanded(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: 0.5,
                    backgroundColor: _inputBorder,
                    valueColor: const AlwaysStoppedAnimation<Color>(_accent),
                    minHeight: 4,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          _buildPhoneField(),
          const SizedBox(height: 24),
          _buildPrimaryButton(),
        ],
      ),
    );
  }

  // ── حقل الهاتف المخصص ──────────────────────────────
  Widget _buildPhoneField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          height: 58,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: _phoneError != null
                  ? Colors.redAccent
                  : _phoneFocused
                  ? _primaryLight
                  : _inputBorder,
              width: 1.5,
            ),
            boxShadow: _phoneFocused
                ? [BoxShadow(color: _accent.withValues(alpha: 0.2), blurRadius: 0, spreadRadius: 3)]
                : [],
          ),
          child: Row(
            children: [
              Container(
                width: 70,
                decoration: const BoxDecoration(
                  color: Color(0xFFF0EDE6),
                  borderRadius: BorderRadius.horizontal(right: Radius.circular(14)),
                ),
                child: Center(
                  child: Text('+212',
                      style: GoogleFonts.cairo(fontSize: 16, fontWeight: FontWeight.w600, color: _primary)),
                ),
              ),
              Container(width: 1, height: 36, color: _inputBorder),
              const SizedBox(width: 10),
              const Icon(Icons.phone_android_rounded, color: _primaryLight, size: 20),
              const SizedBox(width: 8),
              Expanded(
                child: TextFormField(
                  controller: _phoneController,
                  focusNode: _phoneFocusNode,
                  keyboardType: TextInputType.phone,
                  textDirection: TextDirection.ltr,
                  textInputAction: TextInputAction.done,
                  onFieldSubmitted: (_) => _submit(),
                  inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                  style: GoogleFonts.tajawal(fontSize: 16, color: _textPrimary),
                  decoration: InputDecoration(
                    hintText: '6XXXXXXXX',
                    hintStyle: GoogleFonts.tajawal(color: _textSecondary.withValues(alpha: 0.5), fontSize: 15),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(vertical: 18),
                  ),
                  validator: (val) {
                    if (val == null || val.isEmpty) return 'رقم الهاتف مطلوب';
                    if (val.length < 9) return 'يجب أن يكون 9 أرقام على الأقل';
                    return null;
                  },
                ),
              ),
              const SizedBox(width: 12),
            ],
          ),
        ),
        if (_phoneError != null)
          Padding(
            padding: const EdgeInsets.only(top: 8, right: 4),
            child: Text(_phoneError!, style: GoogleFonts.tajawal(fontSize: 12, color: Colors.redAccent)),
          ),
      ],
    );
  }

  // ── زر التالي الرئيسي ──────────────────────────────
  Widget _buildPrimaryButton() {
    return GestureDetector(
      onTap: _isLoading ? null : () {
        HapticFeedback.mediumImpact();
        _submit();
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        height: 58,
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [_primary, _primaryLight],
            begin: Alignment.centerRight,
            end: Alignment.centerLeft,
          ),
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(color: _primary.withValues(alpha: 0.35), blurRadius: 20, offset: const Offset(0, 6)),
          ],
        ),
        child: Center(
          child: _isLoading
              ? const SizedBox(
                  width: 24,
                  height: 24,
                  child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                )
              : Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text('التالي — إرسال الرمز',
                        style: GoogleFonts.cairo(fontSize: 17, fontWeight: FontWeight.w600, color: Colors.white)),
                    const SizedBox(width: 10),
                    const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white, size: 16),
                  ],
                ),
        ),
      ),
    );
  }

  // ── شارة الأمان ──────────────────────────────────────────
  Widget _buildTrustBadge() {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.lock_outline_rounded, size: 16, color: _accent),
            const SizedBox(width: 6),
            Text('بياناتك محمية وآمنة', style: GoogleFonts.tajawal(fontSize: 13, color: _textSecondary)),
          ],
        ),
        const SizedBox(height: 4),
        Text('🔒 مشفر بـ SSL',
            style: GoogleFonts.tajawal(fontSize: 11, color: _textSecondary.withValues(alpha: 0.6))),
      ],
    );
  }
}
