import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spiritual_consultation/providers/auth_provider.dart';
import 'chat_screen.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen>
    with SingleTickerProviderStateMixin {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  bool _isLogin = true; // true = تسجيل دخول, false = إنشاء حساب
  bool _isLoading = false;
  bool _obscurePassword = true;

  late AnimationController _animController;
  late Animation<double> _fadeAnim;

  // ألوان التطبيق
  static const Color _primaryGreen = Color(0xFF1B5E20);
  static const Color _accentGreen = Color(0xFF4CAF50);
  static const Color _lightGreen = Color(0xFFE8F5E9);

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );
    _fadeAnim = CurvedAnimation(parent: _animController, curve: Curves.easeIn);
    _animController.forward();
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _animController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);

    final auth = ref.read(authProvider);
    try {
      if (_isLogin) {
        await auth.signIn(
          _emailController.text.trim(),
          _passwordController.text.trim(),
        );
      } else {
        await auth.signUp(
          _emailController.text.trim(),
          _passwordController.text.trim(),
        );
      }

      if (!mounted) return;

      // انتقل إلى شاشة الشات بعد نجاح العملية
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (_) => const ChatScreen(
            consultationId: '00000000-0000-0000-0000-000000000000',
          ),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              const Icon(Icons.error_outline, color: Colors.white),
              const SizedBox(width: 8),
              Expanded(child: Text(_getErrorMessage(e.toString()))),
            ],
          ),
          backgroundColor: Colors.red.shade700,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  String _getErrorMessage(String error) {
    if (error.contains('Invalid login')) return 'البريد أو كلمة المرور غير صحيحة';
    if (error.contains('already registered')) return 'هذا البريد مسجّل مسبقاً';
    if (error.contains('email')) return 'صيغة البريد الإلكتروني غير صحيحة';
    if (error.contains('password')) return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    if (error.contains('network')) return 'تحقق من اتصالك بالإنترنت';
    return 'حدث خطأ. يرجى المحاولة مجدداً.';
  }

  void _toggleMode() {
    setState(() => _isLogin = !_isLogin);
    _animController.reset();
    _animController.forward();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F7F0),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 24),
            child: FadeTransition(
              opacity: _fadeAnim,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // أيقونة التطبيق
                  Container(
                    width: 90,
                    height: 90,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [_primaryGreen, _accentGreen],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: _primaryGreen.withValues(alpha: 0.3),
                          blurRadius: 20,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: const Icon(Icons.eco, size: 48, color: Colors.white),
                  ),
                  const SizedBox(height: 20),

                  // عنوان التطبيق
                  const Text(
                    'BioPara',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: _primaryGreen,
                      letterSpacing: 1.2,
                    ),
                  ),
                  const Text(
                    'استشارة صحية وروحية ذكية',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey,
                    ),
                  ),
                  const SizedBox(height: 36),

                  // بطاقة النموذج
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.08),
                          blurRadius: 20,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    padding: const EdgeInsets.all(24),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          // عنوان النموذج
                          Text(
                            _isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد',
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: _primaryGreen,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 6),
                          Text(
                            _isLogin
                                ? 'أدخل بياناتك للوصول إلى استشاراتك'
                                : 'أنشئ حساباً للاستفادة من خدماتنا',
                            style: const TextStyle(
                              fontSize: 12,
                              color: Colors.grey,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 24),

                          // حقل البريد
                          TextFormField(
                            controller: _emailController,
                            keyboardType: TextInputType.emailAddress,
                            textDirection: TextDirection.ltr,
                            decoration: InputDecoration(
                              labelText: 'البريد الإلكتروني',
                              prefixIcon: const Icon(
                                Icons.email_outlined,
                                color: _accentGreen,
                              ),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(color: Colors.grey.shade300),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(color: Colors.grey.shade300),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: const BorderSide(color: _accentGreen, width: 2),
                              ),
                              filled: true,
                              fillColor: const Color(0xFFFAFAFA),
                            ),
                            validator: (val) {
                              if (val == null || val.isEmpty) return 'البريد مطلوب';
                              if (!val.contains('@')) return 'صيغة البريد غير صحيحة';
                              return null;
                            },
                          ),
                          const SizedBox(height: 16),

                          // حقل كلمة المرور
                          TextFormField(
                            controller: _passwordController,
                            obscureText: _obscurePassword,
                            textDirection: TextDirection.ltr,
                            decoration: InputDecoration(
                              labelText: 'كلمة المرور',
                              prefixIcon: const Icon(
                                Icons.lock_outlined,
                                color: _accentGreen,
                              ),
                              suffixIcon: IconButton(
                                icon: Icon(
                                  _obscurePassword
                                      ? Icons.visibility_outlined
                                      : Icons.visibility_off_outlined,
                                  color: Colors.grey,
                                ),
                                onPressed: () =>
                                    setState(() => _obscurePassword = !_obscurePassword),
                              ),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(color: Colors.grey.shade300),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: const BorderSide(color: _accentGreen, width: 2),
                              ),
                              filled: true,
                              fillColor: const Color(0xFFFAFAFA),
                            ),
                            validator: (val) {
                              if (val == null || val.isEmpty) return 'كلمة المرور مطلوبة';
                              if (val.length < 6) return 'يجب أن تكون 6 أحرف على الأقل';
                              return null;
                            },
                          ),
                          const SizedBox(height: 24),

                          // زر التسجيل/الدخول
                          AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            height: 52,
                            child: ElevatedButton(
                              onPressed: _isLoading ? null : _submit,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: _primaryGreen,
                                foregroundColor: Colors.white,
                                disabledBackgroundColor: Colors.grey.shade400,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                elevation: 3,
                              ),
                              child: _isLoading
                                  ? const SizedBox(
                                      width: 22,
                                      height: 22,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2.5,
                                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                      ),
                                    )
                                  : Text(
                                      _isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب',
                                      style: const TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // التبديل بين الدخول والتسجيل
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        _isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟',
                        style: const TextStyle(color: Colors.grey),
                      ),
                      TextButton(
                        onPressed: _isLoading ? null : _toggleMode,
                        child: Text(
                          _isLogin ? 'أنشئ حساباً' : 'سجّل الدخول',
                          style: const TextStyle(
                            color: _primaryGreen,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),

                  // شريط أخضر للديكور
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 30,
                        height: 3,
                        decoration: BoxDecoration(
                          color: _lightGreen,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                      const SizedBox(width: 6),
                      const Icon(Icons.eco, size: 14, color: _accentGreen),
                      const SizedBox(width: 6),
                      Container(
                        width: 30,
                        height: 3,
                        decoration: BoxDecoration(
                          color: _lightGreen,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'بياناتك محمية وآمنة',
                    style: TextStyle(fontSize: 11, color: Colors.grey),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
