// lib/patient/widgets/chat/chat_widgets.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:metadata_fetch/metadata_fetch.dart';
import 'package:video_player/video_player.dart';
import 'package:audioplayers/audioplayers.dart';

import '../../../core/models/message_model.dart';
import '../../../core/services/storage_service.dart';

// ── BioPara Brand Theme Constants ──────────────────────────
const Color _kPrimary      = Color(0xFF3D5A3E); // Deep Olive Green
const Color _kGold         = Color(0xFFC8963E); // Warm Gold/Amber
const Color _kSage         = Color(0xFF8FAF8F); // Soft Sage Green
const Color _kSender       = Color(0xFF3D5A3E); // Sent bubble: Deep Olive
const Color _kReceiver     = Colors.white;      // Received bubble: white
const Color _kLinkBg       = Color(0xFFECE5D8); // Link preview background
const Color _textSecondary = Color(0xFF6B7B6C); // Secondary text color (Grey-Green)

// ── Bubble Widget ──
class Bubble extends ConsumerWidget {
  final MessageModel msg;
  final bool isMe;
  final bool showTail;
  final bool isFirstInGroup;
  final bool isStarred;
  final VoidCallback onStar;
  final VoidCallback onLongPress;
  final VoidCallback onJoinCall;

  const Bubble({
    super.key,
    required this.msg,
    required this.isMe,
    this.showTail = false,
    this.isFirstInGroup = false,
    required this.isStarred,
    required this.onStar,
    required this.onLongPress,
    required this.onJoinCall,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      width: double.infinity,
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Padding(
        padding: EdgeInsets.only(
          bottom: isFirstInGroup ? 8 : 2,
          left: isMe ? 52 : 8,
          right: isMe ? 8 : 52,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            if (!isMe && showTail)
              CustomPaint(
                size: const Size(8, 10),
                painter: BubbleTailPainter(color: _kReceiver, isMe: false),
              )
            else if (!isMe)
              const SizedBox(width: 8),
            
            Flexible(
              child: GestureDetector(
                onLongPress: onLongPress,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: isMe ? _kSender : _kReceiver,
                    gradient: isMe ? const LinearGradient(
                      colors: [_kSage, Color(0xFF7A9F7A)],
                      begin: Alignment.topLeft, end: Alignment.bottomRight,
                    ) : null,
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(isMe ? 18 : (showTail ? 4 : 18)),
                      topRight: Radius.circular(isMe ? (showTail ? 4 : 18) : 18),
                      bottomLeft: const Radius.circular(18),
                      bottomRight: const Radius.circular(18),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.08),
                        blurRadius: 8, offset: const Offset(0, 2)),
                    ],
                    border: isMe ? Border.all(color: _kSage.withValues(alpha: 0.4), width: 0.5) : null,
                  ),
                  child: Stack(
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(bottom: 12, right: 4),
                        child: Column(
                          crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            if (msg.metadata['replyToId'] != null) _buildReplyInBubble(),
                            _buildBubbleContent(ref),
                          ],
                        ),
                      ),
                      Positioned(
                        bottom: -2,
                        right: 0,
                        child: _buildStatus(msg),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            if (isMe && showTail)
              CustomPaint(
                size: const Size(8, 10),
                painter: BubbleTailPainter(color: _kSender, isMe: true),
              )
            else if (isMe)
              const SizedBox(width: 8),
          ],
        ),
      ),
    );
  }

  Widget _buildReplyInBubble() => Container(
    margin: const EdgeInsets.only(bottom: 6),
    padding: const EdgeInsets.all(6),
    decoration: BoxDecoration(
      color: Colors.black.withValues(alpha: 0.05),
      borderRadius: BorderRadius.circular(8),
      border: const Border(left: BorderSide(color: _kPrimary, width: 3)),
    ),
    child: Text(
      msg.metadata['replyToContent'] ?? '',
      maxLines: 2,
      overflow: TextOverflow.ellipsis,
      style: GoogleFonts.cairo(fontSize: 12, color: Colors.black54),
    ),
  );

  Widget _buildBubbleContent(WidgetRef ref) {
    switch (msg.type) {
      case MessageType.image:
        return SecureImage(url: msg.content);
      
      case MessageType.video:
        return VideoBubble(url: msg.content);
      
      case MessageType.audio:
        return AudioPlayerBubble(url: msg.content, isMe: isMe);

      case MessageType.document:
        final fileName = msg.metadata['fileName'] ?? 'مستند.pdf';
        return InkWell(
          onTap: () async {
            try {
              final storage = ref.read(storageServiceProvider);
              final path = storage.extractPath(msg.content);
              final launchUrlStr = path != null
                  ? await storage.getSignedUrl(path)
                  : msg.content;
              final uri = Uri.parse(launchUrlStr);
              if (await canLaunchUrl(uri)) {
                await launchUrl(uri, mode: LaunchMode.externalApplication);
              }
            } catch (e) {
              debugPrint('Error opening document: $e');
            }
          },
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.description, color: _kPrimary, size: 30),
              const SizedBox(width: 8),
              Flexible(
                child: Text(
                  fileName,
                  style: const TextStyle(decoration: TextDecoration.underline, color: _kPrimary),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        );

      case MessageType.callInvite:
        // ── قراءة حالة المكالمة من metadata ──────────────────
        final callStatus = (msg.metadata['call_status'] as String?) ?? '';
        final callDuration = msg.metadata['call_duration'] as String?;
        final callTime   = msg.createdAt ?? DateTime.now();
        final ageSeconds = DateTime.now().difference(callTime).inSeconds;

        // نعتبر المكالمة نشطة فقط إذا:
        // 1. لم تُحدَّث بـ ended/cancelled/declined/missed
        // 2. عمرها أقل من 90 ثانية
        final isActiveCall = callStatus.isEmpty
            ? ageSeconds < 90
            : callStatus == 'active';
        final isEndedCall  = callStatus == 'ended' ||
            callStatus == 'cancelled' ||
            callStatus == 'declined' ||
            callStatus == 'missed';
        final isMissedCall = !isActiveCall && !isMe;
        final isVideo      = msg.content.contains('فيديو');

        // المريض فقط يرى زر الانضمام (ليس المرسل نفسه)
        final canJoin = isActiveCall && !isMe;

        final accentColor = isEndedCall
            ? Colors.grey
            : (isMissedCall && !canJoin ? Colors.red.shade400 : _kPrimary);

        return Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                CircleAvatar(
                  radius: 18,
                  backgroundColor: accentColor.withValues(alpha: 0.15),
                  child: Icon(
                    isVideo ? Icons.videocam : Icons.call,
                    color: accentColor, size: 20,
                  ),
                ),
                const SizedBox(width: 10),
                Flexible(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        isVideo ? 'مكالمة فيديو' : 'مكالمة صوتية',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: accentColor,
                        ),
                      ),
                      Text(
                        // ── عرض الحالة الصحيحة ──────────────
                        canJoin
                          ? 'مكالمة واردة...'
                          : isMe
                            ? (isEndedCall ? 'مكالمة صادرة' : 'جاري الاتصال...')
                            : (isEndedCall ? 'مكالمة فائتة' : 'مكالمة فائتة'),
                        style: TextStyle(
                          fontSize: 11,
                          color: isMissedCall && !canJoin
                              ? Colors.red.shade300
                              : Colors.grey.shade500,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            // ── زر الانضمام — فقط للمكالمات النشطة ──────────
            if (canJoin) ...[
              const SizedBox(height: 8),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: onJoinCall,
                  icon: const Icon(Icons.call, size: 16),
                  label: const Text('انضمام الآن',
                      style: TextStyle(fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8)),
                  ),
                ),
              ),
            ],

            // ── مدة المكالمة للمكالمات المنتهية ─────────────
            if (isEndedCall && callDuration != null && callDuration.isNotEmpty) ...[
              const SizedBox(height: 4),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.access_time_rounded, size: 11, color: Colors.grey.shade400),
                  const SizedBox(width: 3),
                  Text(
                    callDuration,
                    style: TextStyle(fontSize: 10, color: Colors.grey.shade400),
                  ),
                ],
              ),
            ],
          ],
        );

      case MessageType.text:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            RichTextWithPreview(msg.content),
            if (msg.content.contains('http')) _buildLinkPreview(msg.content),
          ],
        );
      case MessageType.product:
        return ProductBubble(msg: msg);
      case MessageType.system:
        // رسائل النظام تُعرَض بشكل مركزي
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: _kGold.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: _kGold.withValues(alpha: 0.4)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.info_outline, size: 14, color: _kGold),
              const SizedBox(width: 6),
              Flexible(child: Text(msg.content,
                  style: const TextStyle(fontSize: 12, color: Colors.black54))),
            ],
          ),
        );
      case MessageType.callSystem:
        // أحداث المكالمة الداخلية — لا تُعرض (مُفلترة من القائمة لكن case مطلوب للـ exhaustive switch)
        return const SizedBox.shrink();
    }
  }

  Widget _buildLinkPreview(String url) {
    final bool isShopLink = url.contains('biopara') && !url.contains('biopara.ma');
    
    return Container(
      margin: const EdgeInsets.only(top: 4),
      decoration: BoxDecoration(
        color: _kLinkBg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: isShopLink ? _kGold.withValues(alpha: 0.3) : Colors.transparent),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (isShopLink)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                color: _kGold,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.shopping_bag_outlined, color: Colors.white, size: 12),
                    const SizedBox(width: 4),
                    Text('منتج من المتجر', 
                      style: GoogleFonts.tajawal(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    isShopLink ? 'متجر BioPara الطبيعي' : 'معاينة الرابط',
                    style: GoogleFonts.cairo(
                      fontSize: 12, 
                      fontWeight: FontWeight.bold, 
                      color: _kPrimary
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    url,
                    style: GoogleFonts.tajawal(fontSize: 10, color: _textSecondary),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatus(MessageModel msg) {
    final timeStr = msg.createdAt != null 
        ? DateFormat('HH:mm').format(msg.createdAt!.toLocal()) 
        : '';
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (isStarred) ...[
          const Icon(Icons.star, size: 10, color: Colors.amber),
          const SizedBox(width: 4),
        ],
        Text(timeStr, style: const TextStyle(fontSize: 10, color: _textSecondary)),
        if (msg.senderId == 'me' || isMe) ...[
          const SizedBox(width: 4),
          Icon(
            msg.status == MessageStatus.read ? Icons.done_all : Icons.done,
            size: 14,
            color: msg.status == MessageStatus.read ? Colors.blue : _textSecondary,
          ),
        ],
      ],
    );
  }
}

// ── Audio Active Provider and Widget ──
final _activeAudioUrlProvider = StateProvider<String?>((ref) => null);

class AudioPlayerBubble extends ConsumerStatefulWidget {
  final String url;
  final bool isMe;
  const AudioPlayerBubble({super.key, required this.url, required this.isMe});

  @override
  ConsumerState<AudioPlayerBubble> createState() => _AudioPlayerBubbleState();
}

class _AudioPlayerBubbleState extends ConsumerState<AudioPlayerBubble> {
  final _player = AudioPlayer();
  Duration _pos = Duration.zero;
  Duration _dur = Duration.zero;
  bool _playing = false;
  bool _prepared = false;
  double _speed = 1.0;

  @override
  void initState() {
    super.initState();
    _player.onPositionChanged.listen((p) {
      if (mounted) {
        setState(() => _pos = p);
      }
    });
    _player.onDurationChanged.listen((d) {
      if (mounted) {
        setState(() => _dur = d);
      }
    });
    _player.onPlayerStateChanged.listen((s) {
      if (mounted) {
        setState(() => _playing = s == PlayerState.playing);
      }
    });
    // 🔴 تحميل الـ duration فور إنشاء الـ widget (إصلاح 00:00 bug)
    WidgetsBinding.instance.addPostFrameCallback((_) => _preloadDuration());
  }

  Future<void> _preloadDuration() async {
    try {
      final storage = ref.read(storageServiceProvider);
      final path = storage.extractPath(widget.url);
      final playUrl = path != null
          ? await storage.getSignedUrl(path)
          : widget.url;
      if (!mounted || playUrl.isEmpty) return;
      // نحمّل المصدر فقط - onDurationChanged سيتولى تحديث الـ _dur تلقائياً
      await _player.setSource(UrlSource(playUrl));
      _prepared = true;
    } catch (_) {
      // تجاهل أخطاء تحميل المصدر المسبقة بصمت
    }
  }

  @override
  void dispose() {
    _player.dispose();
    super.dispose();
  }

  String _fmt(Duration d) =>
      '${d.inMinutes.toString().padLeft(2, '0')}:${(d.inSeconds % 60).toString().padLeft(2, '0')}';

  @override
  Widget build(BuildContext context) {
    // Stop this audio if another audio starts playing
    ref.listen<String?>(_activeAudioUrlProvider, (prev, next) {
      if (next != widget.url && _playing) {
        _player.pause();
      }
    });

    final accent = _kGold;  // Gold waveform for BioPara brand
    final progress = _dur.inMilliseconds > 0 
        ? (_pos.inMilliseconds / _dur.inMilliseconds).clamp(0.0, 1.0) 
        : 0.0;

    return Container(
      width: 250,
      padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 8),
      child: Row(
        children: [
          GestureDetector(
            onTap: () async {
              try {
                if (_playing) {
                  await _player.pause();
                } else {
                  // Set active audio
                  ref.read(_activeAudioUrlProvider.notifier).state = widget.url;

                  if (!_prepared) {
                    final storage = ref.read(storageServiceProvider);
                    final path = storage.extractPath(widget.url);
                    final playUrl = path != null
                        ? await storage.getSignedUrl(path)
                        : widget.url;

                    if (playUrl.isNotEmpty) {
                      await _player.setSource(UrlSource(playUrl));
                      _prepared = true;
                    }
                  }
                  await _player.resume();
                  await _player.setPlaybackRate(_speed);
                }
              } catch (e) {
                debugPrint('Audio playback error: $e');
              }
            },
            child: Container(
              width: 40, height: 40,
              decoration: BoxDecoration(
                color: _kPrimary,
                shape: BoxShape.circle,
                boxShadow: [BoxShadow(color: _kPrimary.withValues(alpha: 0.35), blurRadius: 6, offset: const Offset(0,2))],
              ),
              child: Icon(_playing ? Icons.pause_rounded : Icons.play_arrow_rounded, color: Colors.white, size: 22),
            ),
          ),
          const SizedBox(width: 8),
          // Waveform
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                SizedBox(
                  height: 30,
                  width: double.infinity,
                  child: CustomPaint(
                    painter: WaveformPainter(
                      progress: progress,
                      activeColor: accent,
                      inactiveColor: Colors.grey.withValues(alpha: 0.2),
                      seed: widget.url.hashCode,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 2),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(_fmt(_pos), style: GoogleFonts.tajawal(fontSize: 10, color: _textSecondary)),
                      Text(_fmt(_dur), style: GoogleFonts.tajawal(fontSize: 10, color: _textSecondary)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          GestureDetector(
            onTap: () {
              setState(() {
                if (_speed == 1.0) {
                  _speed = 1.5;
                } else if (_speed == 1.5) {
                  _speed = 2.0;
                } else {
                  _speed = 1.0;
                }
              });
              _player.setPlaybackRate(_speed);
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
              decoration: BoxDecoration(
                color: _kPrimary.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: _kPrimary.withValues(alpha: 0.2),
                  width: 1,
                ),
              ),
              child: Text(
                '${_speed.toString().replaceAll('.0', '')}x',
                style: GoogleFonts.tajawal(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: _kPrimary,
                ),
              ),
            ),
          ),
          const SizedBox(width: 8),
          Stack(
            clipBehavior: Clip.none,
            children: [
              CircleAvatar(
                radius: 16,
                backgroundColor: Colors.grey.shade300,
                child: const Icon(Icons.person, color: Colors.white, size: 20),
              ),
              Positioned(
                bottom: -2,
                left: -2,
                child: Container(
                  padding: const EdgeInsets.all(1),
                  decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                  child: Icon(Icons.mic, size: 10, color: accent),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ── Waveform Painter ──
class WaveformPainter extends CustomPainter {
  final double progress;
  final Color activeColor;
  final Color inactiveColor;
  final int seed;

  WaveformPainter({
    required this.progress,
    required this.activeColor,
    required this.inactiveColor,
    required this.seed,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..style = PaintingStyle.fill
      ..strokeCap = StrokeCap.round;

    const barWidth = 3.0;
    const spacing = 3.0;
    final count = (size.width / (barWidth + spacing)).floor();
    
    for (int i = 0; i < count; i++) {
      final x = i * (barWidth + spacing);
      final normalizedX = i / count;
      
      final pseudoRandom = ((i * 13) ^ seed).abs() % 100 / 100.0;
      final hFactor = 0.3 + (0.7 * pseudoRandom);
      final height = size.height * hFactor;
      
      paint.color = normalizedX <= progress ? activeColor : inactiveColor;
      
      final rect = Rect.fromLTWH(
        x, 
        (size.height - height) / 2, 
        barWidth, 
        height
      );
      canvas.drawRRect(
        RRect.fromRectAndRadius(rect, const Radius.circular(5)), 
        paint
      );
    }
  }

  @override
  bool shouldRepaint(WaveformPainter old) => old.progress != progress;
}

// ── Pulsing Dot Widget ──
class PulsingDot extends StatefulWidget {
  const PulsingDot({super.key});
  @override
  State<PulsingDot> createState() => _PulsingDotState();
}

class _PulsingDotState extends State<PulsingDot>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl = AnimationController(
      vsync: this, duration: const Duration(milliseconds: 600))
    ..repeat(reverse: true);

  @override
  void dispose() { 
    _ctrl.dispose(); 
    super.dispose(); 
  }

  @override
  Widget build(BuildContext context) => FadeTransition(
    opacity: _ctrl,
    child: Container(
      width: 12, height: 12,
      decoration: const BoxDecoration(
          color: _kPrimary, shape: BoxShape.circle),
    ),
  );
}

// ── Secure Image Widget ──
class SecureImage extends ConsumerWidget {
  final String url;
  const SecureImage({super.key, required this.url});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final storage = ref.read(storageServiceProvider);
    final path = storage.extractPath(url);
    if (path == null) return _buildImage(context, url);

    return FutureBuilder<String>(
      future: storage.getSignedUrl(path),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const SizedBox(
              width: 220, height: 150,
              child: Center(child: CircularProgressIndicator()));
        }
        if (snapshot.hasError || !snapshot.hasData) {
          return const SizedBox(
              width: 220, height: 120,
              child: Icon(Icons.broken_image, color: Colors.grey, size: 48));
        }
        return _buildImage(context, snapshot.data!);
      },
    );
  }

  Widget _buildImage(BuildContext context, String imageUrl) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => FullScreenImage(url: imageUrl),
          ),
        );
      },
      child: Stack(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: Image.network(
              imageUrl,
              width: 220,
              height: 280,
              fit: BoxFit.cover,
              loadingBuilder: (_, child, prog) => prog == null
                  ? child
                  : const SizedBox(
                      width: 220, height: 150,
                      child: Center(child: CircularProgressIndicator())),
              errorBuilder: (_, _, _) => const SizedBox(
                width: 220, height: 120,
                child: Icon(Icons.broken_image, color: Colors.grey, size: 48)),
            ),
          ),
          // أيقونة تكبير
          Positioned(
            bottom: 6,
            right: 6,
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: Colors.black45,
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Icon(Icons.zoom_in_rounded, color: Colors.white, size: 16),
            ),
          ),
        ],
      ),
    );
  }
}

// ── Full Screen Image Widget ──
class FullScreenImage extends StatelessWidget {
  final String url;
  const FullScreenImage({super.key, required this.url});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.black54,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        title: Text('عرض الصورة',
            style: GoogleFonts.tajawal(color: Colors.white, fontSize: 16)),
        actions: [
          Tooltip(
            message: 'فتح في المتصفح',
            child: IconButton(
              icon: const Icon(Icons.open_in_browser_rounded, color: Colors.white),
              onPressed: () async {
                final uri = Uri.parse(url);
                if (await canLaunchUrl(uri)) {
                  await launchUrl(uri, mode: LaunchMode.externalApplication);
                }
              },
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Center(
        child: InteractiveViewer(
          minScale: 0.5,
          maxScale: 5.0,
          child: Hero(
            tag: url,
            child: Image.network(
              url,
              fit: BoxFit.contain,
              width: MediaQuery.of(context).size.width,
              height: MediaQuery.of(context).size.height,
              loadingBuilder: (_, child, prog) => prog == null
                  ? child
                  : const Center(
                      child: CircularProgressIndicator(color: Colors.white)),
            ),
          ),
        ),
      ),
    );
  }
}

// ── Bubble Tail Painter ──
class BubbleTailPainter extends CustomPainter {
  final Color color;
  final bool isMe;

  BubbleTailPainter({required this.color, required this.isMe});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    final path = Path();
    if (isMe) {
      path.moveTo(0, 0);
      path.lineTo(size.width, 0);
      path.lineTo(0, size.height);
    } else {
      path.moveTo(size.width, 0);
      path.lineTo(0, 0);
      path.lineTo(size.width, size.height);
    }
    path.close();
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// ── Product Bubble Widget ──
class ProductBubble extends StatelessWidget {
  final MessageModel msg;
  const ProductBubble({super.key, required this.msg});

  @override
  Widget build(BuildContext context) {
    final data = msg.metadata;
    return Container(
      width: 220,
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(15)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (data['image_url'] != null)
            ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(15)),
              child: Image.network(data['image_url'], height: 120, width: double.infinity, fit: BoxFit.cover),
            ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(data['name'] ?? 'منتج علاجي', style: GoogleFonts.cairo(fontWeight: FontWeight.bold, fontSize: 14)),
                const SizedBox(height: 4),
                Text('${data['price'] ?? 0} ريال', style: const TextStyle(color: _kPrimary, fontWeight: FontWeight.bold)),
                const SizedBox(height: 10),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _kPrimary,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      padding: EdgeInsets.zero,
                    ),
                    child: Text('طلب الآن', style: GoogleFonts.cairo(fontSize: 12)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── Status Pulse Widget ──
class StatusPulse extends StatefulWidget {
  const StatusPulse({super.key});
  @override
  State<StatusPulse> createState() => _StatusPulseState();
}

class _StatusPulseState extends State<StatusPulse> with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl = AnimationController(
    vsync: this, duration: const Duration(seconds: 2))..repeat();

  @override
  void dispose() { 
    _ctrl.dispose(); 
    super.dispose(); 
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _ctrl,
      builder: (ctx, child) {
        return Container(
          width: 12, height: 12,
          decoration: BoxDecoration(
            color: _kGold,
            shape: BoxShape.circle,
            border: Border.all(color: Colors.white, width: 2),
            boxShadow: [
              BoxShadow(
                color: _kGold.withValues(alpha: 1.0 - _ctrl.value),
                blurRadius: _ctrl.value * 10,
                spreadRadius: _ctrl.value * 5,
              ),
            ],
          ),
        );
      },
    );
  }
}

// ── Rich Text with Preview Widget ──
class RichTextWithPreview extends StatefulWidget {
  final String text;
  const RichTextWithPreview(this.text, {super.key});
  @override
  State<RichTextWithPreview> createState() => _RichTextWithPreviewState();
}

class _RichTextWithPreviewState extends State<RichTextWithPreview> {
  Metadata? _metadata;
  String? _url;
  
  @override
  void initState() {
    super.initState();
    _checkForLink();
  }
  
  void _checkForLink() async {
    final RegExp urlRegExp = RegExp(r'(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-?=%.]+');
    final match = urlRegExp.firstMatch(widget.text);
    if (match != null) {
      String url = match.group(0)!;
      if (!url.startsWith('http')) url = 'https://$url';
      _url = url;
      try {
        final data = await MetadataFetch.extract(url);
        if (mounted && data != null && data.title != null) {
          setState(() => _metadata = data);
        }
      } catch (_) {}
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_metadata == null) {
      return Text(widget.text, style: GoogleFonts.cairo(color: Colors.black87, fontSize: 15, height: 1.4));
    }
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(widget.text, style: GoogleFonts.cairo(color: Colors.black87, fontSize: 15, height: 1.4)),
        const SizedBox(height: 8),
        InkWell(
          onTap: () => launchUrl(Uri.parse(_url!)),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.grey[100],
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey[300]!),
            ),
            clipBehavior: Clip.antiAlias,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                if (_metadata!.image != null)
                  Image.network(_metadata!.image!, height: 120, fit: BoxFit.cover, errorBuilder: (context, error, stackTrace) => const SizedBox.shrink()),
                Padding(
                  padding: const EdgeInsets.all(10),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(_metadata!.title ?? _url!, style: GoogleFonts.cairo(fontWeight: FontWeight.bold, fontSize: 13), maxLines: 1, overflow: TextOverflow.ellipsis),
                      if (_metadata!.description != null) ...[
                        const SizedBox(height: 4),
                        Text(_metadata!.description!, style: GoogleFonts.cairo(fontSize: 11, color: Colors.grey[700]), maxLines: 2, overflow: TextOverflow.ellipsis),
                      ]
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

// ── Video Bubble Widget ──
class VideoBubble extends ConsumerStatefulWidget {
  final String url;
  const VideoBubble({super.key, required this.url});

  @override
  ConsumerState<VideoBubble> createState() => _VideoBubbleState();
}

class _VideoBubbleState extends ConsumerState<VideoBubble> {
  VideoPlayerController? _controller;
  bool _isInitialized = false;

  @override
  void initState() {
    super.initState();
    _initController();
  }

  Future<void> _initController() async {
    try {
      final storage = ref.read(storageServiceProvider);
      final path = storage.extractPath(widget.url);
      final playUrl = path != null ? await storage.getSignedUrl(path) : widget.url;

      _controller = VideoPlayerController.networkUrl(Uri.parse(playUrl));
      await _controller!.initialize();
      if (mounted) {
        setState(() => _isInitialized = true);
      }
    } catch (e) {
      debugPrint('Video init error: $e');
    }
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!_isInitialized) {
      return Container(
        width: 240,
        height: 160,
        decoration: BoxDecoration(
          color: Colors.black12,
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Center(child: CircularProgressIndicator()),
      );
    }

    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: Stack(
        alignment: Alignment.center,
        children: [
          AspectRatio(
            aspectRatio: _controller!.value.aspectRatio,
            child: VideoPlayer(_controller!),
          ),
          GestureDetector(
            onTap: () {
              setState(() {
                _controller!.value.isPlaying ? _controller!.pause() : _controller!.play();
              });
            },
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: const BoxDecoration(
                color: Colors.black26,
                shape: BoxShape.circle,
              ),
              child: Icon(
                _controller!.value.isPlaying ? Icons.pause_rounded : Icons.play_arrow_rounded,
                color: Colors.white,
                size: 32,
              ),
            ),
          ),
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: VideoProgressIndicator(
              _controller!,
              allowScrubbing: true,
              colors: const VideoProgressColors(
                playedColor: Color(0xFFC8963E),
                bufferedColor: Colors.white24,
                backgroundColor: Colors.white10,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
