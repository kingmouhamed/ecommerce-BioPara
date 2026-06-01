import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class EditProfileScreen extends StatefulWidget {
  final String currentName;
  final String currentPhone;
  final String currentHandle;

  const EditProfileScreen({
    super.key,
    required this.currentName,
    required this.currentPhone,
    required this.currentHandle,
  });

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  // تعريف الألوان الأساسية للهوية (متطابقة مع البروفايل)
  static const Color primary = Color(0xFF2D4A2E);
  static const Color primaryLight = Color(0xFF4A7C4E);
  static const Color background = Color(0xFFF5F0E8);
  static const Color surface = Color(0xFFFDFAF5);
  static const Color textPrimary = Color(0xFF1A2E1B);
  static const Color textSecondary = Color(0xFF6B7B6C);
  static const Color inputBorder = Color(0xFFD4C9B0);

  late TextEditingController _nameController;
  late TextEditingController _phoneController;
  late TextEditingController _handleController;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.currentName);
    _phoneController = TextEditingController(text: widget.currentPhone);
    _handleController = TextEditingController(text: widget.currentHandle);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _handleController.dispose();
    super.dispose();
  }

  Future<void> _saveProfile() async {
    setState(() => _isLoading = true);
    
    try {
      // محاكاة حفظ البيانات أو ربطها بـ Supabase
      // final user = Supabase.instance.client.auth.currentUser;
      // await Supabase.instance.client.auth.updateUser(
      //   UserAttributes(data: {'full_name': _nameController.text}),
      // );
      
      await Future.delayed(const Duration(seconds: 1)); // تأخير جمالي
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("تم تحديث البيانات بنجاح"),
            backgroundColor: primary,
            behavior: SnackBarBehavior.floating,
          ),
        );
        Navigator.pop(context, {
          'name': _nameController.text,
          'phone': _phoneController.text,
          'handle': _handleController.text,
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("خطأ في التحديث: $e"), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: Directionality(
          textDirection: TextDirection.ltr,
          child: IconButton(
            icon: const Icon(Icons.arrow_back, color: textPrimary, size: 22),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        title: Text(
          "تعديل الملف الشخصي",
          style: GoogleFonts.cairo(
            color: textPrimary,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // تلميح جمالي
            Text(
              "تحديث معلوماتك الشخصية لضمان تواصل أفضل مع خبرائنا.",
              style: GoogleFonts.tajawal(
                color: textSecondary,
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 32),

            // حقل الاسم
            _buildInputField(
              label: "الاسم الكامل",
              controller: _nameController,
              icon: Icons.person_outline,
            ),
            const SizedBox(height: 24),

            // حقل الهاتف
            _buildInputField(
              label: "رقم الهاتف",
              controller: _phoneController,
              icon: Icons.phone_outlined,
              keyboardType: TextInputType.phone,
            ),
            const SizedBox(height: 24),

            // حقل المعرف
            _buildInputField(
              label: "اسم المعرّف",
              controller: _handleController,
              icon: Icons.alternate_email,
            ),
            
            const SizedBox(height: 48),

            // زر الحفظ
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _saveProfile,
                style: ElevatedButton.styleFrom(
                  backgroundColor: primary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 0,
                ),
                child: _isLoading
                    ? const SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      )
                    : Text(
                        "حفظ التغييرات",
                        style: GoogleFonts.cairo(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInputField({
    required String label,
    required TextEditingController controller,
    required IconData icon,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.cairo(
            fontSize: 14,
            fontWeight: FontWeight.bold,
            color: textPrimary,
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          keyboardType: keyboardType,
          style: GoogleFonts.tajawal(color: textPrimary),
          decoration: InputDecoration(
            prefixIcon: Icon(icon, color: primaryLight, size: 20),
            filled: true,
            fillColor: surface,
            hintText: "أدخل $label",
            hintStyle: GoogleFonts.tajawal(color: textSecondary.withValues(alpha: 0.5)),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: inputBorder),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: inputBorder.withValues(alpha: 0.5)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: primary, width: 1.5),
            ),
          ),
        ),
      ],
    );
  }
}