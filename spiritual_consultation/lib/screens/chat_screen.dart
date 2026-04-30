import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:uuid/uuid.dart';
import 'package:image_picker/image_picker.dart';
import 'package:record/record.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;
import 'dart:async';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:intl/intl.dart';
import 'package:google_fonts/google_fonts.dart';

import 'call_screen.dart';
import 'booking_screen.dart';
import 'shop_screen.dart';
import 'profile_screen.dart';
import '../providers/chat_upload_provider.dart';
import '../providers/chat_provider.dart';
import '../providers/profile_provider.dart';
import '../models/message_model.dart';

// ── Theme ────────────────────────────────────────────────
const Color _kPrimary  = Color(0xFF0D6E6E);
const Color _kBg       = Color(0xFFEAEFF2);
const Color _kSender   = Color(0xFFE0F2F1);
const Color _kReceiver = Colors.white;

class ChatScreen extends ConsumerStatefulWidget {
  final String conversationId;
  final String expertName;

  const ChatScreen({
    super.key,
    required this.conversationId,
    this.expertName = 'المستشار الروحاني',
  });

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final _msgCtrl    = TextEditingController();
  final _scrollCtrl = ScrollController();
  final _supabase   = Supabase.instance.client;
  // Using Record() for version 5.x compatibility
  final _recorder   = AudioRecorder();
  final _picker     = ImagePicker();

  String? _userId;
  bool _isRecording = false;
  bool _isUploading = false;
  bool _isTyping    = false;
  Timer? _recTimer;
  int   _recSecs    = 0;

  @override
  void initState() {
    super.initState();
    _userId = _supabase.auth.currentUser?.id;
  }

  @override
  void dispose() {
    _msgCtrl.dispose();
    _scrollCtrl.dispose();
    _recorder.dispose();
    _recTimer?.cancel();
    super.dispose();
  }

  String _fmtSecs(int s) =>
      '${(s ~/ 60).toString().padLeft(2, '0')}:${(s % 60).toString().padLeft(2, '0')}';

  void _scrollToTop() {
    if (_scrollCtrl.hasClients) {
      _scrollCtrl.animateTo(0,
          duration: const Duration(milliseconds: 300), curve: Curves.easeOut);
    }
  }

  Future<void> _startRecording() async {
    if (!await _recorder.hasPermission()) return;
    try {
      String? path;
      if (!kIsWeb) {
        final dir = await getTemporaryDirectory();
        path = p.join(dir.path, 'rec_${DateTime.now().millisecondsSinceEpoch}.m4a');
      }
      // Record 5.x API
      await _recorder.start(const RecordConfig(), path: path ?? '');
      
      _recSecs = 0;
      _recTimer = Timer.periodic(const Duration(seconds: 1), (_) {
        if (mounted) setState(() => _recSecs++);
      });
      setState(() => _isRecording = true);
      HapticFeedback.mediumImpact();
    } catch (e) {
      debugPrint('rec start: $e');
    }
  }

  Future<void> _cancelRecording() async {
    _recTimer?.cancel();
    await _recorder.stop();
    setState(() { _isRecording = false; _recSecs = 0; });
  }

  Future<void> _stopAndSend() async {
    _recTimer?.cancel();
    final path = await _recorder.stop();
    setState(() { _isRecording = false; _recSecs = 0; });
    if (path == null) return;
    
    final xfile = XFile(path);
    final bytes = await xfile.readAsBytes();
    final ext = p.extension(path);
    final extension = ext.isEmpty ? '.m4a' : ext;

    final url = await ref
        .read(chatUploadProvider.notifier)
        .uploadBytes(bytes, extension, folder: 'audio');
    if (url != null) _sendMessage(type: MessageType.audio, content: url);
  }

  Future<void> _pickImage(ImageSource src) async {
    final f = await _picker.pickImage(source: src, imageQuality: 70);
    if (f == null) return;
    setState(() => _isUploading = true);
    
    final bytes = await f.readAsBytes();
    final ext = p.extension(f.path);
    final extension = ext.isEmpty ? '.jpg' : ext;

    final url = await ref
        .read(chatUploadProvider.notifier)
        .uploadBytes(bytes, extension, folder: 'images');
    setState(() => _isUploading = false);
    if (url != null) _sendMessage(type: MessageType.image, content: url);
  }

  Future<void> _sendMessage({
    MessageType type = MessageType.text,
    String content = '',
  }) async {
    final text = type == MessageType.text ? _msgCtrl.text.trim() : content;
    if (text.isEmpty) return;

    if (_userId == null) return;

    // Clear input immediately for text
    if (type == MessageType.text) {
      _msgCtrl.clear();
      setState(() => _isTyping = false);
    }

    try {
      // 1. تأكد من وجود المحادثة أولاً (لتفادي خطأ Foreign Key)
      await _supabase.from('conversations').upsert({
        'id': widget.conversationId,
        'patient_id': _userId,
      });

      // 2. إرسال الرسالة
      await _supabase.from('messages').insert({
        'id': const Uuid().v4(),
        'conversation_id': widget.conversationId,
        'sender_id': _userId,
        'content': text,
        'message_type': type.name,
      });
      
      _scrollToTop();
    } catch (e) {
      debugPrint('Send error: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('فشل الإرسال: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  void _startCall(bool isVideo, {bool isJoin = false}) {
    // Only send invite if NOT joining an existing call
    if (!isJoin) {
      _sendMessage(
        type: MessageType.callInvite,
        content: isVideo ? 'مكالمة فيديو صادرة' : 'مكالمة صوتية صادرة',
      );
    }

    final profile = ref.read(profileProvider).value;
    final myName = profile?.fullName ?? 'مريض';

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => CallScreen(
          callID: widget.conversationId,
          userID: _userId ?? 'unknown',
          userName: myName,
          isVideoCall: isVideo,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final uploadState   = ref.watch(chatUploadProvider);
    final isUploadingNow = uploadState is ChatUploadLoading || _isUploading;

    return Scaffold(
      backgroundColor: _kBg,
      appBar: _buildAppBar(),
      body: Column(
        children: [
          Expanded(child: _buildStream()),
          _buildInputBar(isUploadingNow),
        ],
      ),
    );
  }

  PreferredSizeWidget _buildAppBar() => AppBar(
    backgroundColor: _kPrimary,
    foregroundColor: Colors.white,
    titleSpacing: 0,
    title: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(widget.expertName,
            style: GoogleFonts.tajawal(fontSize: 16, fontWeight: FontWeight.bold)),
        Text('متصل الآن',
            style: GoogleFonts.tajawal(fontSize: 11, color: Colors.white70)),
      ],
    ),
    actions: [
      IconButton(icon: const Icon(Icons.videocam), onPressed: () => _startCall(true)),
      IconButton(icon: const Icon(Icons.call),     onPressed: () => _startCall(false)),
      PopupMenuButton<String>(
        icon: const Icon(Icons.more_vert),
        onSelected: (v) async {
          switch (v) {
            case 'profile':
              Navigator.push(context, MaterialPageRoute(builder: (_) => const ProfileScreen()));
              break;
            case 'shop':
              Navigator.push(context, MaterialPageRoute(builder: (_) => const ShopScreen()));
              break;
            case 'book':
              Navigator.push(context, MaterialPageRoute(builder: (_) => const BookingScreen()));
              break;
            case 'clear':
              _confirmClear();
              break;
            case 'logout':
              await _supabase.auth.signOut();
              if (mounted) Navigator.of(context).popUntil((r) => r.isFirst);
              break;
          }
        },
        itemBuilder: (_) => [
          const PopupMenuItem(value: 'profile', child: Text('الملف الشخصي')),
          const PopupMenuItem(value: 'shop',    child: Text('المتجر')),
          const PopupMenuItem(value: 'book',    child: Text('حجز جلسة')),
          const PopupMenuItem(value: 'clear',   child: Text('مسح المحادثة')),
          const PopupMenuDivider(),
          const PopupMenuItem(
            value: 'logout',
            child: Text('تسجيل الخروج', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    ],
  );

  void _confirmClear() => showDialog(
    context: context,
    builder: (dialogContext) => AlertDialog(
      title: const Text('مسح المحادثة', textAlign: TextAlign.center),
      content: const Text('سيتم حذف كافة الرسائل نهائياً.',
          textAlign: TextAlign.center),
      actions: [
        TextButton(onPressed: () => Navigator.pop(dialogContext), child: const Text('إلغاء')),
        TextButton(
          onPressed: () async {
            Navigator.pop(dialogContext); // Close dialog immediately
            try {
              await ref.read(chatProvider(widget.conversationId).notifier).clearChat();
            } catch (e) {
              if (mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('فشل المسح: $e'), backgroundColor: Colors.red),
                );
              }
            }
          },
          child: const Text('مسح الكل', style: TextStyle(color: Colors.red)),
        ),
      ],
    ),
  );

  void _confirmDelete(String id, String? audioUrl) => showDialog(
    context: context,
    builder: (dialogContext) => AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      title: const Text('حذف الرسالة', textAlign: TextAlign.center),
      content: const Text('هل أنت متأكد؟\nلا يمكن التراجع.',
          textAlign: TextAlign.center),
      actions: [
        TextButton(onPressed: () => Navigator.pop(dialogContext), child: const Text('إلغاء')),
        ElevatedButton(
          style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red, foregroundColor: Colors.white),
          onPressed: () async {
            Navigator.pop(dialogContext); // Close dialog immediately
            try {
              await ref
                  .read(chatProvider(widget.conversationId).notifier)
                  .deleteMessage(id, audioUrl: audioUrl);
            } catch (e) {
              if (mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('فشل الحذف: $e'), backgroundColor: Colors.red),
                );
              }
            }
          },
          child: const Text('حذف'),
        ),
      ],
    ),
  );

  Widget _buildStream() {
    final messages = ref.watch(chatProvider(widget.conversationId));
    if (messages.isEmpty) {
      return Center(
        child: Container(
          margin: const EdgeInsets.all(24),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Text(
            'الاستشارة محمية وسرية بالكامل.\nيمكنك البدء بالتحدث الآن.',
            textAlign: TextAlign.center,
            style: GoogleFonts.tajawal(color: _kPrimary, fontWeight: FontWeight.w600, height: 1.6),
          ),
        ),
      );
    }
    return ListView.builder(
      controller: _scrollCtrl,
      reverse: true,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
      itemCount: messages.length,
      itemBuilder: (_, i) {
        final m  = messages[i];
        final me = m.senderId == _userId;
        return _Bubble(
          msg: m,
          isMe: me,
          onLongPress: () =>
              _confirmDelete(m.id, m.type == MessageType.audio ? m.content : null),
          onJoinCall: () => _startCall(m.content.contains('فيديو'), isJoin: true),
        );
      },
    );
  }

  Widget _buildInputBar(bool busy) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(8, 4, 8, 8),
        child: _isRecording ? _buildRecBar() : _buildIdleBar(busy),
      ),
    );
  }

  Widget _buildRecBar() => Row(
    children: [
      GestureDetector(
        onTap: _stopAndSend,
        child: const CircleAvatar(
            radius: 24, backgroundColor: _kPrimary, child: Icon(Icons.send, color: Colors.white)),
      ),
      const SizedBox(width: 8),
      Expanded(
        child: Container(
          height: 48,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
              color: Colors.white, borderRadius: BorderRadius.circular(24)),
          child: Row(
            children: [
              const _PulsingDot(),
              const SizedBox(width: 10),
              Text(_fmtSecs(_recSecs),
                  style: const TextStyle(
                      color: Colors.redAccent, fontWeight: FontWeight.bold)),
              const Spacer(),
              const Text('جاري التسجيل…',
                  style: TextStyle(color: Colors.grey, fontSize: 13)),
            ],
          ),
        ),
      ),
      const SizedBox(width: 8),
      GestureDetector(
        onTap: _cancelRecording,
        child: const CircleAvatar(
            radius: 24,
            backgroundColor: Colors.redAccent,
            child: Icon(Icons.delete, color: Colors.white)),
      ),
    ],
  );

  Widget _buildIdleBar(bool busy) => Row(
    crossAxisAlignment: CrossAxisAlignment.end,
    children: [
      Expanded(
        child: Container(
          decoration: BoxDecoration(
              color: Colors.white, borderRadius: BorderRadius.circular(24)),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              IconButton(
                icon: const Icon(Icons.attach_file, color: Colors.grey),
                onPressed: () => _pickImage(ImageSource.gallery),
              ),
              Expanded(
                child: TextField(
                  controller: _msgCtrl,
                  minLines: 1,
                  maxLines: 5,
                  textInputAction: TextInputAction.send,
                  onSubmitted: (_) => _sendMessage(),
                  decoration: const InputDecoration(
                    hintText: 'اكتب رسالتك…',
                    hintStyle: TextStyle(color: Colors.grey),
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.symmetric(vertical: 14),
                  ),
                  onChanged: (t) => setState(() => _isTyping = t.trim().isNotEmpty),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.camera_alt, color: Colors.grey),
                onPressed: () => _pickImage(ImageSource.camera),
              ),
            ],
          ),
        ),
      ),
      const SizedBox(width: 8),
      GestureDetector(
        onTap: () => _isTyping ? _sendMessage() : _startRecording(),
        child: CircleAvatar(
          radius: 24,
          backgroundColor: _kPrimary,
          child: busy
              ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                      color: Colors.white, strokeWidth: 2))
              : Icon(_isTyping ? Icons.send : Icons.mic, color: Colors.white),
        ),
      ),
    ],
  );
}

class _Bubble extends StatelessWidget {
  final MessageModel msg;
  final bool isMe;
  final VoidCallback onLongPress;
  final VoidCallback onJoinCall;

  const _Bubble({
    required this.msg,
    required this.isMe,
    required this.onLongPress,
    required this.onJoinCall,
  });

  @override
  Widget build(BuildContext context) {
    final time = msg.createdAt != null
        ? DateFormat('h:mm a').format(msg.createdAt!.toLocal())
        : '';

    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: GestureDetector(
        onLongPress: onLongPress,
        child: Container(
          margin: const EdgeInsets.only(bottom: 6),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          constraints: const BoxConstraints(maxWidth: 300),
          decoration: BoxDecoration(
            color: isMe ? _kSender : _kReceiver,
            border: msg.type == MessageType.audio 
                ? Border.all(color: _kPrimary.withValues(alpha: 0.1), width: 1)
                : null,
            borderRadius: BorderRadius.only(
              topLeft: const Radius.circular(18),
              topRight: const Radius.circular(18),
              bottomLeft: Radius.circular(isMe ? 18 : 0),
              bottomRight: Radius.circular(isMe ? 0 : 18),
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.06),
                blurRadius: 4, offset: const Offset(0, 2)),
            ],
          ),
          child: Column(
            crossAxisAlignment:
                isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildBubbleContent(),
              const SizedBox(height: 4),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(time,
                      style: const TextStyle(
                          fontSize: 10, color: Colors.grey)),
                  if (isMe) ...[
                    const SizedBox(width: 4),
                    const Icon(Icons.done_all, size: 13, color: Colors.blue),
                  ],
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBubbleContent() {
    switch (msg.type) {
      case MessageType.image:
        return ClipRRect(
          borderRadius: BorderRadius.circular(10),
          child: Image.network(
            msg.content,
            width: 220,
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
        );
      
      case MessageType.audio:
        return _AudioPlayer(url: msg.content, isMe: isMe);

      case MessageType.callInvite:
        final accent = isMe ? _kPrimary : Colors.redAccent;
        return Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                CircleAvatar(
                  radius: 18,
                  backgroundColor: accent.withValues(alpha: 0.15),
                  child: Icon(
                    msg.content.contains('فيديو') ? Icons.videocam : Icons.call,
                    color: accent, size: 20),
                ),
                const SizedBox(width: 10),
                Flexible(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(msg.content,
                          style: TextStyle(
                              fontWeight: FontWeight.bold, color: accent)),
                      Text(isMe ? 'مكالمة صادرة' : 'مكالمة فائتة',
                          style: const TextStyle(
                              fontSize: 11, color: Colors.grey)),
                    ],
                  ),
                ),
              ],
            ),
            if (!isMe) ...[
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
          ],
        );

      case MessageType.text:
        return Text(
          msg.content,
          style: const TextStyle(color: Colors.black87, fontSize: 15, height: 1.4),
        );
    }
  }
}

class _AudioPlayer extends StatefulWidget {
  final String url;
  final bool isMe;
  const _AudioPlayer({required this.url, required this.isMe});

  @override
  State<_AudioPlayer> createState() => _AudioPlayerState();
}

class _AudioPlayerState extends State<_AudioPlayer> {
  final _player = AudioPlayer();
  bool _playing = false;
  Duration _dur = Duration.zero;
  Duration _pos = Duration.zero;

  @override
  void initState() {
    super.initState();
    _player.onPlayerStateChanged
        .listen((s) { if (mounted) setState(() => _playing = s == PlayerState.playing); });
    _player.onDurationChanged
        .listen((d) { if (mounted) setState(() => _dur = d); });
    _player.onPositionChanged
        .listen((p) { if (mounted) setState(() => _pos = p); });
  }

  @override
  void dispose() { _player.dispose(); super.dispose(); }

  String _fmt(Duration d) {
    String z(int n) => n.toString().padLeft(2, '0');
    return '${z(d.inMinutes % 60)}:${z(d.inSeconds % 60)}';
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.isMe ? _kPrimary : Colors.grey.shade700;
    return Container(
      width: 220,
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          IconButton(
            icon: Icon(_playing ? Icons.pause_circle_filled : Icons.play_circle_fill,
                color: c, size: 40),
            onPressed: () async {
              try {
                if (_playing) {
                  await _player.pause();
                } else {
                  // تحسين تشغيل الصوت في الويب عن طريق إجبار المشغل على استخدام الـ URL مباشرة
                  await _player.setSource(UrlSource(widget.url));
                  await _player.resume();
                }
              } catch (e) {
                debugPrint('Audio error: $e');
              }
            },
          ),
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                LinearProgressIndicator(
                  value: _dur.inMilliseconds > 0 ? _pos.inMilliseconds / _dur.inMilliseconds : 0,
                  backgroundColor: c.withValues(alpha: 0.1),
                  valueColor: AlwaysStoppedAnimation(c),
                ),
                const SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(_fmt(_pos), style: TextStyle(fontSize: 10, color: c)),
                    Text(_fmt(_dur), style: TextStyle(fontSize: 10, color: c)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
    );
  }
}

class _PulsingDot extends StatefulWidget {
  const _PulsingDot();
  @override
  State<_PulsingDot> createState() => _PulsingDotState();
}

class _PulsingDotState extends State<_PulsingDot>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl = AnimationController(
      vsync: this, duration: const Duration(milliseconds: 600))
    ..repeat(reverse: true);

  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) => FadeTransition(
    opacity: _ctrl,
    child: Container(
      width: 12, height: 12,
      decoration: const BoxDecoration(
          color: Colors.redAccent, shape: BoxShape.circle),
    ),
  );
}
