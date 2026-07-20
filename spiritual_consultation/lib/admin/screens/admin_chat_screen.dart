// lib/screens/admin_chat_screen.dart

import 'package:flutter/material.dart';

import 'package:flutter/services.dart';

import 'package:intl/intl.dart';

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

import 'package:swipe_to/swipe_to.dart';

import '../../core/providers/presence_provider.dart';
import '../../core/services/zego_call_service.dart';

import '../../patient/widgets/chat/chat_widgets.dart' show VideoBubble, RichTextWithPreview, StatusPulse;



const Color _kPrimary  = Color(0xFF2D4A2E);

// إيموجي التفاعلات السريعة (نفس المستخدمة في شاشة المريض)
const List<String> _kReactions = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

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

  RealtimeChannel? _incomingCallSub;

  final List<String> _processedCallIds = [];

  // ── ميزات واتساب: رد / بحث / نجمة / زر النزول ──
  MessageModel? _replyToMsg;
  bool _isSearching = false;
  String _searchQuery = '';
  final Set<String> _starredMessages = {};
  bool _showScrollToBottom = false;



  // ─── تهيئة ─────────────────────────────────────────────────

  @override

  void initState() {

    super.initState();

    _markAllAsRead();

    _controller.addListener(() {

      final typing = _controller.text.trim().isNotEmpty;

      if (typing != _isTyping) {

        setState(() => _isTyping = typing);

        // بثّ حالة "يكتب الآن..." للمريض عبر Realtime Presence
        ref.read(presenceProvider(widget.conversationId).notifier).updateTyping(typing);

      }

    });

    // إظهار/إخفاء زر النزول لأسفل (القائمة معكوسة: الأسفل = offset 0)
    _scrollCtrl.addListener(() {
      final show = _scrollCtrl.hasClients && _scrollCtrl.offset > 300;
      if (show != _showScrollToBottom) {
        setState(() => _showScrollToBottom = show);
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



    // Listen for incoming call invitations in real-time.
    // على سطح المكتب/Windows يتكفّل المستمع العام (AdminCallListener) بذلك،
    // فنُفعّل هذا المستمع المحلي على الموبايل فقط لتفادي ازدواج CallOverlay.

    if (widget.conversationId.isNotEmpty && ZegoCallService.isSupportedPlatform) {

      _incomingCallSub = _supabase

          .channel('incoming_calls_${widget.conversationId}')

          .onPostgresChanges(

            event: PostgresChangeEvent.insert,

            schema: 'public',

            table: 'messages',

            filter: PostgresChangeFilter(

              type: PostgresChangeFilterType.eq,

              column: 'conversation_id',

              value: widget.conversationId,

            ),

            callback: (payload) {

              final msg = payload.newRecord;

              final type = msg['message_type'] as String? ?? 'text';

              final status = msg['status'] as String? ?? 'sent';

              final senderId = msg['sender_id'] as String? ?? '';

              final msgId = msg['id'] as String? ?? '';



              if ((type == 'call_invite' || type == 'callInvite') && 

                  status == 'ringing' && 

                  senderId != _supabase.auth.currentUser!.id && 

                  !_processedCallIds.contains(msgId)) {

                

                _processedCallIds.add(msgId);

                final content = msg['content'] as String? ?? '';

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

            },

          );

      _incomingCallSub?.subscribe();

    }

  }



  @override

  void dispose() {

    _controller.dispose();

    _scrollCtrl.dispose();

    _audioRecorder.dispose();

    _recTimer?.cancel();

    _connectivitySub?.cancel();

    _incomingCallSub?.unsubscribe();

    super.dispose();

  }



  // ─── إرسال رسالة نصية ──────────────────────────────────────

  Future<String> _sendMessage({

    String? text,

    String? mediaUrl,

    String type = 'text',

    String? customId,

    String status = 'sent',

    Map<String, dynamic>? metadata,

  }) async {

    final content = text ?? mediaUrl ?? '';

    final msgId = customId ?? const Uuid().v4();

    if (content.isEmpty) return msgId;

    if (text != null) _controller.clear();



    // ── دعم الرد (reply) على رسالة ──
    final Map<String, dynamic> finalMetadata = {...?metadata};
    String? replyToId;
    if (_replyToMsg != null) {
      replyToId = _replyToMsg!.id;
      finalMetadata['replyToId'] = _replyToMsg!.id;
      finalMetadata['replyToContent'] = _replyToMsg!.type == MessageType.text
          ? _replyToMsg!.content
          : _replyToMsg!.type.name;
      finalMetadata['replyToSender'] = _replyToMsg!.senderId;
      setState(() => _replyToMsg = null);
    }



    final payload = {

      'id': msgId,

      'conversation_id': widget.conversationId,

      'sender_id': _supabase.auth.currentUser!.id,

      'content': content,

      'message_type': type,

      'status': status,

      'created_at': DateTime.now().toIso8601String(),

      if (finalMetadata.isNotEmpty) 'metadata': finalMetadata,

      'reply_to_id': ?replyToId,

    };



    // إضافة الرسالة محلياً فوراً لتحديث واجهة الآدمن فوراً بالترتيب الصحيح

    final localMsg = MessageModel.fromMap(payload);

    ref.read(chatProvider(widget.conversationId).notifier).addMessageLocal(localMsg);



    try {
      await _supabase.from('messages').insert(payload);

      // تحديث آخر رسالة في المحادثة
      await _supabase.from('conversations').upsert({
        'id': widget.conversationId,
        'patient_id': widget.patientId,
        'last_message': content,
      });
    } catch (e) {
      debugPrint('Error sending message: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('فشل إرسال الرسالة: $e', style: GoogleFonts.tajawal()),
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

        ref.read(presenceProvider(widget.conversationId).notifier).updateRecording(true);

      }

    } catch (e) {

      debugPrint('rec start error: $e');

    }

  }



  Future<void> _cancelRecording() async {

    _recTimer?.cancel();

    await _audioRecorder.stop();

    setState(() { _isRecording = false; _recSecs = 0; });

    ref.read(presenceProvider(widget.conversationId).notifier).updateRecording(false);

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

    ref.read(presenceProvider(widget.conversationId).notifier).updateRecording(false);

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
    try {
      if (type == 'image') {
        final res = await _picker.pickImage(source: ImageSource.gallery);
        if (res == null) return;
        final bytes = await res.readAsBytes();
        final ext  = p.extension(res.path);
        setState(() => _isUploading = true);
        final url  = await ref.read(chatUploadProvider.notifier).uploadBytes(bytes, ext, folder: 'images');
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

          SnackBar(content: Text('فشل الرفع: $e', style: GoogleFonts.tajawal())),

        );

      }

    } finally {

      if (mounted) setState(() => _isUploading = false);

    }

  }



  // ── تحديد الرسائل كـ "مقروءة" ─────────────────────────────

  Future<void> _markAllAsRead() async {

    if (widget.conversationId.isEmpty) return;

    try {

      await _supabase

          .from('messages')

          .update({'status': 'read'})

          .eq('conversation_id', widget.conversationId)

          .neq('sender_id', _supabase.auth.currentUser!.id);



      // إعادة تعيين عداد غير المقروء في المحادثة

      await _supabase

          .from('conversations')

          .update({'unread_count': 0})

          .eq('id', widget.conversationId);

    } catch (_) {

      // يتم التجاهل حتى يتم تشغيل migrations

    }

  }




  // ── توليد تقرير Gemini تلقائي ─────────────────────────────

  Future<void> _generateSessionReport() async {

    if (widget.conversationId.isEmpty) return;

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

            content: Text('خطأ في توليد التقرير: $e',

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

    
    // Build payload with call metadata for proper status tracking
    final payload = {
      'id': callId,
      'conversation_id': widget.conversationId,
      'sender_id': _supabase.auth.currentUser!.id,
      'content': isVideo ? 'مكالمة فيديو صادرة' : 'مكالمة صوتية صادرة',
      'message_type': 'call_invite',
      'status': 'ringing',
      'metadata': {
        'call_id': callId,
        'call_type': isVideo ? 'video' : 'voice',
        'call_status': 'active',
        'call_started_at': DateTime.now().toIso8601String(),
      },
      'created_at': DateTime.now().toIso8601String(),
    };

    // Add locally for immediate UI update
    final localMsg = MessageModel.fromMap(payload);
    ref.read(chatProvider(widget.conversationId).notifier).addMessageLocal(localMsg);

    try {
      await _supabase.from('messages').insert(payload);
    } catch (e) {
      debugPrint('Call invite insert error: $e');
    }

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

    var messages = ref.watch(chatProvider(widget.conversationId));

    final adminId  = _supabase.auth.currentUser?.id ?? '';



    // ── إخفاء رسائل النظام الداخلية والـ UUID القديمة ───────

    final uuidRegex = RegExp(

        r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',

        caseSensitive: false);

    messages = messages.where((m) {

      if (m.type == MessageType.callSystem) return false;

      if (uuidRegex.hasMatch(m.content.trim())) return false;

      // فلترة البحث في المحادثة
      if (_searchQuery.trim().isNotEmpty &&
          !m.content.toLowerCase().contains(_searchQuery.toLowerCase())) {
        return false;
      }

      return true;

    }).toList();



    // ── حالة المريض (يكتب / يسجل / متصل) عبر Presence ──
    final presence = ref.watch(presenceProvider(widget.conversationId));
    String patientSubtitle = 'متصل الآن';
    if (presence.isRecording) {
      patientSubtitle = '🎙 يسجل مقطعاً صوتياً...';
    } else if (presence.isTyping) {
      patientSubtitle = '✍️ يكتب الآن...';
    }
    final bool patientOnline = patientSubtitle == 'متصل الآن';



    return Scaffold(

      backgroundColor: _kBg,

      appBar: AppBar(

        backgroundColor: _kPrimary,

        foregroundColor: Colors.white,

        elevation: 0,

        titleSpacing: 0,

        leading: IconButton(

          icon: const Icon(Icons.arrow_back, color: Colors.white),

          onPressed: () => Navigator.pop(context),

        ),

        title: _isSearching ? _buildSearchField() : Row(

          children: [

            Stack(

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

                if (patientOnline)

                  const Positioned(right: 0, bottom: 0, child: StatusPulse()),

              ],

            ),

            const SizedBox(width: 10),

            Column(

              crossAxisAlignment: CrossAxisAlignment.start,

              children: [

                Text(widget.patientName,

                    style: GoogleFonts.tajawal(

                        color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),

                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: Text(patientSubtitle,
                      key: ValueKey(patientSubtitle),
                      style: GoogleFonts.tajawal(
                          color: presence.isTyping
                              ? _kGold
                              : (patientOnline
                                  ? Colors.greenAccent.shade100
                                  : Colors.white70),
                          fontSize: 11)),
                ),

              ],

            ),

          ],

        ),

        actions: [

          IconButton(
            icon: Icon(_isSearching ? Icons.close_rounded : Icons.search_rounded),
            tooltip: _isSearching ? 'إغلاق البحث' : 'بحث في المحادثة',
            onPressed: () => setState(() {
              _isSearching = !_isSearching;
              if (!_isSearching) _searchQuery = '';
            }),
          ),

          _generatingReport

              ? const Padding(

                  padding: EdgeInsets.all(14),

                  child: SizedBox(width: 20, height: 20,

                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)))

              : IconButton(

                  icon: const Icon(Icons.auto_awesome_rounded),

                  tooltip: 'توليد تقرير Gemini',

                  onPressed: _generateSessionReport),

          // ── أزرار المكالمة ──
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

            child: Stack(

              children: [

            messages.isEmpty

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



                    bool showDateHeader = (i == messages.length - 1);

                    if (i < messages.length - 1) {

                      final older = messages[i + 1];

                      if (msg.createdAt != null && older.createdAt != null &&

                          msg.createdAt!.day != older.createdAt!.day) {

                        showDateHeader = true;

                      }

                    }



                    return Column(

                      mainAxisSize: MainAxisSize.min,

                      children: [

                        if (showDateHeader) _buildDateHeader(msg.createdAt),

                        GestureDetector(

                          onLongPress: () {

                            HapticFeedback.mediumImpact();

                            _showMessageContextMenu(msg, isAdmin);

                          },

                          child: Stack(

                            clipBehavior: Clip.none,

                            children: [

                              SwipeTo(

                                onRightSwipe: (_) => setState(() => _replyToMsg = msg),

                                child: _MessageBubbleNew(

                                  msg: msg,

                                  isAdmin: isAdmin,

                                  isAi: isAi,

                                  isStarred: _starredMessages.contains(msg.id),

                                ),

                              ),

                              if (msg.reactions.isNotEmpty)

                                Positioned(

                                  bottom: -8,

                                  right: isAdmin ? 20 : null,

                                  left: isAdmin ? null : 20,

                                  child: _buildReactionsDisplay(msg),

                                ),

                            ],

                          ),

                        ),

                      ],

                    );

                  },

                ),

                if (_showScrollToBottom)

                  Positioned(

                    bottom: 12,

                    left: 12,

                    child: FloatingActionButton.small(

                      backgroundColor: Colors.white,

                      foregroundColor: _kPrimary,

                      elevation: 3,

                      onPressed: () => _scrollCtrl.animateTo(0,

                          duration: const Duration(milliseconds: 300),

                          curve: Curves.easeOut),

                      child: const Icon(Icons.keyboard_arrow_down_rounded),

                    ),

                  ),

              ],

            ),

          ),



          // â”€â”€ شريط الكتابة ───────────────────────────────────

          if (_isUploading)

            const LinearProgressIndicator(

              backgroundColor: Color(0xFFE0D8C8),

              color: _kTeal,

            ),



          if (_replyToMsg != null) _buildReplyPreview(),



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

                          icon: const Icon(Icons.emoji_emotions_outlined,

                              color: _kGold, size: 26),

                          onPressed: _showEmojiPicker,

                        ),

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



  Widget _buildDateHeader(DateTime? date) {

    if (date == null) return const SizedBox.shrink();

    final now = DateTime.now();

    String label;

    if (date.year == now.year && date.month == now.month && date.day == now.day) {

      label = 'اليوم';

    } else if (date.year == now.year && date.month == now.month && date.day == now.day - 1) {

      label = 'أمس';

    } else {

      label = DateFormat('d MMMM yyyy', 'ar').format(date);

    }



    return Center(

      child: Container(

        margin: const EdgeInsets.symmetric(vertical: 12),

        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),

        decoration: BoxDecoration(

          color: Colors.white.withValues(alpha: 0.85),

          borderRadius: BorderRadius.circular(20),

          border: Border.all(color: _kGold.withValues(alpha: 0.6), width: 1),

          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 4)],

        ),

        child: Row(

          mainAxisSize: MainAxisSize.min,

          children: [

            const Icon(Icons.eco_rounded, size: 12, color: _kGold),

            const SizedBox(width: 6),

            Text(label, style: GoogleFonts.tajawal(

                fontSize: 11, fontWeight: FontWeight.w600, color: Colors.black54)),

          ],

        ),

      ),

    );

  }

  // ── حقل البحث في شريط العنوان ──
  Widget _buildSearchField() {
    return TextField(
      autofocus: true,
      textAlign: TextAlign.right,
      style: GoogleFonts.tajawal(color: Colors.white),
      decoration: const InputDecoration(
        hintText: 'ابحث في المحادثة...',
        hintStyle: TextStyle(color: Colors.white70),
        border: InputBorder.none,
      ),
      onChanged: (val) => setState(() => _searchQuery = val),
    );
  }

  // ── عرض التفاعلات أسفل الفقاعة ──
  Widget _buildReactionsDisplay(MessageModel m) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 4)],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: m.reactions.entries.map((e) {
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 2),
            child: Text('${e.key}${e.value.length > 1 ? ' ${e.value.length}' : ''}',
                style: const TextStyle(fontSize: 13)),
          );
        }).toList(),
      ),
    );
  }

  // ── معاينة الرد فوق شريط الإدخال ──
  Widget _buildReplyPreview() => Container(
    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
    decoration: const BoxDecoration(
      color: Colors.white,
      border: Border(top: BorderSide(color: Color(0xFFD4C9B0))),
    ),
    child: Row(
      children: [
        Container(width: 3, height: 36, color: _kGold,
            margin: const EdgeInsets.only(left: 8)),
        const Icon(Icons.reply_rounded, color: _kPrimary, size: 18),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                _replyToMsg!.senderId == (_supabase.auth.currentUser?.id ?? '')
                    ? 'أنت' : widget.patientName,
                style: GoogleFonts.cairo(fontWeight: FontWeight.bold, fontSize: 12, color: _kGold),
              ),
              Text(
                _replyToMsg!.type == MessageType.text
                    ? _replyToMsg!.content
                    : _replyToMsg!.type.name,
                maxLines: 1, overflow: TextOverflow.ellipsis,
                style: GoogleFonts.tajawal(fontSize: 12, color: Colors.grey),
              ),
            ],
          ),
        ),
        IconButton(
          icon: const Icon(Icons.close_rounded, size: 18, color: Colors.grey),
          onPressed: () => setState(() => _replyToMsg = null),
        ),
      ],
    ),
  );

  // ── لوحة إيموجي سريعة لحقل الإدخال ──
  void _showEmojiPicker() {
    showModalBottomSheet(
      context: context,
      builder: (ctx) => Container(
        height: 200,
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('إيموجي سريع',
                style: GoogleFonts.cairo(fontWeight: FontWeight.bold, color: _kPrimary)),
            const SizedBox(height: 12),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: ['🌿','❤️','😊','🙏','👍','✨','😔','🌙','⭐','🌺','💚','🤲',
                         '😢','🌟','💫','🕊','🌸','🍀'].map((e) =>
                GestureDetector(
                  onTap: () {
                    Navigator.pop(ctx);
                    _controller.text += e;
                    setState(() => _isTyping = true);
                  },
                  child: Text(e, style: const TextStyle(fontSize: 28)),
                ),
              ).toList(),
            ),
          ],
        ),
      ),
    );
  }

  // ── تبديل تنجيم الرسالة ──
  Future<void> _toggleStar(String id) async {
    final isStarred = _starredMessages.contains(id);
    setState(() {
      if (isStarred) {
        _starredMessages.remove(id);
      } else {
        _starredMessages.add(id);
      }
    });
    try {
      await _supabase.from('messages').update({'is_starred': !isStarred}).eq('id', id);
    } catch (e) {
      debugPrint('toggleStar error: $e');
    }
  }

  // ── تأكيد حذف الرسالة للجميع ──
  void _confirmDelete(String id, String? audioUrl) => showDialog(
    context: context,
    builder: (dialogContext) => AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      title: const Text('حذف الرسالة', textAlign: TextAlign.center),
      content: const Text('سيتم حذف الرسالة للجميع.\nهل تريد المتابعة؟',
          textAlign: TextAlign.center),
      actions: [
        TextButton(onPressed: () => Navigator.pop(dialogContext), child: const Text('إلغاء')),
        ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: Colors.red, foregroundColor: Colors.white),
          onPressed: () async {
            Navigator.pop(dialogContext);
            try {
              await ref.read(chatProvider(widget.conversationId).notifier)
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

  Widget _buildContextOption(IconData icon, String label, Color color, VoidCallback onTap) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: color, size: 20),
      ),
      title: Text(label, style: GoogleFonts.tajawal(fontSize: 14, fontWeight: FontWeight.w500)),
      onTap: onTap,
    );
  }

  // ── قائمة السياق عند الضغط المطوّل (رد/نسخ/تفاعل/نجمة/حذف) ──
  void _showMessageContextMenu(MessageModel m, bool isMe) {
    final adminId = _supabase.auth.currentUser?.id ?? '';
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40, height: 4,
              margin: const EdgeInsets.symmetric(vertical: 12),
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(4),
              ),
            ),
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: _kBg,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: _kGold.withValues(alpha: 0.3)),
              ),
              child: Text(
                m.isDeleted
                    ? 'تم حذف هذه الرسالة'
                    : (m.content.length > 60 ? '${m.content.substring(0, 60)}...' : m.content),
                style: GoogleFonts.tajawal(fontSize: 13, color: Colors.black87),
                textAlign: TextAlign.right,
              ),
            ),
            // تفاعلات
            Container(
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: _kReactions.map((emoji) {
                  return GestureDetector(
                    onTap: () {
                      Navigator.pop(ctx);
                      ref.read(chatProvider(widget.conversationId).notifier)
                          .addReaction(m.id, emoji, adminId);
                    },
                    child: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: _kBg,
                        shape: BoxShape.circle,
                        border: Border.all(color: _kGold.withValues(alpha: 0.3)),
                      ),
                      child: Text(emoji, style: const TextStyle(fontSize: 22)),
                    ),
                  );
                }).toList(),
              ),
            ),
            const Divider(height: 1),
            _buildContextOption(Icons.reply_rounded, 'رد', _kPrimary, () {
              Navigator.pop(ctx);
              setState(() => _replyToMsg = m);
            }),
            if (m.type == MessageType.text)
              _buildContextOption(Icons.copy_rounded, 'نسخ', Colors.blueGrey, () {
                Navigator.pop(ctx);
                Clipboard.setData(ClipboardData(text: m.content));
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('تم نسخ الرسالة'), duration: Duration(seconds: 1)),
                );
              }),
            _buildContextOption(
              _starredMessages.contains(m.id) ? Icons.star_rounded : Icons.star_border_rounded,
              _starredMessages.contains(m.id) ? 'إلغاء التنجيم' : 'تنجيم الرسالة',
              _kGold,
              () { Navigator.pop(ctx); _toggleStar(m.id); },
            ),
            if (isMe && !m.isDeleted)
              _buildContextOption(Icons.delete_outline_rounded, 'حذف للجميع', Colors.redAccent, () {
                Navigator.pop(ctx);
                _confirmDelete(m.id, m.type == MessageType.audio ? m.content : null);
              }),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

}



// ── فقاعة الرسالة الجديدة (تستخدم MessageModel) ──────────────

class _MessageBubbleNew extends ConsumerWidget {

  final MessageModel msg;

  final bool isAdmin;

  final bool isAi;

  final bool isStarred;



  const _MessageBubbleNew({

    required this.msg,

    required this.isAdmin,

    this.isAi = false,

    this.isStarred = false,

  });



  @override

  Widget build(BuildContext context, WidgetRef ref) {

    final type    = msg.type.name;

    final content = msg.content;



    // المريض والذكاء الاصطناعي يكونون على اليسار، الأدمن على اليمين (المرسل)

    final isPatient = !isAdmin && !isAi;



    return Align(

      alignment: isAdmin ? Alignment.centerRight : Alignment.centerLeft,

      child: Column(

        crossAxisAlignment: isAdmin ? CrossAxisAlignment.end : CrossAxisAlignment.start,

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

            padding: (type == 'audio' || type == 'image')

                ? const EdgeInsets.symmetric(horizontal: 4, vertical: 6)

                : const EdgeInsets.symmetric(horizontal: 14, vertical: 10),

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

                // ذيل الفقاعة: يمين للأدمن، يسار للمريض

                bottomLeft:  Radius.circular(isAdmin ? 18 : 4),

                bottomRight: Radius.circular(isAdmin ? 4  : 18),

              ),

              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 6, offset: const Offset(0, 2))],

              border: isAi ? Border.all(color: _kGold.withValues(alpha: 0.4), width: 1) : null,

            ),

            child: Stack(

              children: [

                Padding(

                  padding: const EdgeInsets.only(bottom: 12, left: 4, right: 4),

                  child: Column(

                    crossAxisAlignment: isAdmin ? CrossAxisAlignment.end : CrossAxisAlignment.start,

                    mainAxisSize: MainAxisSize.min,

                    children: [

                      if (msg.metadata['replyToContent'] != null)

                        _buildReplyQuote(msg.metadata['replyToContent'].toString()),

                      _buildContent(context, ref, type, content),

                    ],

                  ),

                ),

                if (isStarred)

                  Positioned(

                    top: -2,

                    left: 0,

                    child: Icon(Icons.star_rounded,

                        size: 12, color: isAdmin ? Colors.amberAccent : _kGold),

                  ),

                Positioned(

                  bottom: -2,

                  right: 0,

                  child: _buildStatus(msg, isAdmin),

                ),

              ],

            ),

          ),

        ],

      ),

    );

  }



  Widget _buildReplyQuote(String replyContent) {
    return Container(
      margin: const EdgeInsets.only(bottom: 6),
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      decoration: BoxDecoration(
        color: (isAdmin ? Colors.white : _kPrimary).withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(8),
        border: Border(
          right: BorderSide(color: _kGold, width: 3),
        ),
      ),
      child: Text(
        replyContent,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: GoogleFonts.tajawal(
          fontSize: 12,
          color: isAdmin ? Colors.white70 : Colors.black54,
          fontStyle: FontStyle.italic,
        ),
      ),
    );
  }

  Widget _buildStatus(MessageModel msg, bool isAdmin) {

    final timeStr = msg.createdAt != null

        ? DateFormat('HH:mm').format(msg.createdAt!.toLocal())

        : '';

    final labelColor = isAdmin ? Colors.white70 : Colors.black45;



    return Row(

      mainAxisSize: MainAxisSize.min,

      children: [

        Text(timeStr, style: TextStyle(fontSize: 10, color: labelColor)),

        if (isAdmin) ...[

          const SizedBox(width: 4),

          Icon(

            msg.status == MessageStatus.read ? Icons.done_all : Icons.done,

            size: 14,

            color: msg.status == MessageStatus.read ? Colors.blue : Colors.white70,

          ),

        ],

      ],

    );

  }



  Widget _buildContent(BuildContext context, WidgetRef ref, String type, String content) {

    // ─── صورة ─────────────────────────────────────────────────

    if (type == 'image') {

      return _SecureImage(url: content);

    }



    // ─── فيديو ────────────────────────────────────────────────

    if (type == 'video') {

      return VideoBubble(url: content);

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

    if (type == 'call_invite' || type == 'callInvite' || content.contains('مكالمة')) {

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

    // معاينة الروابط لرسائل المريض الواردة (الفقاعة البيضاء)
    if (isPatientText && content.contains('http')) {

      return RichTextWithPreview(content);

    }

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

  double _speed = 1.0;



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

                  await _player.setPlaybackRate(_speed);

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

                color: (isMe ? Colors.white : _kPrimary).withValues(alpha: 0.15),

                borderRadius: BorderRadius.circular(10),

                border: Border.all(

                  color: isMe ? Colors.white30 : _kPrimary.withValues(alpha: 0.3),

                  width: 1,

                ),

              ),

              child: Text(

                '${_speed.toString().replaceAll('.0', '')}x',

                style: GoogleFonts.tajawal(

                  fontSize: 11,

                  fontWeight: FontWeight.bold,

                  color: isMe ? Colors.white : _kPrimary,

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

                      child: Center(child: CircularProgressIndicator(color: _kTeal))),

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

        backgroundColor: Colors.black54,

        elevation: 0,

        iconTheme: const IconThemeData(color: Colors.white),

        title: Text('صورة المريض',

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

