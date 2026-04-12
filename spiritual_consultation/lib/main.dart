import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'screens/login_screen.dart';
import 'screens/admin_dashboard_screen.dart';
import 'screens/ai_intake_screen.dart';
import 'screens/whatsapp_home.dart';
import 'providers/auth_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await dotenv.load(fileName: '.env');

  try {
    await Supabase.initialize(
      url: dotenv.env['SUPABASE_URL']!,
      anonKey: dotenv.env['SUPABASE_ANON_KEY']!,
    );
    debugPrint('✅ Supabase initialized successfully.');
  } catch (e) {
    debugPrint('❌ Supabase init error: $e');
  }

  runApp(const ProviderScope(child: BioParaSpiritualApp()));
}

class BioParaSpiritualApp extends StatelessWidget {
  const BioParaSpiritualApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BioPara Spiritual',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color(0xFF2E7D32),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF2E7D32),
          primary: const Color(0xFF2E7D32),
        ),
        useMaterial3: true,
      ),
      // دعم النص العربي
      builder: (context, child) {
        return Directionality(textDirection: TextDirection.rtl, child: child ?? const SizedBox.shrink());
      },
      home: const AuthWrapper(),
    );
  }
}

/// يُوجّه المستخدم تلقائياً:
/// - إذا كان مُسجّل دخوله وأكمل الـ Intake → شاشة الشات
/// - إذا كان مُسجّل دخوله ولم يكمل الـ Intake → شاشة المساعد الذكي
/// - إذا لم يكن مُسجّلاً → شاشة تسجيل الدخول
class AuthWrapper extends ConsumerStatefulWidget {
  const AuthWrapper({super.key});

  @override
  ConsumerState<AuthWrapper> createState() => _AuthWrapperState();
}

class _AuthWrapperState extends ConsumerState<AuthWrapper> {
  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authStateProvider);

    return authState.when(
      data: (state) {
        final isLoggedIn = state.session != null;
        if (isLoggedIn) {
          final email = state.session?.user.email ?? '';
          final userId = state.session?.user.id ?? '';

          if (email.startsWith('admin')) {
            return const AdminDashboardScreen();
          }

          // للمرضى: فحص إذا أكملوا الـ Intake Form
          return _PatientRouter(userId: userId);
        }
        return const LoginScreen();
      },
      loading: () => const Scaffold(
        backgroundColor: Color(0xFFF0F7F0),
        body: Center(
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF4CAF50)),
          ),
        ),
      ),
      error: (e, st) => const LoginScreen(),
    );
  }
}

/// ويدجت يفحص إذا المريض أكمل الـ Intake ويوجهه بناءً على ذلك
class _PatientRouter extends StatefulWidget {
  final String userId;
  const _PatientRouter({required this.userId});

  @override
  State<_PatientRouter> createState() => _PatientRouterState();
}

class _PatientRouterState extends State<_PatientRouter> {
  bool _loading = true;
  bool _intakeCompleted = false;

  @override
  void initState() {
    super.initState();
    _checkIntakeStatus();
  }

  Future<void> _checkIntakeStatus() async {
    try {
      final result = await Supabase.instance.client
          .from('conversations')
          .select('intake_completed')
          .eq('id', widget.userId)
          .maybeSingle();

      if (mounted) {
        setState(() {
          _intakeCompleted = result?['intake_completed'] == true;
          _loading = false;
        });
      }
    } catch (e) {
      debugPrint('❌ Error checking intake status: $e');
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        backgroundColor: Color(0xFFF0F7F0),
        body: Center(
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF4CAF50)),
          ),
        ),
      );
    }

    if (_intakeCompleted) {
      return WhatsAppHome(userId: widget.userId);
    }

    return AiIntakeScreen(userId: widget.userId);
  }
}
