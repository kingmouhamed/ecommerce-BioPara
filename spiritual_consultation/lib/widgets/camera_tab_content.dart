import 'package:flutter/material.dart';

class CameraTabContent extends StatelessWidget {
  const CameraTabContent({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // ── MOCK CAMERA PREVIEW ──
          Positioned.fill(
            child: Container(
              color: Colors.black,
              child: const Center(
                child: Icon(Icons.camera_alt_outlined, color: Colors.white24, size: 100),
              ),
            ),
          ),

          // ── CONTROLS OVERLAY ──
          Positioned(
            bottom: 30,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                IconButton(
                  icon: const Icon(Icons.flash_off, color: Colors.white, size: 30),
                  onPressed: () {},
                ),
                GestureDetector(
                  onTap: () {
                     ScaffoldMessenger.of(context).showSnackBar(
                       const SnackBar(content: Text('📸 تم التقاط الصورة!')),
                     );
                  },
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.white, width: 3),
                      shape: BoxShape.circle,
                    ),
                    child: const CircleAvatar(
                      radius: 35,
                      backgroundColor: Colors.white,
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.flip_camera_ios, color: Colors.white, size: 30),
                  onPressed: () {},
                ),
              ],
            ),
          ),
          const Positioned(
            bottom: 120,
            left: 0,
            right: 0,
            child: Center(
              child: Text(
                'استمر في الضغط للفيديو، انقر للصورة',
                style: TextStyle(color: Colors.white70),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
