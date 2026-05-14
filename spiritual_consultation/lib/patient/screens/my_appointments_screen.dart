import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:intl/intl.dart';

class MyAppointmentsScreen extends StatefulWidget {
  const MyAppointmentsScreen({super.key});

  @override
  State<MyAppointmentsScreen> createState() => _MyAppointmentsScreenState();
}

class _MyAppointmentsScreenState extends State<MyAppointmentsScreen> {
  final _supabase = Supabase.instance.client;
  bool _isLoading = true;
  List<Map<String, dynamic>> _appointments = [];

  // Colors
  final Color primary = const Color(0xFF2D4A2E);
  final Color primaryLight = const Color(0xFFE8F5E9);
  final Color accent = const Color(0xFFC8963E);
  final Color textPrimary = const Color(0xFF1A1A1A);
  final Color textSecondary = const Color(0xFF666666);
  final Color danger = const Color(0xFFE57373);

  @override
  void initState() {
    super.initState();
    _fetchAppointments();
  }

  Future<void> _fetchAppointments() async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) return;

      final data = await _supabase
          .from('appointments')
          .select('*')
          .eq('patient_id', userId)
          .order('appointment_date', ascending: false);

      if (mounted) {
        setState(() {
          _appointments = List<Map<String, dynamic>>.from(data);
          _isLoading = false;
        });
      }
    } catch (e) {
      debugPrint('Error fetching appointments: $e');
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(
          'مواعيدي',
          style: GoogleFonts.cairo(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: textPrimary,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator(color: primary))
          : _appointments.isEmpty
              ? _buildEmptyState()
              : RefreshIndicator(
                  onRefresh: _fetchAppointments,
                  color: primary,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(20),
                    itemCount: _appointments.length,
                    itemBuilder: (context, index) => _buildAppointmentCard(_appointments[index]),
                  ),
                ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.calendar_month_outlined, size: 80, color: primaryLight),
          const SizedBox(height: 20),
          Text(
            'لا ØªÙˆجد Ù…Ùˆاعيد Ù…Ø­Ø¬Ùˆزة حالياً',
            style: GoogleFonts.cairo(fontSize: 18, fontWeight: FontWeight.bold, color: textPrimary),
          ),
          const SizedBox(height: 10),
          Text(
            'ÙŠÙ…ÙƒÙ†Ùƒ حجز Ø§Ø³ØªØ´Ø§Ø±ØªÙƒ Ø§Ù„Ø£ÙˆÙ„Ù‰ Ù…Ù† خلال شاشة الحجز',
            style: GoogleFonts.tajawal(color: textSecondary),
          ),
        ],
      ),
    );
  }

  Widget _buildAppointmentCard(Map<String, dynamic> appointment) {
    final date = DateTime.parse(appointment['appointment_date']);
    final status = appointment['status'] ?? 'pending';
    final notes = appointment['notes'] ?? '';

    Color statusColor;
    String statusText;
    switch (status) {
      case 'confirmed':
        statusColor = Colors.green;
        statusText = 'Ù…Ø¤Ùƒد';
        break;
      case 'cancelled':
        statusColor = danger;
        statusText = 'ملغى';
        break;
      default:
        statusColor = accent;
        statusText = 'Ù‚يد Ø§Ù„Ø§Ù†تظار';
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
        border: Border.all(color: primaryLight.withValues(alpha: 0.5)),
      ),
      child: Column(
        children: [
          // Header Status
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: statusColor.withValues(alpha: 0.1),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(20),
                topRight: Radius.circular(20),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(Icons.circle, size: 8, color: statusColor),
                    const SizedBox(width: 8),
                    Text(
                      statusText,
                      style: GoogleFonts.tajawal(
                        color: statusColor,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
                Text(
                  'Ø±Ù‚م الحجز: #${appointment['id'].toString().substring(0, 8)}',
                  style: GoogleFonts.tajawal(color: textSecondary, fontSize: 11),
                ),
              ],
            ),
          ),
          
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                // Date Column
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: primaryLight,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    children: [
                      Text(
                        DateFormat('dd').format(date),
                        style: GoogleFonts.cairo(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: primary,
                        ),
                      ),
                      Text(
                        DateFormat('MMM', 'ar').format(date),
                        style: GoogleFonts.tajawal(
                          fontSize: 12,
                          color: primary,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                
                // Details Column
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _parseTypeFromNotes(notes),
                        style: GoogleFonts.cairo(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: textPrimary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(Icons.access_time, size: 14, color: accent),
                          const SizedBox(width: 4),
                          Text(
                            DateFormat('hh:mm a').format(date),
                            style: GoogleFonts.tajawal(fontSize: 13, color: textSecondary),
                          ),
                          const SizedBox(width: 12),
                          Icon(Icons.timer_outlined, size: 14, color: accent),
                          const SizedBox(width: 4),
                          Text(
                            _parseDurationFromNotes(notes),
                            style: GoogleFonts.tajawal(fontSize: 13, color: textSecondary),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                
                // Action Icon
                Icon(Icons.arrow_forward_ios, size: 14, color: primary.withValues(alpha: 0.3)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _parseTypeFromNotes(String notes) {
    try {
      if (notes.contains('Ù†Ùˆع الجلسة:')) {
        return notes.split('Ù†Ùˆع الجلسة:')[1].split('\n')[0].trim();
      }
    } catch (_) {}
    return 'استشارة Ø±ÙˆØ­Ø§Ù†ية';
  }

  String _parseDurationFromNotes(String notes) {
    try {
      if (notes.contains('المدة:')) {
        return notes.split('المدة:')[1].split('\n')[0].trim();
      }
    } catch (_) {}
    return '30 Ø¯Ù‚ÙŠÙ‚ة';
  }
}
