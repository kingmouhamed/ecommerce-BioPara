import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../providers/profile_provider.dart';
import '../models/profile_model.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profileAsync = ref.watch(profileProvider);
    final user = Supabase.instance.client.auth.currentUser;

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7F8),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0D6E6E),
        foregroundColor: Colors.white,
        title: Text('الملف الشخصي', style: GoogleFonts.tajawal(fontWeight: FontWeight.bold)),
        elevation: 0,
      ),
      body: profileAsync.when(
        data: (profile) => SingleChildScrollView(
          child: Column(
            children: [
              _buildHeader(profile, user?.email),
              const SizedBox(height: 20),
              _buildInfoSection(profile),
              const SizedBox(height: 30),
              _buildActionButtons(context, ref, profile),
            ],
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator(color: Color(0xFF0D6E6E))),
        error: (err, stack) => Center(child: Text('خطأ في تحميل البيانات: $err')),
      ),
    );
  }

  Widget _buildHeader(Profile? profile, String? email) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: Color(0xFF0D6E6E),
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(32)),
      ),
      child: Column(
        children: [
          CircleAvatar(
            radius: 50,
            backgroundColor: Colors.white24,
            backgroundImage: profile?.avatarUrl != null ? NetworkImage(profile!.avatarUrl!) : null,
            child: profile?.avatarUrl == null ? const Icon(Icons.person, size: 50, color: Colors.white) : null,
          ),
          const SizedBox(height: 16),
          Text(
            profile?.fullName ?? 'مستخدم BioPara',
            style: GoogleFonts.tajawal(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
          ),
          Text(
            email ?? '',
            style: GoogleFonts.tajawal(color: Colors.white70, fontSize: 14),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoSection(Profile? profile) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              _buildInfoTile(Icons.phone, 'رقم الهاتف', profile?.phone ?? 'غير محدد'),
              const Divider(),
              _buildInfoTile(Icons.info_outline, 'نبذة تعريفية', profile?.bio ?? 'لا توجد نبذة'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInfoTile(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(icon, color: const Color(0xFF0D6E6E), size: 24),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: GoogleFonts.tajawal(color: Colors.grey, fontSize: 12)),
              Text(value, style: GoogleFonts.tajawal(fontWeight: FontWeight.w600, fontSize: 15)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons(BuildContext context, WidgetRef ref, Profile? profile) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: [
          _buildActionButton(
            icon: Icons.edit,
            label: 'تعديل الملف الشخصي',
            onTap: () => _showEditDialog(context, ref, profile),
          ),
          const SizedBox(height: 12),
          _buildActionButton(
            icon: Icons.logout,
            label: 'تسجيل الخروج',
            color: Colors.redAccent,
            onTap: () async {
              await Supabase.instance.client.auth.signOut();
              if (context.mounted) {
                Navigator.of(context).popUntil((route) => route.isFirst);
              }
            },
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton({required IconData icon, required String label, required VoidCallback onTap, Color? color}) {
    return ListTile(
      onTap: onTap,
      leading: Icon(icon, color: color ?? const Color(0xFF0D6E6E)),
      title: Text(label, style: GoogleFonts.tajawal(fontWeight: FontWeight.w600, color: color)),
      trailing: const Icon(Icons.arrow_forward_ios, size: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: BorderSide(color: Colors.grey.shade200)),
      tileColor: Colors.white,
    );
  }

  void _showEditDialog(BuildContext context, WidgetRef ref, Profile? profile) {
    final nameController = TextEditingController(text: profile?.fullName);
    final bioController = TextEditingController(text: profile?.bio);
    final phoneController = TextEditingController(text: profile?.phone);

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('تعديل الملف الشخصي', style: GoogleFonts.tajawal(fontWeight: FontWeight.bold)),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameController,
                decoration: const InputDecoration(labelText: 'الاسم الكامل'),
              ),
              TextField(
                controller: bioController,
                decoration: const InputDecoration(labelText: 'نبذة تعريفية'),
              ),
              TextField(
                controller: phoneController,
                decoration: const InputDecoration(labelText: 'رقم الهاتف'),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0D6E6E), foregroundColor: Colors.white),
            onPressed: () async {
              final supabase = Supabase.instance.client;
              final userId = supabase.auth.currentUser?.id;
              if (userId == null) return;

              try {
                // استخدام upsert بدلاً من update لضمان الإنشاء إذا لم يكن موجوداً
                await supabase.from('profiles').upsert({
                  'id': userId,
                  'full_name': nameController.text.trim(),
                  'bio': bioController.text.trim(),
                  'phone': phoneController.text.trim(),
                });

                ref.invalidate(profileProvider);
                if (context.mounted) {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('تم حفظ التعديلات بنجاح'), backgroundColor: Colors.green),
                  );
                }
              } catch (e) {
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('خطأ في التحديث: $e'), backgroundColor: Colors.red),
                  );
                }
              }
            },
            child: const Text('حفظ'),
          ),
        ],
      ),
    );
  }
}
