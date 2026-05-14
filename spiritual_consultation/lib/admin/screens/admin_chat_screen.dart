// lib/screens/admin_chat_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:uuid/uuid.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import 'package:path/path.dart' as p;
import '../../core/services/ai_service.dart';
import '../../core/providers/chat_upload_provider.dart';

const Color _kPrimary  = Color(0xFF2E7D32);
const Color _kTeal     = Color(0xFF0D6E6E);
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

  // â”€â”€ ØªÙ‡يئة ─────────────────────────────────────────────────
  @override
  void initState() {
    super.initState();
    _markAllAsRead();
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollCtrl.dispose();
    super.dispose();
  }

  // â”€â”€ إرسال رسالة Ù†صية ──────────────────────────────────────
  Future<void> _sendMessage({
    String? text,
    String? mediaUrl,
    String type = 'text',
  }) async {
    final content = text ?? mediaUrl ?? '';
    if (content.isEmpty) return;
    if (text != null) _controller.clear();

    await _supabase.from('messages').insert({
      'id': const Uuid().v4(),
      'conversation_id': widget.conversationId,
      'sender_id': _supabase.auth.currentUser!.id,
      'content': content,
      'message_type': type,
      'status': 'sent',
    });

    // تحديث آخر رسالة ÙÙŠ المحادثة
    await _supabase.from('conversations').upsert({
      'id': widget.conversationId,
      'patient_id': widget.patientId,
      'last_message': content,
      'last_message_at': DateTime.now().toIso8601String(),
    });

    _scrollToBottom();
  }

  // â”€â”€ إرسال ØµÙˆرة Ø£Ùˆ ملف ─────────────────────────────────────
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
          SnackBar(content: Text('ÙØ´Ù„ الرفع: $e', style: GoogleFonts.tajawal())),
        );
      }
    } finally {
      if (mounted) setState(() => _isUploading = false);
    }
  }

  // â”€â”€ تحديد الرسائل كـ "Ù…Ù‚Ø±Ùˆءة" ─────────────────────────────
  Future<void> _markAllAsRead() async {
    try {
      await _supabase
          .from('messages')
          .update({'status': 'read'})
          .eq('conversation_id', widget.conversationId)
          .neq('sender_id', _supabase.auth.currentUser!.id);

      // إعادة ØªØ¹ÙŠÙŠÙ† عداد غير Ø§Ù„Ù…Ù‚Ø±Ùˆء ÙÙŠ المحادثة
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

  // â”€â”€ ØªÙˆليد ØªÙ‚رير Gemini تلقائي ─────────────────────────────
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
            content: Text('خطأ ÙÙŠ ØªÙˆليد Ø§Ù„ØªÙ‚رير: $e',
                style: GoogleFonts.tajawal()),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _generatingReport = false);
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
                      'ØªÙ‚رير الجلسة — ${widget.patientName}',
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
                  Icons.image_rounded, 'ØµÙˆرة', const Color(0xFF4CAF50),
                  () { Navigator.pop(context); _pickAndSendMedia('image'); },
                ),
                _buildAttachItem(
                  Icons.description_rounded, 'ملف', const Color(0xFF2196F3),
                  () { Navigator.pop(context); _pickAndSendMedia('document'); },
                ),
                _buildAttachItem(
                  Icons.auto_awesome_rounded, 'ØªÙ‚رير Gemini', _kGold,
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
    final messagesStream = _supabase
        .from('messages')
        .stream(primaryKey: ['id'])
        .eq('conversation_id', widget.conversationId)
        .order('created_at', ascending: false);

    return Scaffold(
      backgroundColor: _kBg,
      appBar: AppBar(
        backgroundColor: _kPrimary,
        foregroundColor: Colors.white,
        elevation: 0,
        titleSpacing: 0,
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
                      widget.patientName.isNotEmpty
                          ? widget.patientName[0]
                          : 'م',
                      style: const TextStyle(color: Colors.white))
                  : null,
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(widget.patientName,
                    style: GoogleFonts.tajawal(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 16)),
                Text('مريض BioPara',
                    style: GoogleFonts.tajawal(
                        color: Colors.white70, fontSize: 11)),
              ],
            ),
          ],
        ),
        actions: [
          // زر ØªÙ‚رير Gemini
          _generatingReport
              ? const Padding(
                  padding: EdgeInsets.all(14),
                  child: SizedBox(
                    width: 20, height: 20,
                    child: CircularProgressIndicator(
                        color: Colors.white, strokeWidth: 2),
                  ),
                )
              : IconButton(
                  icon: const Icon(Icons.auto_awesome_rounded),
                  tooltip: 'ØªÙˆليد ØªÙ‚رير Gemini',
                  onPressed: _generateSessionReport,
                ),
          IconButton(
            icon: const Icon(Icons.call_rounded),
            tooltip: 'Ù…Ùƒالمة ØµÙˆتية',
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.videocam_rounded),
            tooltip: 'Ù…Ùƒالمة فيديو',
            onPressed: () {},
          ),
          const SizedBox(width: 4),
        ],
      ),

      body: Column(
        children: [
          // â”€â”€ Ù‚ائمة الرسائل ─────────────────────────────────
          Expanded(
            child: StreamBuilder<List<Map<String, dynamic>>>(
              stream: messagesStream,
              builder: (ctx, snap) {
                if (snap.connectionState == ConnectionState.waiting) {
                  return const Center(
                    child: CircularProgressIndicator(color: _kTeal),
                  );
                }
                final msgs = snap.data ?? [];
                if (msgs.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.chat_bubble_outline_rounded,
                            size: 64, color: Color(0x332E7D32)),
                        const SizedBox(height: 16),
                        Text('لا ØªÙˆجد رسائل بعد',
                            style: GoogleFonts.tajawal(
                                color: Colors.grey, fontSize: 16)),
                      ],
                    ),
                  );
                }

                WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());

                return ListView.builder(
                  controller: _scrollCtrl,
                  reverse: true,
                  padding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 12),
                  itemCount: msgs.length,
                  itemBuilder: (_, i) {
                    // ✅ reverse=true يعرض Ù…Ù† Ø§Ù„Ø£Ø³Ùل (index 0) للأعلى
                    final msg = msgs[i];
                    final adminId = _supabase.auth.currentUser!.id;
                    final isAdmin = msg['sender_id'] == adminId;
                    final isAi    = msg['sender_id'] == 'ai_agent';
                    return _MessageBubble(
                      message: msg,
                      isAdmin: isAdmin,
                      isAi: isAi,
                    );
                  },
                );
              },
            ),
          ),

          // â”€â”€ شريط Ø§Ù„Ùƒتابة ───────────────────────────────────
          if (_isUploading)
            const LinearProgressIndicator(
              backgroundColor: Color(0xFFE0D8C8),
              color: _kTeal,
            ),

          Container(
            padding: const EdgeInsets.symmetric(
                horizontal: 12, vertical: 8),
            decoration: const BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                    color: Color(0x0A000000),
                    blurRadius: 8,
                    offset: Offset(0, -2))
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
                      child: TextField(
                        controller: _controller,
                        textAlign: TextAlign.right,
                        style: GoogleFonts.tajawal(fontSize: 15),
                        minLines: 1,
                        maxLines: 5,
                        textInputAction: TextInputAction.send,
                        onSubmitted: (_) =>
                            _sendMessage(text: _controller.text.trim()),
                        decoration: InputDecoration(
                          hintText: 'Ø§Ùƒتب Ø±Ø¯Ùƒ Ø¹Ù„Ù‰ المريض...',
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
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: () =>
                        _sendMessage(text: _controller.text.trim()),
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
                      child: const Icon(Icons.send_rounded,
                          color: Colors.white, size: 22),
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

// â”€â”€ ÙÙ‚اعة الرسالة ─────────────────────────────────────────────
class _MessageBubble extends StatelessWidget {
  final Map<String, dynamic> message;
  final bool isAdmin;
  final bool isAi;

  const _MessageBubble({
    required this.message,
    required this.isAdmin,
    this.isAi = false,
  });

  @override
  Widget build(BuildContext context) {
    final type = message['message_type'] as String? ?? 'text';
    final content = message['content'] as String? ?? '';

    // ✅ BUG-CHAT-01: Ø³ÙŠØ§Ù‚ الاستشارة الطبية
    //   المريض (Ù…Ù† يطلب المساعدة) â†’ ÙŠÙ…ÙŠÙ†، أبيض (مثل WhatsApp Ù„Ù„Ù…ÙØ±Ø³Ùل)
    //   الأدمن/المستشار (Ø§Ù„Ù…ÙØ¬ÙŠب) â†’ يسار، أخضر
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
                  Text('مساعد ذكي', style: GoogleFonts.tajawal(fontSize: 11, color: _kGold)),
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
                // ذيل Ø§Ù„ÙÙ‚اعة: ÙŠÙ…ÙŠÙ† للمريض، يسار للأدمن
                bottomLeft:  Radius.circular(isPatient ? 18 : 4),
                bottomRight: Radius.circular(isPatient ? 4  : 18),
              ),
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 6, offset: const Offset(0, 2))],
              border: isAi ? Border.all(color: _kGold.withValues(alpha: 0.4), width: 1) : null,
            ),
            child: _buildContent(type, content),
          ),
        ],
      ),
    );
  }

  Widget _buildContent(String type, String content) {
    // â”€â”€ ØµÙˆرة ─────────────────────────────────────────────────
    if (type == 'image') {
      return ClipRRect(
        borderRadius: BorderRadius.circular(10),
        child: Image.network(
          content,
          width: 220,
          fit: BoxFit.cover,
          loadingBuilder: (_, child, progress) => progress == null
              ? child
              : const SizedBox(
                  width: 220,
                  height: 140,
                  child:
                      Center(child: CircularProgressIndicator(color: _kTeal)),
                ),
          errorBuilder: (ctx, err, st) => const Icon(Icons.broken_image,
              size: 50, color: Colors.grey),
        ),
      );
    }

    // â”€â”€ ملف صوتي ─────────────────────────────────────────────
    if (type == 'audio') {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.play_circle_filled_rounded,
            color: isAdmin ? Colors.white : _kPrimary,
            size: 34,
          ),
          const SizedBox(width: 8),
          Container(
            width: 120,
            height: 4,
            decoration: BoxDecoration(
              color: (isAdmin ? Colors.white : _kPrimary).withValues(alpha: 0.35),
              borderRadius: BorderRadius.circular(4),
            ),
          ),
          const SizedBox(width: 8),
          Icon(
            Icons.mic_rounded,
            color: (isAdmin ? Colors.white : _kPrimary).withValues(alpha: 0.7),
            size: 16,
          ),
        ],
      );
    }

    // â”€â”€ Ù…Ø³ØªÙ†د ────────────────────────────────────────────────
    if (type == 'document') {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.description_rounded,
              color: isAdmin ? Colors.white : _kTeal, size: 26),
          const SizedBox(width: 8),
          Flexible(
            child: Text('Ù…Ø³ØªÙ†د Ù…Ø±Ùق',
                style: GoogleFonts.tajawal(
                    color: isAdmin ? Colors.white : _kTeal,
                    decoration: TextDecoration.underline)),
          ),
        ],
      );
    }

    // â”€â”€ Ø¯Ø¹Ùˆة Ù…Ùƒالمة ØµÙˆتية/فيديو ──────────────────────────────
    if (type == 'call_invite' || content.contains('Ù…Ùƒالمة')) {
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
            isVideo ? 'Ù…Ùƒالمة فيديو' : 'Ù…Ùƒالمة ØµÙˆتية',
            style: GoogleFonts.tajawal(
              color: isAdmin ? Colors.white : _kPrimary,
              fontSize: 13,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      );
    }

    // â”€â”€ رابط ملف (audio/video URL خام) ───────────────────────
    if (content.startsWith('https://') &&
        (content.endsWith('.m4a') ||
            content.endsWith('.mp3') ||
            content.endsWith('.aac') ||
            content.endsWith('.ogg'))) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.play_circle_filled_rounded,
              color: isAdmin ? Colors.white : _kPrimary, size: 34),
          const SizedBox(width: 8),
          Container(
            width: 110,
            height: 4,
            decoration: BoxDecoration(
              color: (isAdmin ? Colors.white : _kPrimary)
                  .withValues(alpha: 0.35),
              borderRadius: BorderRadius.circular(4),
            ),
          ),
          const SizedBox(width: 8),
          Icon(Icons.mic_rounded,
              color: (isAdmin ? Colors.white : _kPrimary)
                  .withValues(alpha: 0.6),
              size: 16),
        ],
      );
    }

    // â”€â”€ Ù†ص عادي ──────────────────────────────────────────────
    // المريض â†’ ÙÙ‚اعة بيضاء â†’ Ù†ص Ø£Ø³Ùˆد | Ø§Ù„Ø£Ø¯Ù…Ù† â†’ ÙÙ‚اعة خضراء â†’ Ù†ص أبيض
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
