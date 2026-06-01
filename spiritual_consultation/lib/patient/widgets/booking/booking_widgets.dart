// lib/patient/widgets/booking/booking_widgets.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

// --- رسام نمط الأعشاب ---
class HerbPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white
      ..strokeWidth = 1
      ..style = PaintingStyle.stroke;

    for (var i = 0; i < 5; i++) {
      canvas.drawCircle(Offset(size.width * (i / 5), 20), 30, paint);
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}

// --- قاطع الهيدر المتموج ---
class HeaderWaveClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) {
    var path = Path();
    path.lineTo(0, size.height - 30);
    path.quadraticBezierTo(size.width / 4, size.height, size.width / 2, size.height - 20);
    path.quadraticBezierTo(size.width * 3 / 4, size.height - 40, size.width, size.height - 10);
    path.lineTo(size.width, 0);
    path.close();
    return path;
  }

  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) => false;
}

// --- بطاقة المستشار ---
class ConsultantCard extends StatelessWidget {
  final Color primary;
  final Color accent;
  final Color success;
  final Color textPrimary;
  final Color textSecondary;
  final Color surface;
  final Color inputBorder;
  final Color shadowColor;

  const ConsultantCard({
    super.key,
    required this.primary,
    required this.accent,
    required this.success,
    required this.textPrimary,
    required this.textSecondary,
    required this.surface,
    required this.inputBorder,
    required this.shadowColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: inputBorder.withValues(alpha: 0.4)),
        boxShadow: [BoxShadow(color: shadowColor, blurRadius: 15, offset: const Offset(0, 5))],
      ),
      child: Row(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: primary.withValues(alpha: 0.1),
              shape: BoxShape.circle,
              border: Border.all(color: accent, width: 2),
            ),
            child: Icon(Icons.person_pin_rounded, color: primary, size: 36),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("إلياس المساوي", style: GoogleFonts.cairo(fontSize: 16, fontWeight: FontWeight.bold, color: textPrimary)),
                Text("خبير في الاعشاب الطبية وامراض الصحية و الروحية", style: GoogleFonts.tajawal(fontSize: 13, color: textSecondary)),
                Row(
                  children: [
                    Icon(Icons.star_rounded, color: accent, size: 16),
                    Icon(Icons.star_rounded, color: accent, size: 16),
                    Icon(Icons.star_rounded, color: accent, size: 16),
                    Icon(Icons.star_rounded, color: accent, size: 16),
                    Icon(Icons.star_half_rounded, color: accent, size: 16),
                    const SizedBox(width: 4),
                    Text("(48 تقييم)", style: GoogleFonts.tajawal(fontSize: 12, color: textSecondary)),
                  ],
                ),
              ],
            ),
          ),
          Row(
            children: [
              Container(width: 8, height: 8, decoration: BoxDecoration(color: success, shape: BoxShape.circle)),
              const SizedBox(width: 4),
              Text("متاح", style: GoogleFonts.tajawal(fontSize: 12, color: success)),
            ],
          ),
        ],
      ),
    );
  }
}

// --- بطاقة النصيحة ---
class TipCard extends StatelessWidget {
  final String tip;
  final Color accent;
  final Color textSecondary;

  const TipCard({
    super.key,
    required this.tip,
    required this.accent,
    required this.textSecondary,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: accent.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Text(tip, style: GoogleFonts.tajawal(fontSize: 13, color: textSecondary, fontStyle: FontStyle.italic)),
    );
  }
}
