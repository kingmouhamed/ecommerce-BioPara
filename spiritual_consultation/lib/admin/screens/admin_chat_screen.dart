// lib/screens/admin_chat_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:uuid/uuid.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import 'package:path/path.dart' as p;
import 'package:audioplayers/audioplayers.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:record/record.dart';
import 'dart:async';
import '../../core/services/ai_service.dart';
import '../../core/providers/chat_upload_provider.dart';
import '../../core/providers/chat_provider.dart';
import '../../core/models/message_model.dart';
import '../../core/services/storage_service.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import '../../core/services/offline_queue_service.dart';
import '../../patient/screens/call_overlay.dart';

const Color _kPrimary  = Color(0xFF2D4A2E);
const Color _kTeal     = Color(0xFF3D5A3E);
const Color _kGold     = Color(0xFFC8963E);
const Color _kBg       = Color(0xFFF5F0E8);

class AdminChatScreen extends ConsumerStatefulWidget {
  final String patientId;
  final String patientName;
  final String? patientAvatar;
  final String conversationId;

  const AdminChatScreen({
    super.key,
    required this.patientId,
    required this.patientName,
    this.patientAvatar,
    required this.conversationId,
  });

  @override
  ConsumerState<AdminChatScreen> createState() => _AdminChatScreenState();
}

class _AdminChatScreenState extends ConsumerState<AdminChatScreen> {
  final _controller   = TextEditingController();
  final _scrollCtrl   = ScrollController();
  final _supabase     = Supabase.instance.client;
  final _picker       = ImagePicker();
  bool _generatingReport = false;
  bool _isUploading      = false;

  final _audioRecorder = AudioRecorder();
  bool _isRecording = false;
  bool _isTyping = false;
  Timer? _recTimer;
  int _recSecs = 0;
  StreamSubscription<List<ConnectivityResult>>? _connectivitySub;
  StreamSubscription<List<Map<String, dynamic>>>? _incomingCallSub;
  final List<String> _processedCallIds = [];

  // ─── تهيئة ─────────────────────────────────────────────────
  @override
  void initState() {
    super.initState();
    _markAllAsRead();
    _controller.addListener(() {
      final typing = _controller.text.trim().isNotEmpty;
      if (typing != _isTyping) {
        setState(() => _isTyping = typing);
      }
    });

    // Sync any pending messages on screen load
    OfflineQueueService.syncQueue();

    // Listen for connection restoration to sync messages
    _connectivitySub = Connectivity().onConnectivityChanged.listen((results) {
      if (results.isNotEmpty && results.first != ConnectivityResult.none) {
        debugPrint('🌐 Admin Chat: Internet restored. Syncing offline messages...');
        OfflineQueueService.syncQueue();
      }
    });

    // Listen for incoming call invitations in real-time
    _incomingCallSub = _supabase
        .from('messages')
        .stream(primaryKey: ['id'])
        .eq('conversation_id', widget.conversationId)
        .listen((messages) {
          if (messages.isNotEmpty) {
            final latestMsg = messages.last; // stream orders by primary key/ascending
            final type = latestMsg['message_type'] as String? ?? 'text';
            final status = latestMsg['status'] as String? ?? 'sent';
            final senderId = latestMsg['sender_id'] as String? ?? '';
            final msgId = latestMsg['id'] as String? ?? '';

            if (type == 'call_invite' && 
                status == 'ringing' && 
                senderId != _supabase.auth.currentUser!.id && 
                !_processedCallIds.contains(msgId)) {
              
              _processedCallIds.add(msgId);
              final content = latestMsg['content'] as String? ?? '';
              final isVideo = content.contains('فيديو') || content.contains('video');

              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => CallOverlay(
                    name: widget.patientName,
                    callId: msgId,
                    conversationId: widget.conversationId,
                    initialMode: CallMode.incoming,
                    isVideo: isVideo,
                  ),
                ),
              );
            }
          }
        });
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollCtrl.dispose();
    _audioRecorder.dispose();
    _recTimer?.cancel();
    _connectivitySub?.cancel();
    _incomingCallSub?.cancel();
    super.dispose();
  }

  // ─── إرسال رسالة نصية ──────────────────────────────────────
  Future<String> _sendMessage({
    String? text,
    String? mediaUrl,
    String type = 'text',
    String? customId,
    String status = 'sent',
  }) async {
    final content = text ?? mediaUrl ?? '';
    final msgId = customId ?? const Uuid().v4();
    if (content.isEmpty) return msgId;
    if (text != null) _controller.clear();

    final payload = {
      'id': msgId,
      'conversation_id': widget.conversationId,
      'sender_id': _supabase.auth.currentUser!.id,
      'content': content,
      'message_type': type,
      'status': status,
    };

    try {
      await _supabase.from('messages').insert(payload);

      // تحديث آخر رسالة في المحادثة
      await _supabase.from('conversations').upsert({
        'id': widget.conversationId,
        'patient_id': widget.patientId,
        'last_message': content,
        'last_message_at': DateTime.now().toIso8601String(),
      });

      _scrollToBottom();
    } catch (e) {
      debugPrint('Admin Chat: Send error, queuing offline: $e');
      await OfflineQueueService.enqueueMessage(payload);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'أنت غير متصل. تم حفظ الرسالة وسيتم إرسالها تلقائياً عند عودة الاتصال.',
              style: GoogleFonts.tajawal(),
            ),
            backgroundColor: Colors.orange,
          ),
        );
      }
    }
    return msgId;
  }

  // ─── تسجيل وإرسال الصوت ──────────────────────────────────────
  Future<void> _startRecording() async {
    try {
      if (await _audioRecorder.hasPermission()) {
        await _audioRecorder.start(const RecordConfig(), path: '');
        _recSecs = 0;
        _recTimer = Timer.periodic(const Duration(seconds: 1), (_) {
          if (mounted) setState(() => _recSecs++);
        });
        setState(() => _isRecording = true);
      }
    } catch (e) {
      debugPrint('rec start error: $e');
    }
  }

  Future<void> _cancelRecording() async {
    _recTimer?.cancel();
    await _audioRecorder.stop();
    setState(() { _isRecording = false; _recSecs = 0; });
  }

  Future<void> _stopAndSend() async {
    _recTimer?.cancel();
    String? path;
    try {
      path = await _audioRecorder.stop();
    } catch (e) {
      debugPrint('rec stop error: $e');
    }
    setState(() { _isRecording = false; _recSecs = 0; });
    if (path == null) return;
    
    final xfile = XFile(path);
    final bytes = await xfile.readAsBytes();
    final extension = '.m4a';

    setState(() => _isUploading = true);
    final url = await ref
        .read(chatUploadProvider.notifier)
        .uploadBytes(bytes, extension, folder: 'audio');
    setState(() => _isUploading = false);
    
    if (url != null) {
      await _sendMessage(
        mediaUrl: url,
        type: 'audio',
      );
    }
  }

  String _fmt(Duration d) =>
      '${d.inMinutes.toString().padLeft(2, '0')}:${(d.inSeconds % 60).toString().padLeft(2, '0')}';

  // ─── إرسال صورة أو ملف ─────────────────────────────────────
  Future<void> _pickAndSendMedia(String type) async {
    setState(() => _isUploading = true);
    try {
      if (type == 'image') {
        final f = await _picker.pickImage(source: ImageSource.gallery, imageQuality: 75);
        if (f == null) return;
        final bytes = await f.readAsBytes();
        final ext   = p.extension(f.path).isEmpty ? '.jpg' : p.extension(f.path);
        final url   = await ref.read(chatUploadProvider.notifier).uploadBytes(bytes, ext, folder: 'images');
        if (url != null) await _sendMessage(mediaUrl: url, type: 'image');
      } else if (type == 'document') {
        final res = await FilePicker.platform.pickFiles(withData: true);
        if (res == null || res.files.isEmpty) return;
        final file = res.files.first;
        final ext  = p.extension(file.name);
        final url  = await ref.read(chatUploadProvider.notifier).uploadBytes(file.bytes!, ext, folder: 'documents');
        if (url != null) await _sendMessage(mediaUrl: url, type: 'document');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('فشل الرفع: $e', style: GoogleFonts.tajawal())),
        );
      }
    } finally {
      if (mounted) setState(() => _isUploading = false);
    }
  }

  // â”€â”€ تحديد الرسائل كـ "مقروءة" ─────────────────────────────
  Future<void> _markAllAsRead() async {
    try {
      await _supabase
          .from('messages')
          .update({'status': 'read'})
          .eq('conversation_id', widget.conversationId)
          .neq('sender_id', _supabase.auth.currentUser!.id);

      // إعادة تعيين عداد غير المقروء في المحادثة
      await _supabase
          .from('conversations')
          .update({'unread_count': 0})
          .eq('id', widget.conversationId);
    } catch (_) {
      // يتم التجاهل حتى يتم تشغيل migrations
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollCtrl.hasClients) {
        _scrollCtrl.animateTo(
          _scrollCtrl.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  // â”€â”€ توليد تقرير Gemini تلقائي ─────────────────────────────
  Future<void> _generateSessionReport() async {
    setState(() => _generatingReport = true);
    try {
      final messages = await _supabase
          .from('messages')
          .select('content, sender_id, message_type, created_at')
          .eq('conversation_id', widget.conversationId)
          .eq('message_type', 'text')
          .order('created_at');

      final adminId = _supabase.auth.currentUser!.id;
      final conversation = (messages as List).map((m) {
        final isAdmin = m['sender_id'] == adminId;
        return '${isAdmin ? "المستشار" : "المريض"}: ${m['content']}';
      }).join('\n');

      final report = await AiService().generatePatientReport(
        conversation,
        patientName: widget.patientName,
      );

      await _supabase.from('conversations').update({
        'patient_report': report,
        'report_generated_at': DateTime.now().toIso8601String(),
      }).eq('id', widget.conversationId);

      if (mounted) _showReportDialog(report);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('خطأ في توليد التقرير: $e',
                style: GoogleFonts.tajawal()),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _generatingReport = false);
    }
  }

  void _startCall(bool isVideo) async {
    final callId = const Uuid().v4();
    
    await _sendMessage(
      customId: callId,
      type: 'call_invite',
      text: isVideo ? 'مكالمة فيديو صادرة' : 'مكالمة صوتية صادرة',
      status: 'ringing',
    );

    if (mounted) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => CallOverlay(
            name: widget.patientName,
            callId: callId,
            conversationId: widget.conversationId,
            initialMode: CallMode.outgoing,
            isVideo: isVideo,
          ),
        ),
      );
    }
  }

  void _showReportDialog(String report) {
    showDialog(
      context: context,
      builder: (_) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.auto_awesome_rounded, color: _kGold),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'تقرير الجلسة — ${widget.patientName}',
                      style: GoogleFonts.cairo(
                          fontWeight: FontWeight.bold, fontSize: 16),
                    ),
                  ),
                ],
              ),
              const Divider(height: 24),
              ConstrainedBox(
                constraints: BoxConstraints(
                  maxHeight: MediaQuery.of(context).size.height * 0.5,
                ),
                child: SingleChildScrollView(
                  child: Text(report,
                      style: GoogleFonts.tajawal(
                          fontSize: 14, height: 1.6)),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: Text('إغلاق', style: GoogleFonts.tajawal()),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _kPrimary,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                    ),
                    icon: const Icon(Icons.check, size: 18),
                    label: Text('تم', style: GoogleFonts.tajawal()),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ── QuickActions ────────────────────────────────────────────
  void _showAttachmentMenu() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40, height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(4),
              ),
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildAttachItem(
                  Icons.image_rounded, 'صورة', const Color(0xFF4CAF50),
                  () { Navigator.pop(context); _pickAndSendMedia('image'); },
                ),
                _buildAttachItem(
                  Icons.description_rounded, 'ملف', const Color(0xFF2196F3),
                  () { Navigator.pop(context); _pickAndSendMedia('document'); },
                ),
                _buildAttachItem(
                  Icons.auto_awesome_rounded, 'تقرير Gemini', _kGold,
                  () { Navigator.pop(context); _generateSessionReport(); },
                ),
              ],
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildAttachItem(
      IconData icon, String label, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.12),
              shape: BoxShape.circle,
              border: Border.all(color: color.withValues(alpha: 0.4)),
            ),
            child: Icon(icon, color: color, size: 26),
          ),
          const SizedBox(height: 8),
          Text(label,
              style: GoogleFonts.tajawal(fontSize: 12, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }

  // ─────────────────────────────────────────────────────────
  @override
  Widget build(BuildContext context) {
    // ✅ استخدام chatProvider المحسّن بدلاً من StreamBuilder المنشأ في build()
    final messages = ref.watch(chatProvider(widget.conversationId));
    final adminId  = _supabase.auth.currentUser?.id ?? '';

    return Scaffold(
      backgroundColor: _kBg,
      appBar: AppBar(
        backgroundColor: _kPrimary,
        foregroundColor: Colors.white,
        elevation: 0,
        titleSpacing: 0,
        leading: Directionality(
          textDirection: TextDirection.ltr,
          child: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        title: Row(
          children: [
            CircleAvatar(
              radius: 18,
              backgroundColor: Colors.white24,
              backgroundImage: widget.patientAvatar != null
                  ? NetworkImage(widget.patientAvatar!)
                  : null,
              child: widget.patientAvatar == null
                  ? Text(
                      widget.patientName.isNotEmpty ? widget.patientName[0] : 'م',
                      style: const TextStyle(color: Colors.white))
                  : null,
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(widget.patientName,
                    style: GoogleFonts.tajawal(
                        color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                Text('مريض BioPara',
                    style: GoogleFonts.tajawal(color: Colors.white70, fontSize: 11)),
              ],
            ),
          ],
        ),
        actions: [
          _generatingReport
              ? const Padding(
                  padding: EdgeInsets.all(14),
                  child: SizedBox(width: 20, height: 20,
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)))
              : IconButton(
                  icon: const Icon(Icons.auto_awesome_rounded),
                  tooltip: 'توليد تقرير Gemini',
                  onPressed: _generateSessionReport),
          IconButton(
            icon: const Icon(Icons.call_rounded),
            tooltip: 'مكالمة صوتية',
            onPressed: () => _startCall(false)),
          IconButton(
            icon: const Icon(Icons.videocam_rounded),
            tooltip: 'مكالمة فيديو',
            onPressed: () => _startCall(true)),
          const SizedBox(width: 4),
        ],
      ),

      body: Column(
        children: [
          // ── قائمة الرسائل بـ chatProvider ─────────────
          Expanded(
            child: messages.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.chat_bubble_outline_rounded,
                          size: 64, color: Color(0x332E7D32)),
                      const SizedBox(height: 16),
                      Text('لا توجد رسائل بعد',
                          style: GoogleFonts.tajawal(color: Colors.grey, fontSize: 16)),
                    ],
                  ),
                )
              : ListView.builder(
                  controller: _scrollCtrl,
                  reverse: true,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  itemCount: messages.length,
                  itemBuilder: (_, i) {
                    final msg = messages[i];
                    final isAdmin = msg.senderId == adminId;
                    final isAi   = msg.isAi || msg.senderId == 'ai_agent';
                    return _MessageBubbleNew(
                      msg: msg,
                      isAdmin: isAdmin,
                      isAi: isAi,
                    );
                  },
                ),
          ),

          // â”€â”€ شريط الكتابة ───────────────────────────────────
          if (_isUploading)
            const LinearProgressIndicator(
              backgroundColor: Color(0xFFE0D8C8),
              color: _kTeal,
            ),

          _isRecording
              ? Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    boxShadow: [
                      BoxShadow(
                        color: Color(0x0A000000),
                        blurRadius: 8,
                        offset: Offset(0, -2),
                      )
                    ],
                  ),
                  child: SafeArea(
                    child: Row(
                      children: [
                        const Icon(Icons.fiber_manual_record, color: Colors.redAccent),
                        const SizedBox(width: 12),
                        Text(
                          _fmt(Duration(seconds: _recSecs)),
                          style: GoogleFonts.cairo(
                            color: Colors.redAccent,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            'جاري تسجيل مقطع صوتي...',
                            textAlign: TextAlign.right,
                            style: GoogleFonts.tajawal(color: Colors.black54),
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.delete_outline, color: Colors.redAccent),
                          onPressed: _cancelRecording,
                        ),
                        const SizedBox(width: 8),
                        GestureDetector(
                          onTap: _stopAndSend,
                          child: Container(
                            width: 48, height: 48,
                            decoration: const BoxDecoration(color: _kPrimary, shape: BoxShape.circle),
                            child: const Icon(Icons.send_rounded, color: Colors.white, size: 22),
                          ),
                        ),
                      ],
                    ),
                  ),
                )
              : Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    boxShadow: [
                      BoxShadow(
                        color: Color(0x0A000000),
                        blurRadius: 8,
                        offset: Offset(0, -2),
                      )
                    ],
                  ),
                  child: SafeArea(
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.add_circle_outline_rounded,
                              color: _kTeal, size: 28),
                          onPressed: _showAttachmentMenu,
                        ),
                        Expanded(
                          child: Container(
                            decoration: BoxDecoration(
                              color: _kBg,
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(
                                  color: const Color(0xFFD4C9B0)),
                            ),
                            child: Focus(
                              onKeyEvent: (node, event) {
                                if (event is KeyDownEvent &&
                                    event.logicalKey == LogicalKeyboardKey.enter) {
                                  if (!HardwareKeyboard.instance.isShiftPressed) {
                                    if (_isTyping) {
                                      _sendMessage(text: _controller.text.trim());
                                    }
                                    return KeyEventResult.handled;
                                  }
                                }
                                return KeyEventResult.ignored;
                              },
                              child: TextField(
                                controller: _controller,
                                textAlign: TextAlign.right,
                                style: GoogleFonts.tajawal(fontSize: 15),
                                minLines: 1,
                                maxLines: 5,
                                textInputAction: TextInputAction.send,
                                onSubmitted: (_) =>
                                    _isTyping ? _sendMessage(text: _controller.text.trim()) : null,
                                decoration: InputDecoration(
                                  hintText: 'اكتب ردك على المريض...',
                                  hintStyle: GoogleFonts.tajawal(
                                      color: Colors.grey.shade400,
                                      fontStyle: FontStyle.italic),
                                  border: InputBorder.none,
                                  contentPadding:
                                      const EdgeInsets.symmetric(
                                          horizontal: 16, vertical: 12),
                                ),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        GestureDetector(
                          onTap: () {
                            if (_isTyping) {
                              _sendMessage(text: _controller.text.trim());
                            } else {
                              _startRecording();
                            }
                          },
                          child: Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: _kPrimary,
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(
                                  color: _kPrimary.withValues(alpha: 0.4),
                                  blurRadius: 8,
                                  offset: const Offset(0, 3),
                                ),
                              ],
                            ),
                            child: Icon(
                              _isTyping ? Icons.send_rounded : Icons.mic_rounded,
                              color: Colors.white,
                              size: 22,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
        ],
      ),
    );
  }
}

// ── فقاعة الرسالة الجديدة (تستخدم MessageModel) ──────────────
class _MessageBubbleNew extends ConsumerWidget {
  final MessageModel msg;
  final bool isAdmin;
  final bool isAi;

  const _MessageBubbleNew({
    required this.msg,
    required this.isAdmin,
    this.isAi = false,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final type    = msg.type.name;
    final content = msg.content;

    // المريض يكون على اليمين، الأدمن والذكاء الاصطناعي على اليسار
    final isPatient = !isAdmin && !isAi;

    return Align(
      alignment: isPatient ? Alignment.centerRight : Alignment.centerLeft,
      child: Column(
        crossAxisAlignment: isPatient ? CrossAxisAlignment.end : CrossAxisAlignment.start,
        children: [
          if (isAi)
            Padding(
              padding: const EdgeInsets.only(bottom: 4, right: 4),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.auto_awesome_rounded, size: 12, color: _kGold),
                  const SizedBox(width: 4),
                  Text('مساعد ذكي BioPara', style: GoogleFonts.tajawal(fontSize: 11, color: _kGold)),
                ],
              ),
            ),
          Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.68),
            decoration: BoxDecoration(
              color: isPatient
                  ? Colors.white
                  : isAi
                      ? _kGold.withValues(alpha: 0.15)
                      : _kPrimary, // admin = green
              borderRadius: BorderRadius.only(
                topLeft: const Radius.circular(18),
                topRight: const Radius.circular(18),
                // ذيل الفقاعة: يمين للمريض، يسار للأدمن
                bottomLeft:  Radius.circular(isPatient ? 18 : 4),
                bottomRight: Radius.circular(isPatient ? 4  : 18),
              ),
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 6, offset: const Offset(0, 2))],
              border: isAi ? Border.all(color: _kGold.withValues(alpha: 0.4), width: 1) : null,
            ),
            child: _buildContent(context, ref, type, content),
          ),
        ],
      ),
    );
  }

  Widget _buildContent(BuildContext context, WidgetRef ref, String type, String content) {
    // ─── صورة ─────────────────────────────────────────────────
    if (type == 'image') {
      return _SecureImage(url: content);
    }

    // ─── ملف صوتي ─────────────────────────────────────────────
    if (type == 'audio') {
      return _AudioPlayer(url: content, isMe: isAdmin);
    }

    // ─── مستند ────────────────────────────────────────────────
    if (type == 'document') {
      return InkWell(
        onTap: () async {
          try {
            final storage = ref.read(storageServiceProvider);
            final path = storage.extractPath(content);
            final launchUrlStr = path != null
                ? await storage.getSignedUrl(path)
                : content;
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
            Icon(Icons.description_rounded,
                color: isAdmin ? Colors.white : _kTeal, size: 26),
            const SizedBox(width: 8),
            Flexible(
              child: Text('مستند مرفق',
                  style: GoogleFonts.tajawal(
                      color: isAdmin ? Colors.white : _kTeal,
                      decoration: TextDecoration.underline)),
            ),
          ],
        ),
      );
    }

    // ─── دعوة مكالمة صوتية/فيديو ──────────────────────────────
    if (type == 'call_invite' || content.contains('مكالمة')) {
      final isVideo = content.contains('فيديو') ||
          content.contains('video') ||
          type == 'video_call';
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            isVideo ? Icons.videocam_rounded : Icons.call_rounded,
            color: isAdmin ? Colors.white : _kPrimary,
            size: 20,
          ),
          const SizedBox(width: 6),
          Text(
            isVideo ? 'مكالمة فيديو' : 'مكالمة صوتية',
            style: GoogleFonts.tajawal(
              color: isAdmin ? Colors.white : _kPrimary,
              fontSize: 13,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      );
    }

    // ─── رابط ملف (audio/video URL خام) ───────────────────────
    if (content.startsWith('https://') &&
        (content.endsWith('.m4a') ||
            content.endsWith('.mp3') ||
            content.endsWith('.aac') ||
            content.endsWith('.ogg'))) {
      return _AudioPlayer(url: content, isMe: isAdmin);
    }

    // ─── نص عادي ──────────────────────────────────────────────
    // المريض → فقاعة بيضاء → نص أسود | الأدمن → فقاعة خضراء → نص أبيض
    final isPatientText = !isAdmin;
    return Text(
      content,
      style: GoogleFonts.tajawal(
        color: isPatientText ? Colors.black87 : Colors.white,
        fontSize: 14,
        height: 1.5,
      ),
      textAlign: isPatientText ? TextAlign.right : TextAlign.left,
    );
  }
}

// ─── مشغل الصوت المخصص للأدمن ──────────────────────────────────
final _activeAudioUrlProvider = StateProvider<String?>((ref) => null);

class _AudioPlayer extends ConsumerStatefulWidget {
  final String url;
  final bool isMe;
  const _AudioPlayer({required this.url, required this.isMe});

  @override
  ConsumerState<_AudioPlayer> createState() => _AudioPlayerState();
}

class _AudioPlayerState extends ConsumerState<_AudioPlayer> {
  final _player = AudioPlayer();
  Duration _pos = Duration.zero;
  Duration _dur = Duration.zero;
  bool _playing = false;
  bool _prepared = false;

  @override
  void initState() {
    super.initState();
    _player.onPositionChanged.listen((p) {
      final dynamic val = p;
      if (val != null && mounted) {
        setState(() => _pos = p);
      }
    });
    _player.onDurationChanged.listen((d) {
      final dynamic val = d;
      if (val != null && mounted) {
        setState(() => _dur = d);
      }
    });
    _player.onPlayerStateChanged.listen((s) {
      final dynamic val = s;
      if (val != null && mounted) {
        setState(() => _playing = s == PlayerState.playing);
      }
    });
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
    // إيقاف تشغيل هذا الأوديو تلقائياً إذا بدأ تشغيل أوديو آخر
    ref.listen<String?>(_activeAudioUrlProvider, (prev, next) {
      if (next != widget.url && _playing) {
        _player.pause();
      }
    });

    final accent = _kGold;
    final progress = _dur.inMilliseconds > 0 
        ? (_pos.inMilliseconds / _dur.inMilliseconds).clamp(0.0, 1.0) 
        : 0.0;
    final isMe = widget.isMe == true;
    final labelColor = isMe ? Colors.white70 : Colors.black54;

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
                  // تعيين هذا الأوديو كالأوديو النشط حالياً لتنبيه باقي المشغلات بالتوقف
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
                }
              } catch (e) {
                debugPrint('Audio playback error: $e');
              }
            },
            child: Container(
              width: 40, height: 40,
              decoration: BoxDecoration(
                color: isMe ? Colors.white : _kPrimary,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: (isMe ? Colors.white : _kPrimary).withValues(alpha: 0.35),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  )
                ],
              ),
              child: Icon(
                _playing ? Icons.pause_rounded : Icons.play_arrow_rounded,
                color: isMe ? _kPrimary : Colors.white,
                size: 22,
              ),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                SizedBox(
                  height: 30,
                  width: double.infinity,
                  child: CustomPaint(
                    painter: _WaveformPainter(
                      progress: progress,
                      activeColor: isMe ? Colors.white : accent,
                      inactiveColor: (isMe ? Colors.white : Colors.grey).withValues(alpha: 0.2),
                      seed: widget.url.hashCode,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 2),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(_fmt(_pos), style: GoogleFonts.tajawal(fontSize: 10, color: labelColor)),
                      Text(_fmt(_dur), style: GoogleFonts.tajawal(fontSize: 10, color: labelColor)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Stack(
            clipBehavior: Clip.none,
            children: [
              CircleAvatar(
                radius: 16,
                backgroundColor: isMe ? Colors.white24 : Colors.grey.shade300,
                child: Icon(Icons.person, color: isMe ? Colors.white : Colors.grey.shade600, size: 20),
              ),
              Positioned(
                bottom: -2,
                left: -2,
                child: Container(
                  padding: const EdgeInsets.all(1),
                  decoration: BoxDecoration(color: isMe ? _kPrimary : Colors.white, shape: BoxShape.circle),
                  child: Icon(Icons.mic, size: 10, color: isMe ? Colors.white : accent),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ─── رسام الموجات الصوتية ─────────────────────────────────────
class _WaveformPainter extends CustomPainter {
  final double progress;
  final Color activeColor;
  final Color inactiveColor;
  final int seed;

  _WaveformPainter({
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

    final barWidth = 3.0;
    final spacing = 3.0;
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
  bool shouldRepaint(_WaveformPainter old) => old.progress != progress;
}

// ─── عرض الصور الآمن ──────────────────────────────────────────
class _SecureImage extends ConsumerWidget {
  final String url;
  const _SecureImage({required this.url});

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
              child: Center(child: CircularProgressIndicator(color: _kTeal)));
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
            builder: (_) => _FullScreenImage(url: imageUrl),
          ),
        );
      },
      child: ClipRRect(
        borderRadius: BorderRadius.circular(10),
        child: Image.network(
          imageUrl,
          width: 220,
          fit: BoxFit.cover,
          loadingBuilder: (_, child, prog) => prog == null
              ? child
              : const SizedBox(
                  width: 220, height: 150,
                  child: Center(child: CircularProgressIndicator(color: _kTeal))),
          errorBuilder: (_, _, _) => const SizedBox(
            width: 220, height: 120,
            child: Icon(Icons.broken_image, color: Colors.grey, size: 48)),
        ),
      ),
    );
  }
}

// ─── عرض الصورة بالحجم الكامل ──────────────────────────────────
class _FullScreenImage extends StatelessWidget {
  final String url;
  const _FullScreenImage({required this.url});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Center(
        child: InteractiveViewer(
          minScale: 0.5,
          maxScale: 4.0,
          child: Hero(
            tag: url,
            child: Image.network(
              url,
              fit: BoxFit.contain,
              width: MediaQuery.of(context).size.width,
              height: MediaQuery.of(context).size.height,
            ),
          ),
        ),
      ),
    );
  }
}