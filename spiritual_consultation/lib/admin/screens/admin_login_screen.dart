// lib/screens/admin_login_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../core/providers/auth_provider.dart';

const Color _primary      = Color(0xFF2D4A2E);
const Color _primaryLight = Color(0xFF4A7C4E);
const Color _background   = Color(0xFFF5F0E8);
const Color _surface      = Color(0xFFFDFAF5);
const Color _textPrimary  = Color(0xFF1A2E1B);
const Color _textSecondary = Color(0xFF6B7B6C);
const Color _inputBorder  = Color(0xFFD4C9B0);

class AdminLoginScreen extends ConsumerStatefulWidget {
  final String? errorFromWrapper; // لاستقبال الأخطاء من الـ Wrapper
  const AdminLoginScreen({super.key, this.errorFromWrapper});

  @override
  ConsumerState<AdminLoginScreen> createState() => _AdminLoginScreenState();
}

class _AdminLoginScreenState extends ConsumerState<AdminLoginScreen> {
  final _emailController    = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey            = GlobalKey<FormState>();
  bool _isLoading           = false;
  bool _obscurePassword     = true;
  String? _localError;

  @override
  void initState() {
    super.initState();
    // إذا كان هناك خطأ قادم من الـ Wrapper (مثل عدم وجود صلاحيات) نعرضه
    if (widget.errorFromWrapper != null) {
      _localError = widget.errorFromWrapper;
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() { _isLoading = true; _localError = null; });
    
    try {
      final auth = ref.read(authProvider);
      // محاولة تسجيل الدخول
      await auth.signIn(_emailController.text.trim(), _passwordController.text.trim());
      
      // ملاحظة: بمجرد نجاح تسجيل الدخول، سيقوم الـ AdminAuthWrapper في main_admin.dart
      // بإعادة بناء نفسه والانتقال تلقائياً للوحة التحكم إذا كان المستخدم Admin.
      // لا نحتاج لعمل Navigator.push هنا لتجنب التعارض.
      
    } catch (e) {
      if (mounted) {
        setState(() => _localError = _getErrorMessage(e.toString()));
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  String _getErrorMessage(String error) {
    if (error.contains('Invalid login credentials')) return 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
    if (error.contains('rate limit')) return 'تم تجاوز حد المحاولات، يرجى الانتظار قليلاً';
    return 'حدث خطأ: $error';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _background,
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo
                Container(
                  width: 90, height: 90,
                  decoration: BoxDecoration(color: Colors.white, shape: BoxShape.circle,
                    boxShadow: [BoxShadow(color: _primary.withValues(alpha: 0.1), blurRadius: 20)]),
                  child: const Icon(Icons.admin_panel_settings_rounded, color: _primary, size: 45),
                ),
                const SizedBox(height: 16),
                Text('BioPara Admin', style: GoogleFonts.cairo(fontSize: 26, fontWeight: FontWeight.bold, color: _primary)),
                const SizedBox(height: 32),
                
                // Card
                Container(
                  padding: const EdgeInsets.all(28),
                  decoration: BoxDecoration(color: _surface, borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: _inputBorder.withValues(alpha: 0.5))),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                    Text('دخول المسؤول', style: GoogleFonts.cairo(fontSize: 20, fontWeight: FontWeight.bold, color: _textPrimary), textAlign: TextAlign.center),
                    const SizedBox(height: 24),
                    
                    // Email
                    TextFormField(
                      controller: _emailController, textDirection: TextDirection.ltr,
                      decoration: _inputDeco('البريد الإلكتروني', Icons.email_outlined),
                      validator: (val) => (val == null || val.isEmpty) ? 'البريد مطلوب' : null,
                    ),
                    const SizedBox(height: 16),
                    
                    // Password
                    TextFormField(
                      controller: _passwordController, obscureText: _obscurePassword, textDirection: TextDirection.ltr,
                      decoration: _inputDeco('كلمة المرور', Icons.lock_outline_rounded).copyWith(
                        suffixIcon: IconButton(icon: Icon(_obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined, size: 20),
                          onPressed: () => setState(() => _obscurePassword = !_obscurePassword))),
                      validator: (val) => (val == null || val.isEmpty) ? 'كلمة المرور مطلوبة' : null,
                    ),
                    
                    if (_localError != null) Padding(padding: const EdgeInsets.only(top: 16),
                      child: Text(_localError!, style: GoogleFonts.tajawal(color: Colors.redAccent, fontSize: 13, fontWeight: FontWeight.bold), textAlign: TextAlign.center)),
                    
                    const SizedBox(height: 32),
                    
                    // Submit
                    ElevatedButton(
                      onPressed: _isLoading ? null : _submit,
                      style: ElevatedButton.styleFrom(backgroundColor: _primary, foregroundColor: Colors.white,
                        minimumSize: const Size(double.infinity, 56), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
                      child: _isLoading ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : Text('دخول', style: GoogleFonts.cairo(fontSize: 18, fontWeight: FontWeight.bold)),
                    ),
                  ]),
                ).animate().fade(duration: 400.ms).slideY(begin: 0.1, end: 0),

                // زر الخروج (للمسح في حال كان هناك مستخدم عالق)
                if (Supabase.instance.client.auth.currentUser != null)
                  TextButton(
                    onPressed: () async {
                      await Supabase.instance.client.auth.signOut();
                      setState(() { _localError = null; });
                    },
                    child: Text('تسجيل الخروج من الحساب الحالي', style: GoogleFonts.tajawal(color: _textSecondary, fontSize: 12)),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  InputDecoration _inputDeco(String label, IconData icon) => InputDecoration(
    labelText: label, labelStyle: GoogleFonts.tajawal(color: _textSecondary, fontSize: 14),
    prefixIcon: Icon(icon, color: _primaryLight, size: 20),
    filled: true, fillColor: Colors.white,
    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: _inputBorder)),
    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: _primary, width: 2)),
  );
}
