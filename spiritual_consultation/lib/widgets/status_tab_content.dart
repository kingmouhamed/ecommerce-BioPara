import 'package:flutter/material.dart';

class StatusTabContent extends StatelessWidget {
  const StatusTabContent({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.symmetric(vertical: 8),
      children: [
        // ── SECTION: MY STATUS ──
        ListTile(
          leading: Stack(
            children: [
              const CircleAvatar(
                radius: 27,
                backgroundColor: Colors.grey,
                child: Icon(Icons.person, color: Colors.white, size: 35),
              ),
              Positioned(
                bottom: 0,
                right: 0,
                child: Container(
                  padding: const EdgeInsets.all(2),
                  decoration: const BoxDecoration(
                    color: Color(0xFF2E7D32),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.add, color: Colors.white, size: 18),
                ),
              ),
            ],
          ),
          title: const Text('حالتبي', style: TextStyle(fontWeight: FontWeight.bold)),
          subtitle: const Text('انقر لإضافة تحديث لحالتك'),
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('ميزة رفع الحالات قريباً! 📸')),
            );
          },
        ),

        // ── LABEL: RECENT UPDATES ──
        const Padding(
          padding: EdgeInsets.fromLTRB(16, 16, 16, 8),
          child: Text(
            'تحديثات الحالة الأخيرة',
            style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold, fontSize: 13),
          ),
        ),

        // ── MOCK STATUS LIST ──
        _buildStatusItem(
          context,
          'كمال البربوشي',
          'منذ ساعة واحدة',
          'https://i.pravatar.cc/150?u=1',
          isViewed: false,
          statusCount: 3,
        ),
        _buildStatusItem(
          context,
          'د. سمية',
          'منذ 3 ساعات',
          'https://i.pravatar.cc/150?u=2',
          isViewed: false,
          statusCount: 1,
        ),

        // ── LABEL: VIEWED UPDATES ──
        const Padding(
          padding: EdgeInsets.fromLTRB(16, 16, 16, 8),
          child: Text(
            'الحالات التي تمت مشاهدتها',
            style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold, fontSize: 13),
          ),
        ),
        _buildStatusItem(
          context,
          'أحمد المحمدي',
          'اليوم، 10:30 صباحاً',
          'https://i.pravatar.cc/150?u=3',
          isViewed: true,
          statusCount: 2,
        ),
      ],
    );
  }

  Widget _buildStatusItem(
    BuildContext context,
    String name,
    String time,
    String imageUrl, {
    required bool isViewed,
    required int statusCount,
  }) {
    return ListTile(
      leading: CustomPaint(
        painter: _StatusRingPainter(
          isViewed: isViewed,
          segments: statusCount,
        ),
        child: Padding(
          padding: const EdgeInsets.all(4.0),
          child: CircleAvatar(
            radius: 24,
            backgroundImage: NetworkImage(imageUrl),
          ),
        ),
      ),
      title: Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
      subtitle: Text(time),
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('مشاهدة حالة $name قريباً!')),
        );
      },
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Status Ring Painter: يرسم الإطار المتقطع حول الحالة
// ─────────────────────────────────────────────────────────────
class _StatusRingPainter extends CustomPainter {
  final bool isViewed;
  final int segments;

  _StatusRingPainter({required this.isViewed, required this.segments});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round
      ..color = isViewed ? Colors.grey[400]! : const Color(0xFF2E7D32);

    if (segments <= 1) {
      canvas.drawCircle(Offset(size.width / 2, size.height / 2), size.width / 2, paint);
    } else {
      final double spacing = 0.15; // Space between segments
      final double segmentLength = (2 * 3.14159 - (spacing * segments)) / segments;

      for (int i = 0; i < segments; i++) {
        final double startAngle = (segmentLength + spacing) * i - (3.14159 / 2);
        canvas.drawArc(
          Rect.fromLTWH(0, 0, size.width, size.height),
          startAngle + (spacing / 2),
          segmentLength,
          false,
          paint,
        );
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
