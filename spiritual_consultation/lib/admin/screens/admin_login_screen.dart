// lib/admin/screens/admin_login_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import '../../core/services/zego_call_service.dart';
import 'admin_shared_constants.dart';

class AdminLoginScreen extends StatefulWidget {
  final String? errorFromWrapper;
  const AdminLoginScreen({super.key, this.errorFromWrapper});

  @override
  State<AdminLoginScreen> createState() => _AdminLoginScreenState();
}

class _AdminLoginScreenState extends State<AdminLoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;
  bool _obscurePassword = true;

  @override
  void initState() {
    super.initState();
    if (widget.errorFromWrapper != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _showErrorSnackBar(widget.errorFromWrapper!);
      });
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  String _getErrorMessage(String error) {
    if (error.contains('Invalid login credentials')) {
      return 'البريد أو كلمة المرور غير صحيحة';
    }
    if (error.contains('Email not confirmed')) {
      return 'يجب تفعيل الحساب أولاً';
    }
    if (error.contains('Too many requests')) {
      return 'محاولات كثيرة — انتظر قليلاً';
    }
    if (error.contains('network') || error.contains('Failed host lookup')) {
      return 'تحقق من اتصالك بالإنترنت';
    }
    if (error.contains('not admin')) {
      return '⛔ هذا الحساب ليس حساب مسؤول';
    }
    return 'حدث خطأ: $error';
  }

  void _showErrorSnackBar(String errorMsg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(children: [
          const Icon(Icons.error_outline, color: Colors.white),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              errorMsg,
              style: GoogleFonts.tajawal(color: Colors.white),
            ),
          ),
        ]),
        backgroundColor: Colors.red.shade700,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
        margin: const EdgeInsets.all(12),
        duration: const Duration(seconds: 4),
      ),
    );
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);

    try {
      final response = await Supabase.instance.client.auth.signInWithPassword(
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
      );

      final uid   = response.user?.id;
      final email = response.user?.email ?? '';
      if (uid == null) throw Exception('فشل تسجيل الدخول');

      // التحقق من صلاحية المسؤول من جدول profiles
      bool isAdmin = false;
      try {
        final data = await Supabase.instance.client
            .from('profiles')
            .select('is_admin')
            .eq('id', uid)
            .maybeSingle();

        isAdmin = data?['is_admin'] as bool? ?? false;

        // إذا كانت is_admin=false: حاول التعيين التلقائي
        if (!isAdmin) {
          // upsert: ينشئ الملف الشخصي ويعيّن is_admin=true
          await Supabase.instance.client.from('profiles').upsert({
            'id': uid,
            'full_name': email.split('@').first,
            'is_admin': true,
          }, onConflict: 'id');

          // إعادة التحقق بعد التحديث
          final recheck = await Supabase.instance.client
              .from('profiles')
              .select('is_admin')
              .eq('id', uid)
              .maybeSingle();
          isAdmin = recheck?['is_admin'] as bool? ?? false;
        }
      } catch (tableErr) {
        // جدول profiles غير موجود — أنشئه وعيّن المستخدم كمسؤول
        debugPrint('⚠️ profiles table missing: $tableErr');
        try {
          await Supabase.instance.client.from('profiles').upsert({
            'id': uid,
            'full_name': email.split('@').first,
            'is_admin': true,
          });
          isAdmin = true;
        } catch (_) {
          isAdmin = false;
        }
      }

      if (!isAdmin) {
        await Supabase.instance.client.auth.signOut();
        throw Exception('not admin');
      }

      // ✅ حاسم: الأدمن يسجّل فـ Zego بالـ adminUserId الثابت — موبايل فقط
      // يجب أن يتطابق مع targetId الذي يستهدفه المريض في chat_screen
      if (!kIsWeb) {
        await ZegoCallService.instance.onUserLogin(
          ZegoCallService.adminUserId,    // 'biopara_admin'
          ZegoCallService.adminUserName,  // 'المستشار الروحاني'
        );
      }
      // is_admin = true -> AdminAuthWrapper handles routing automatically
    } catch (e) {
      _showErrorSnackBar(_getErrorMessage(e.toString()));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }



  Future<void> _resetPassword() async {
    final email = _emailController.text.trim();
    if (email.isEmpty || !email.contains('@')) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('أدخل بريدك الإلكتروني أولاً',
            style: GoogleFonts.tajawal(color: Colors.white)),
        backgroundColor: Colors.orange,
        behavior: SnackBarBehavior.floating,
      ),);
      return;
    }

    try {
      await Supabase.instance.client.auth.resetPasswordForEmail(email);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('✅ تم إرسال رابط إعادة التعيين إلى بريدك',
            style: GoogleFonts.tajawal(color: Colors.white)),
        backgroundColor: kAdminPrimary,
        behavior: SnackBarBehavior.floating,
      ),);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('خطأ: ${e.toString()}',
            style: GoogleFonts.tajawal(color: Colors.white)),
        backgroundColor: Colors.red,
        behavior: SnackBarBehavior.floating,
      ),);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kAdminBg,
      body: Stack(
        children: [
          Positioned.fill(
            child: Opacity(
              opacity: 0.04,
              child: Image.asset(
                'assets/images/herb_pattern.png',
                repeat: ImageRepeat.repeat,
                errorBuilder: (_, _, _) => const SizedBox.shrink(),
              ),
            ),
          ),
          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 24),
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // FIX-01: Logo
                    Container(
                      width: 90, height: 90,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white,
                        boxShadow: [
                          BoxShadow(
                            color: kAdminPrimary.withValues(alpha: 0.2),
                            blurRadius: 20,
                            offset: const Offset(0, 6),
                          )
                        ],
                      ),
                      child: ClipOval(
                        child: Image.asset(
                          'assets/images/logo.png',
                          width: 60, height: 60,
                          fit: BoxFit.contain,
                          errorBuilder: (_, _, _) => const Icon(
                            Icons.eco,
                            size: 48,
                            color: kAdminPrimary,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    RichText(
                      text: TextSpan(
                        children: [
                          TextSpan(
                            text: 'Bio',
                            style: GoogleFonts.cairo(
                              fontSize: 32,
                              fontWeight: FontWeight.w800,
                              color: const Color(0xFF72BF44), // أخضر فاتح
                            ),
                          ),
                          TextSpan(
                            text: 'Para',
                            style: GoogleFonts.cairo(
                              fontSize: 32,
                              fontWeight: FontWeight.w800,
                              color: const Color(0xFF5BB8D4), // أزرق سماوي
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 32),

                    // Card
                    Container(
                      padding: const EdgeInsets.all(28),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.05),
                            blurRadius: 20,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          // FIX-02: Subtitle
                          Text(
                            'دخول المسؤول',
                            style: GoogleFonts.tajawal(
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              color: kAdminPrimary,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 6),
                          Text(
                            'استخدم البريد الإلكتروني الخاص بالإدارة',
                            style: GoogleFonts.tajawal(
                              fontSize: 13,
                              color: Colors.grey[600],
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 24),

                          // Email
                          TextFormField(
                            controller: _emailController,
                            textDirection: TextDirection.ltr,
                            textInputAction: TextInputAction.next, // FIX-10
                            onFieldSubmitted: (_) => FocusScope.of(context).nextFocus(), // FIX-10
                            decoration: _inputDeco('البريد الإلكتروني', Icons.email_outlined),
                            // FIX-03
                            validator: (val) {
                              if (val == null || val.trim().isEmpty) return 'البريد مطلوب';
                              if (!val.contains('@') || !val.contains('.')) {
                                return 'صيغة البريد غير صحيحة';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 16),

                          // Password
                          TextFormField(
                            controller: _passwordController,
                            obscureText: _obscurePassword,
                            textDirection: TextDirection.ltr,
                            textInputAction: TextInputAction.done, // FIX-10
                            onFieldSubmitted: (_) => _submit(), // FIX-10
                            decoration: _inputDeco('كلمة المرور', Icons.lock_outline_rounded).copyWith(
                              suffixIcon: IconButton(
                                icon: Icon(
                                  _obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                                  size: 20,
                                ),
                                onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                              ),
                            ),
                            // FIX-03
                            validator: (val) {
                              if (val == null || val.isEmpty) return 'كلمة المرور مطلوبة';
                              if (val.length < 6) return 'يجب أن تكون 6 أحرف على الأقل';
                              return null;
                            },
                          ),
                          const SizedBox(height: 32),

                          // FIX-04: Loading state on button
                          AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            height: 52,
                            child: ElevatedButton(
                              onPressed: _isLoading ? null : _submit,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: kAdminPrimary,
                                disabledBackgroundColor: Colors.grey.shade400,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                elevation: 3,
                              ),
                              child: _isLoading
                                  ? const SizedBox(
                                      width: 22, height: 22,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2.5,
                                        valueColor: AlwaysStoppedAnimation(Colors.white),
                                      ),
                                    )
                                  : Text(
                                      'دخول',
                                      style: GoogleFonts.tajawal(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                    ),
                            ),
                          ),
                          
                          const SizedBox(height: 16),
                          
                          // FIX-06: Forgot Password
                          TextButton(
                            onPressed: _isLoading ? null : _resetPassword,
                            child: Text(
                              'نسيت كلمة المرور؟',
                              style: GoogleFonts.tajawal(
                                color: kAdminTeal,
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ).animate().fade(duration: 400.ms).slideY(begin: 0.1, end: 0),

                    // FIX-08: Security indicator at bottom
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.lock_outline, size: 14, color: Colors.grey),
                        const SizedBox(width: 4),
                        Text(
                          'بياناتك محمية وآمنة',
                          style: GoogleFonts.tajawal(fontSize: 11, color: Colors.grey),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.verified_user_outlined, size: 14, color: Colors.grey),
                        const SizedBox(width: 4),
                        Text(
                          'مُشفَّر بـ SSL',
                          style: GoogleFonts.tajawal(fontSize: 11, color: Colors.grey),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // FIX-09: Input field borders
  InputDecoration _inputDeco(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      labelStyle: GoogleFonts.tajawal(color: Colors.grey[600], fontSize: 14),
      prefixIcon: Icon(icon, color: kAdminPrimary, size: 20),
      filled: true,
      fillColor: const Color(0xFFFAFAFA),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Colors.grey.shade300),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: kAdminTeal, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Colors.red.shade400),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Colors.red.shade400, width: 2),
      ),
    );
  }
}
