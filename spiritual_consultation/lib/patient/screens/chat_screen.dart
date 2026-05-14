import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:metadata_fetch/metadata_fetch.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:uuid/uuid.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;
import 'package:file_picker/file_picker.dart';
import 'package:swipe_to/swipe_to.dart';
import 'package:zego_uikit/zego_uikit.dart';
import 'package:zego_uikit_prebuilt_call/zego_uikit_prebuilt_call.dart';
import 'package:audio_waveforms/audio_waveforms.dart' hide PlayerState;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:ui' as ui;
import 'package:record/record.dart';
import 'dart:async';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:audioplayers/audioplayers.dart';
import 'package:intl/intl.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/providers/shop_provider.dart';
import '../../core/models/product_model.dart';
import 'package:video_player/video_player.dart';

import 'call_overlay.dart';
import 'booking_screen.dart';
import 'profile_screen.dart';
import '../../core/services/storage_service.dart';
import '../../core/providers/chat_upload_provider.dart';
import '../../core/providers/chat_provider.dart';
import '../../core/services/offline_queue_service.dart';
import '../../core/providers/presence_provider.dart';
import '../../core/models/message_model.dart';
import '../widgets/bio_para_drawer.dart';
import '../../core/services/ai_service.dart';
import 'package:google_generative_ai/google_generative_ai.dart' as genai;

import '../../core/providers/profile_provider.dart';
// ── BioPara Brand Theme ──────────────────────────────────
const Color _kPrimary    = Color(0xFF3D5A3E); // Deep Olive Green
const Color _kForest     = Color(0xFF2D4A2E); // Forest Green
const Color _kGold       = Color(0xFFC8963E); // Warm Gold/Amber
const Color _kParchment  = Color(0xFFF5F0E8); // Warm Cream/Parchment
const Color _kSage       = Color(0xFF8FAF8F); // Soft Sage Green
const Color _kInputBg    = Color(0xFFFDFAF5); // Input bar background
const Color _kBg         = Color(0xFFF5F0E8); // Same as parchment
const Color _kSender     = Color(0xFF3D5A3E); // Sent bubble: Deep Olive
const Color _kReceiver   = Colors.white;      // Received bubble: white
const Color _kLinkBg     = Color(0xFFECE5D8); // Link preview background
const Color _textSecondary = Color(0xFF6B7B6C); // Secondary text color (Grey-Green)

class ChatScreen extends ConsumerStatefulWidget {
  final String conversationId;
  final String expertName;

  const ChatScreen({
    super.key,
    required this.conversationId,
    this.expertName = 'المستشار Ø§Ù„Ø±ÙˆØ­Ø§Ù†ي',
  });

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final _msgCtrl    = TextEditingController();
  final _scrollCtrl = ScrollController();
  final _supabase   = Supabase.instance.client;
  // Using RecorderController for live waveforms during recording
  RecorderController? _recorderCtrl;
  final _picker     = ImagePicker();
  final _audioRecorder = AudioRecorder();

  String? _userId;
  bool _isRecording = false;
  bool _isUploading = false;
  bool _isTyping    = false;
  Timer? _recTimer;
  int   _recSecs    = 0;
  
  // Attachments State
  List<XFile> _selectedFiles = [];
  
  // New State variables
  bool _isSearching = false;
  String _searchQuery = '';
  MessageModel? _replyToMsg;
  List<String> _starredMessages = [];

  @override
  void initState() {
    super.initState();
    _userId = _supabase.auth.currentUser?.id;
    if (!kIsWeb) {
      _recorderCtrl = RecorderController();
    }
    _loadStarredMessages();
  }

  Future<void> _loadStarredMessages() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _starredMessages = prefs.getStringList('starred_msgs') ?? [];
    });
  }

  Future<void> _toggleStar(String msgId) async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      if (_starredMessages.contains(msgId)) {
        _starredMessages.remove(msgId);
      } else {
        _starredMessages.add(msgId);
      }
    });
    await prefs.setStringList('starred_msgs', _starredMessages);
  }

  bool _isAdmin() {
    final profile = ref.read(profileProvider).value;
    return profile?.isAdmin ?? false;
  }

  @override
  void dispose() {
    _msgCtrl.dispose();
    _scrollCtrl.dispose();
    _recorderCtrl?.dispose();
    _audioRecorder.dispose();
    _recTimer?.cancel();
    super.dispose();
  }



  void _scrollToTop() {
    if (_scrollCtrl.hasClients) {
      _scrollCtrl.animateTo(0,
          duration: const Duration(milliseconds: 300), curve: Curves.easeOut);
    }
  }

  Future<void> _startRecording() async {
    if (kIsWeb) {
      if (await _audioRecorder.hasPermission()) {
        await _audioRecorder.start(const RecordConfig(), path: '');
        _recSecs = 0;
        _recTimer = Timer.periodic(const Duration(seconds: 1), (_) {
          if (mounted) setState(() => _recSecs++);
        });
        setState(() => _isRecording = true);
        ref.read(presenceProvider(widget.conversationId).notifier).updateRecording(true);
      }
      return;
    }
    if (_recorderCtrl == null || !await _recorderCtrl!.checkPermission()) return;
    try {
      String? path;
      if (!kIsWeb) {
        final dir = await getTemporaryDirectory();
        path = p.join(dir.path, 'rec_${DateTime.now().millisecondsSinceEpoch}.m4a');
      }
      await _recorderCtrl!.record(path: path);
      _recSecs = 0;
      _recTimer = Timer.periodic(const Duration(seconds: 1), (_) {
        if (mounted) setState(() => _recSecs++);
      });
      setState(() => _isRecording = true);
      ref.read(presenceProvider(widget.conversationId).notifier).updateRecording(true);
      HapticFeedback.mediumImpact();
    } catch (e) {
      debugPrint('rec start: $e');
    }
  }

  Future<void> _cancelRecording() async {
    _recTimer?.cancel();
    if (kIsWeb) {
      await _audioRecorder.stop();
    } else {
      await _recorderCtrl?.stop();
    }
    setState(() { _isRecording = false; _recSecs = 0; });
    ref.read(presenceProvider(widget.conversationId).notifier).updateRecording(false);
  }

  Future<void> _stopAndSend() async {
    _recTimer?.cancel();
    String? path;
    if (kIsWeb) {
      path = await _audioRecorder.stop();
    } else {
      path = await _recorderCtrl?.stop();
    }
    setState(() { _isRecording = false; _recSecs = 0; });
    ref.read(presenceProvider(widget.conversationId).notifier).updateRecording(false);
    if (path == null) return;
    
    final xfile = XFile(path);
    final bytes = await xfile.readAsBytes();
    final ext = p.extension(path);
    final extension = ext.isEmpty ? '.m4a' : ext;

    final url = await ref
        .read(chatUploadProvider.notifier)
        .uploadBytes(bytes, extension, folder: 'audio');
    if (url != null) {
      _sendMessage(
        type: MessageType.audio, 
        content: url,
        metadata: {'duration': _recSecs},
      );
    }
  }

  Future<void> _pickAndUploadImage() async {
    final f = await _picker.pickImage(source: ImageSource.gallery, imageQuality: 70);
    if (f == null) return;
    setState(() => _selectedFiles.add(f));
  }

  Future<void> _pickAndUploadVideo() async {
    final f = await _picker.pickVideo(source: ImageSource.gallery);
    if (f == null) return;
    setState(() => _selectedFiles.add(f));
  }

  Future<void> _pickAndUploadFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'doc', 'docx'],
      withData: true,
    );

    if (result != null) {
      for (var file in result.files) {
        if (file.path != null) {
          setState(() => _selectedFiles.add(XFile(file.path!)));
        }
      }
    }
  }

  Future<void> _sendMessage({
    MessageType type = MessageType.text,
    String content = '',
    Map<String, dynamic>? metadata,
  }) async {
    // 0. Handle pending attachments if any
    if (_selectedFiles.isNotEmpty && type == MessageType.text) {
      final filesToSend = List<XFile>.from(_selectedFiles);
      setState(() => _selectedFiles = []);
      
      setState(() => _isUploading = true);
      for (var f in filesToSend) {
        final bytes = await f.readAsBytes();
        final ext = p.extension(f.path);
        final extension = ext.isEmpty ? '.jpg' : ext;
        final isImage = ['.jpg', '.jpeg', '.png', '.webp'].contains(extension.toLowerCase());
        final isVideo = ['.mp4', '.mov', '.avi', '.m4v'].contains(extension.toLowerCase());
        
        final folder = isImage ? 'images' : (isVideo ? 'videos' : 'documents');
        final url = await ref
            .read(chatUploadProvider.notifier)
            .uploadBytes(bytes, extension, folder: folder);
            
        if (url != null) {
          MessageType typeToSend = MessageType.document;
          if (isImage) typeToSend = MessageType.image;
          if (isVideo) typeToSend = MessageType.video;

          await _sendMessage(
            type: typeToSend,
            content: url,
            metadata: (isImage || isVideo) ? {} : {'fileName': f.name},
          );
        }
      }
      setState(() => _isUploading = false);
      // If text was empty and we only had files, we are done.
      if (_msgCtrl.text.trim().isEmpty) return;
    }
    final text = type == MessageType.text ? _msgCtrl.text.trim() : content;
    if (text.isEmpty) return;

    if (_userId == null) return;

    // Clear input immediately for text
    if (type == MessageType.text) {
      _msgCtrl.clear();
      setState(() {
        _isTyping = false;
        _selectedFiles = []; // Clear attachments after sending
        ref.read(presenceProvider(widget.conversationId).notifier).updateTyping(false);
      });
    }

    final finalMetadata = metadata ?? {};
    if (_replyToMsg != null) {
      finalMetadata['replyToId'] = _replyToMsg!.id;
      finalMetadata['replyToContent'] = _replyToMsg!.type == MessageType.text ? _replyToMsg!.content : _replyToMsg!.type.name;
      finalMetadata['replyToSender'] = _replyToMsg!.senderId;
      setState(() => _replyToMsg = null);
    }

    try {
      // 1. ØªØ£Ùƒد Ù…Ù† ÙˆØ¬Ùˆد المحادثة أولاً (Ù„ØªÙØ§Ø¯ÙŠ خطأ Foreign Key)
      await _supabase.from('conversations').upsert({
        'id': widget.conversationId,
        'patient_id': _isAdmin() ? widget.conversationId : _userId,
      });

      // 2. إرسال الرسالة
      final payload = {
        'id': const Uuid().v4(),
        'conversation_id': widget.conversationId,
        'sender_id': _supabase.auth.currentUser?.id ?? _userId,
        'content': text,
        'message_type': type.name,
        'metadata': finalMetadata,
      };

      try {
        await _supabase.from('messages').insert(payload);
        _scrollToTop();
      } catch (e) {
        debugPrint('Send error, queuing offline: $e');
        await OfflineQueueService.enqueueMessage(payload);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Ø£Ù†ت غير متصل. تم حفظ الرسالة Ùˆسيتم Ø¥Ø±Ø³Ø§Ù„Ù‡ا لاحقاً.'), backgroundColor: Colors.orange),
          );
        }
      }

      // 3. Auto-reply logic (Gemini AI integration)
      if (!_isAdmin() && type == MessageType.text) {
        _triggerAiResponse(text);
      }
    } catch (e) {
      debugPrint('Outer send error: $e');
    }
  }

  /// استدعاء Ø§Ù„Ø°Ùƒاء Ø§Ù„Ø§ØµØ·Ù†اعي ÙˆØªÙˆليد رد آلي
  Future<void> _triggerAiResponse(String userMessage) async {
    // 1. جلب آخر 5 رسائل للسياق
    final messages = ref.read(chatProvider(widget.conversationId)).take(5).toList();
    final history = messages.reversed.map((m) {
      final isMe = m.senderId == _userId;
      if (isMe) {
        return genai.Content.text(m.content); // Role: user
      } else {
        return genai.Content.model([genai.TextPart(m.content)]); // Role: model
      }
    }).toList();

    // 2. طلب الرد من Gemini
    debugPrint('🤖 Calling Gemini for: $userMessage');
    final aiResponse = await AiService().askChatbot(userMessage, history);
    debugPrint('🤖 Gemini Response: $aiResponse');

    // 3. إرسال رد Ø§Ù„Ø°Ùƒاء Ø§Ù„Ø§ØµØ·Ù†اعي
    final aiPayload = {
      'id': const Uuid().v4(),
      'conversation_id': widget.conversationId,
      'sender_id': 'ai_agent',
      'content': aiResponse,
      'message_type': MessageType.text.name,
      'metadata': {'ai_generated': true},
    };

    try {
      await _supabase.from('messages').insert(aiPayload);
      _scrollToTop();
    } catch (e) {
      debugPrint('AI response insert error: $e');
    }
  }

  void _startCall(bool isVideo, {bool isJoin = false}) {
    // Only send invite if NOT joining an existing call
    if (!isJoin) {
      _sendMessage(
        type: MessageType.callInvite,
        content: isVideo ? 'Ù…Ùƒالمة ÙÙŠØ¯ÙŠÙˆ صادرة' : 'Ù…Ùƒالمة ØµÙˆتية صادرة',
      );
    }

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => CallOverlay(
          name: widget.expertName,
          isVideo: isVideo,
          onEnd: () => Navigator.pop(context),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final uploadState   = ref.watch(chatUploadProvider);
    final isUploadingNow = uploadState is ChatUploadLoading || _isUploading;

    return Scaffold(
      extendBodyBehindAppBar: true,
      backgroundColor: _kBg,
      endDrawer: BioParaDrawer(conversationId: widget.conversationId),
      appBar: _buildAppBar(),
      body: Column(
        children: [
          Expanded(child: _buildStream()),
          _buildInputBar(isUploadingNow),
        ],
      ),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    if (_isSearching) {
      return AppBar(
        backgroundColor: _kPrimary,
        foregroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => setState(() { _isSearching = false; _searchQuery = ''; }),
        ),
        title: TextField(
          autofocus: true,
          style: GoogleFonts.tajawal(color: Colors.white),
          decoration: const InputDecoration(
            hintText: 'ابحث ÙÙŠ المحادثة...',
            hintStyle: TextStyle(color: Colors.white70),
            border: InputBorder.none,
          ),
          onChanged: (val) => setState(() => _searchQuery = val),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(2),
          child: Container(height: 2, color: _kGold.withValues(alpha: 0.6)),
        ),
      );
    }

    final presence = ref.watch(presenceProvider(widget.conversationId));
    String subtitle = 'متصل الآن';
    if (presence.isRecording) {
      subtitle = 'يسجل مقطعاً صوتياً...';
    } else if (presence.isTyping) {
      subtitle = 'ÙŠÙƒتب الآن...';
    }
    final bool isOnline = subtitle == 'متصل الآن';

    return AppBar(
      elevation: 0,
      backgroundColor: Colors.transparent,
      foregroundColor: Colors.white,
      flexibleSpace: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [_kPrimary, _kForest],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: ClipRect(
          child: BackdropFilter(
            filter: ui.ImageFilter.blur(sigmaX: 8, sigmaY: 8),
            child: Container(color: Colors.transparent),
          ),
        ),
      ),
      titleSpacing: 0,
      leadingWidth: 72,
      leading: Builder(
        builder: (context) => Row(
          children: [
            const SizedBox(width: 4),
            IconButton(
              icon: const Icon(Icons.menu_rounded, size: 24),
              onPressed: () => Scaffold.of(context).openEndDrawer(),
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(),
            ),
            Stack(
              children: [
                Container(
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: _kGold, width: 2),
                  ),
                  child: CircleAvatar(
                    radius: 18,
                    backgroundColor: Colors.white,
                    child: Padding(
                      padding: const EdgeInsets.all(4.0),
                      child: Image.asset('assets/images/logo.png', fit: BoxFit.contain),
                    ),
                  ),
                ),
                if (isOnline)
                  const Positioned(right: 0, bottom: 0, child: _StatusPulse()),
              ],
            ),
          ],
        ),
      ),
      title: InkWell(
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ProfileScreen())),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(widget.expertName,
                style: GoogleFonts.cairo(fontSize: 17, fontWeight: FontWeight.bold, color: Colors.white)),
            Text(subtitle,
                style: GoogleFonts.tajawal(fontSize: 12, color: isOnline ? _kGold : Colors.white70)),
          ],
        ),
      ),
      actions: [
        if (!_isSearching) ...[
          IconButton(icon: const Icon(Icons.search_rounded), onPressed: () => setState(() => _isSearching = true)),
          _buildZegoCallButton(isVideo: true),
          _buildZegoCallButton(isVideo: false),
        ],
      ],
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(2),
        child: Container(height: 2, color: _kGold.withValues(alpha: 0.7)),
      ),
    );
  }

  Widget _buildZegoCallButton({required bool isVideo}) {
    // في BioPara، المستخدم يتصل Ø¯Ø§Ø¦Ù…Ø§Ù‹ Ø¨Ø§Ù„Ø£Ø¯Ù…Ù†، ÙˆØ§Ù„Ø£Ø¯Ù…Ù† يتصل بالمستخدم المحدد
    // ملاحظة: "admin_consultant_1" Ù‡Ùˆ معرف Ø§ÙØªØ±Ø§Ø¶ÙŠØŒ ÙÙŠ Ø§Ù„Ø¥Ù†تاج يجب جلب معرف Ø§Ù„Ø£Ø¯Ù…Ù† Ø§Ù„Ø­Ù‚ÙŠÙ‚ي Ù…Ù† Ù‚اعدة Ø§Ù„Ø¨ÙŠØ§Ù†ات
    final targetId = _isAdmin() ? widget.conversationId : "admin_consultant_1";
    final targetName = _isAdmin() ? "المريض" : "المستشار Ø¨ÙŠÙˆبارا";
    
    return ZegoSendCallInvitationButton(
      isVideoCall: isVideo,
      invitees: [
        ZegoUIKitUser(
          id: targetId,
          name: targetName,
        ),
      ],
      resourceID: "biopara_calls", // يجب Ø£Ù† ÙŠØ·Ø§Ø¨Ù‚ المعرف في Zego Console للإشعارات
      iconSize: const Size(40, 40),
      buttonSize: const Size(40, 40),
      onPressed: (String code, String message, List<String> errorInvitees) {
        // تسجيل Ø§Ù„Ù…Ùƒالمة ÙÙŠ Ù‚اعدة Ø¨ÙŠØ§Ù†ات BioPara (Module 4 Hardening)
        _startCall(isVideo);
      },
      icon: ButtonIcon(
        icon: Icon(
          isVideo ? Icons.videocam_rounded : Icons.call_rounded,
          color: Colors.white,
          size: 20,
        ),
      ),
    );
  }


  void _confirmDelete(String id, String? audioUrl) => showDialog(
    context: context,
    builder: (dialogContext) => AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      title: const Text('حذف الرسالة', textAlign: TextAlign.center),
      content: const Text('Ù‡ل Ø£Ù†ت Ù…ØªØ£Ùƒد؟\nلا ÙŠÙ…ÙƒÙ† التراجع.',
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
                  SnackBar(content: Text('ÙØ´Ù„ الحذف: $e'), backgroundColor: Colors.red),
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
    var messages = ref.watch(chatProvider(widget.conversationId));
    
    if (_searchQuery.isNotEmpty) {
      messages = messages.where((m) => m.content.toLowerCase().contains(_searchQuery.toLowerCase())).toList();
    }

    return Stack(
      children: [
        // Clean parchment background — no heavy watermark
        Positioned.fill(child: Container(color: _kParchment)),
        if (messages.isEmpty && _searchQuery.isNotEmpty)
          Center(
            child: Container(
              margin: const EdgeInsets.all(24),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Text(
                'لا ØªÙˆجد Ù†تائج للبحث',
                textAlign: TextAlign.center,
                style: GoogleFonts.cairo(color: _kPrimary, fontWeight: FontWeight.w600, height: 1.6),
              ),
            ),
          )
        else if (messages.isNotEmpty)
          ListView.builder(
          controller: _scrollCtrl,
          reverse: true,
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
          itemCount: messages.length + 1,
          itemBuilder: (_, i) {
            if (i == messages.length) {
              return Container(
                margin: const EdgeInsets.symmetric(vertical: 20, horizontal: 30),
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                decoration: BoxDecoration(
                  color: _kParchment,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: _kGold.withValues(alpha: 0.5)),
                  boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 6, offset: const Offset(0, 2))],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.lock_outline_rounded, size: 15, color: _kGold),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Ù‡Ø°Ù‡ المحادثة مشفرة Ùˆخاصة جداً. لا ÙŠÙ…ÙƒÙ† لأي طرف ثالث الاطلاع Ø¹Ù„ÙŠÙ‡ا.',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.tajawal(fontSize: 12, color: Colors.black54, height: 1.5),
                      ),
                    ),
                  ],
                ),
              ).animate().fadeIn(duration: 500.ms);
            }
            final m  = messages[i];
            final currentUid = _supabase.auth.currentUser?.id;
            final bool me = currentUid != null && m.senderId == currentUid;
            
            // Grouping logic
            bool showTail = false;
            bool isFirstInGroup = false;
            
            // Check message above (older)
            if (i == messages.length - 1) {
              showTail = true;
              isFirstInGroup = true;
            } else {
              final older = messages[i + 1];
              if (m.senderId != older.senderId) {
                showTail = true;
                isFirstInGroup = true;
              }
            }

            bool showDateHeader = false;
            if (i == messages.length - 1) {
              showDateHeader = true;
            } else {
              final prev = messages[i + 1];
              if (m.createdAt != null && prev.createdAt != null) {
                if (m.createdAt!.day != prev.createdAt!.day) {
                  showDateHeader = true;
                  showTail = true; // Always show tail after date header
                }
              }
            }

            return Column(
              children: [
                if (showDateHeader) _buildDateHeader(m.createdAt),
                SwipeTo(
                  onRightSwipe: (details) {
                    setState(() => _replyToMsg = m);
                  },
                  child: _Bubble(
                    msg: m,
                    isMe: me,
                    showTail: showTail,
                    isFirstInGroup: isFirstInGroup,
                    isStarred: _starredMessages.contains(m.id),
                    onStar: () => _toggleStar(m.id),
                    onLongPress: () =>
                        _confirmDelete(m.id, m.type == MessageType.audio ? m.content : null),
                    onJoinCall: () => _startCall(m.content.contains('فيديو'), isJoin: true),
                  ),
                ),
              ],
            ).animate().slideY(begin: 0.1, end: 0, duration: 300.ms, curve: Curves.easeOutQuart).fadeIn(duration: 300.ms);
          },
        ),
      ],
    );
  }

  Widget _buildDateHeader(DateTime? date) {
    if (date == null) return const SizedBox.shrink();
    String label = DateFormat('MMMM d, yyyy').format(date);
    final now = DateTime.now();
    if (date.day == now.day && date.month == now.month && date.year == now.year) {
      label = 'Ø§Ù„ÙŠÙˆم';
    } else if (date.day == now.subtract(const Duration(days: 1)).day) {
      label = 'أمس';
    }

    return Center(
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 14),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
        decoration: BoxDecoration(
          color: _kParchment,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: _kGold.withValues(alpha: 0.6), width: 1.2),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.eco_rounded, size: 13, color: _kGold),
            const SizedBox(width: 6),
            Text(label, style: GoogleFonts.tajawal(fontSize: 11, fontWeight: FontWeight.w600, color: Colors.black45)),
          ],
        ),
      ),
    );
  }

  Widget _buildInputBar(bool busy) {
    if (_isRecording) return _buildRecordingBar();
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (_replyToMsg != null) _buildReplyPreview(),
        if (_selectedFiles.isNotEmpty) _buildAttachmentPreview(),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
          decoration: BoxDecoration(
            color: _kInputBg,
            border: Border(top: BorderSide(color: _kSage.withValues(alpha: 0.4), width: 1)),
          ),
          child: SafeArea(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(26),
                      border: Border.all(color: _kSage.withValues(alpha: 0.5)),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        IconButton(
                          icon: Icon(Icons.add_circle_outline_rounded, color: _kPrimary, size: 26),
                          onPressed: () => _showQuickActions(context),
                        ),
                        Expanded(
                          child: TextField(
                            controller: _msgCtrl,
                            minLines: 1,
                            maxLines: 5,
                            onChanged: (v) {
                              final typing = v.trim().isNotEmpty;
                              if (typing != _isTyping) {
                                setState(() => _isTyping = typing);
                                ref.read(presenceProvider(widget.conversationId).notifier).updateTyping(typing);
                              }
                            },
                            style: GoogleFonts.tajawal(fontSize: 15),
                            textInputAction: TextInputAction.send,
                            onSubmitted: (_) => _sendMessage(),
                            decoration: InputDecoration(
                              hintText: 'Ø§Ùƒتب رسالتك...',
                              hintStyle: GoogleFonts.tajawal(color: Colors.grey.shade400, fontSize: 14, fontStyle: FontStyle.italic),
                              border: InputBorder.none,
                              contentPadding: const EdgeInsets.symmetric(vertical: 12),
                            ),
                          ),
                        ),
                        IconButton(
                          icon: Icon(Icons.attach_file_rounded, color: _kPrimary.withValues(alpha: 0.7), size: 22),
                          onPressed: _pickAndUploadFile,
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                GestureDetector(
                  onLongPress: () {
                    HapticFeedback.heavyImpact();
                    _startRecording();
                  },
                  onTap: () => _isTyping ? _sendMessage() : _startRecording(),
                  child: Container(
                    width: 50, height: 50,
                    margin: const EdgeInsets.only(bottom: 2),
                    decoration: BoxDecoration(
                      color: _kPrimary,
                      shape: BoxShape.circle,
                      boxShadow: [BoxShadow(color: _kPrimary.withValues(alpha: 0.4), blurRadius: 8, offset: const Offset(0, 3))],
                    ),
                    child: busy
                        ? const Center(child: SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)))
                        : Icon(_isTyping ? Icons.send_rounded : Icons.mic_rounded, color: Colors.white, size: 22),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildRecordingBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: const BoxDecoration(color: Colors.white, border: Border(top: BorderSide(color: Color(0xFFEEEEEE)))),
      child: SafeArea(
        child: Row(
          children: [
            const _PulsingDot(),
            const SizedBox(width: 12),
            Text(_fmt(Duration(seconds: _recSecs)), style: GoogleFonts.cairo(color: Colors.redAccent, fontWeight: FontWeight.bold)),
            const SizedBox(width: 12),
            Expanded(
              child: (!kIsWeb && _recorderCtrl != null) ? AudioWaveforms(
                size: const Size(double.infinity, 30),
                recorderController: _recorderCtrl!,
                enableGesture: false,
                waveStyle: WaveStyle(
                  waveColor: Colors.black26,
                  showMiddleLine: false,
                  spacing: 6,
                  extendWaveform: true,
                ),
              ) : Text('جاري التسجيل...', style: GoogleFonts.cairo(color: Colors.black54)),
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
                child: const Icon(Icons.send, color: Colors.white, size: 22),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _fmt(Duration d) =>
      '${d.inMinutes.toString().padLeft(2, '0')}:${(d.inSeconds % 60).toString().padLeft(2, '0')}';

  void _showQuickActions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) => ClipRRect(
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
        child: BackdropFilter(
          filter: ui.ImageFilter.blur(sigmaX: 20, sigmaY: 20),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.88),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
              border: Border.all(color: _kGold.withValues(alpha: 0.3), width: 1),
            ),
            padding: const EdgeInsets.only(top: 12, bottom: 32, left: 24, right: 24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Golden drag handle
                Container(
                  width: 44, height: 4,
                  margin: const EdgeInsets.only(bottom: 20),
                  decoration: BoxDecoration(
                    color: _kGold.withValues(alpha: 0.7),
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
                Text('خيارات سريعة', style: GoogleFonts.cairo(fontSize: 14, fontWeight: FontWeight.bold, color: _kPrimary)),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildActionItem(Icons.camera_alt_rounded, 'ØµÙˆرة', const Color(0xFF795548), () { Navigator.pop(ctx); _pickAndUploadImage(); }),
                    _buildActionItem(Icons.videocam_rounded, 'فيديو', Colors.redAccent, () { Navigator.pop(ctx); _pickAndUploadVideo(); }),
                    _buildActionItem(Icons.calendar_month_rounded, 'حجز جلسة', _kGold, () { Navigator.pop(ctx); Navigator.push(context, MaterialPageRoute(builder: (_) => const BookingScreen())); }),
                    _buildActionItem(Icons.eco_rounded, 'Ù…Ù†تج', _kPrimary, () { Navigator.pop(ctx); _showProductPicker(); }),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildActionItem(IconData icon, String label, Color color, VoidCallback onTap) {
    return Column(
      children: [
        InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(30),
          child: Container(
            padding: const EdgeInsets.all(17),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.12),
              shape: BoxShape.circle,
              border: Border.all(color: color.withValues(alpha: 0.4), width: 1.5),
            ),
            child: Icon(icon, color: color, size: 28),
          ),
        ),
        const SizedBox(height: 10),
        Text(label, style: GoogleFonts.cairo(fontSize: 13, fontWeight: FontWeight.w600, color: Colors.black87)),
      ],
    );
  }

  void _showProductPicker() async {
    final productsAsync = ref.read(productsProvider);
    productsAsync.whenData((prods) {
      showModalBottomSheet(
        context: context,
        builder: (ctx) => ListView.builder(
          itemCount: prods.length,
          itemBuilder: (ctx, i) => ListTile(
            leading: prods[i].imageUrl != null 
              ? CircleAvatar(backgroundImage: NetworkImage(prods[i].imageUrl!))
              : const CircleAvatar(child: Icon(Icons.eco)),
            title: Text(prods[i].name, style: GoogleFonts.cairo()),
            subtitle: Text('${prods[i].price} ريال'),
            onTap: () {
              Navigator.pop(ctx);
              _sendProductMessage(prods[i]);
            },
          ),
        ),
      );
    });
  }

  void _sendProductMessage(Product p) {
    _sendMessage(
      type: MessageType.product,
      content: 'Ù…Ø´Ø§Ø±Ùƒة Ù…Ù†تج: ${p.name}',
      metadata: p.toMap(),
    );
  }

  Widget _buildReplyPreview() => Container(
    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
    decoration: const BoxDecoration(
      color: Colors.white,
      border: Border(top: BorderSide(color: Color(0xFFEEEEEE))),
    ),
    child: Row(
      children: [
        const Icon(Icons.reply, color: _kPrimary, size: 20),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                _replyToMsg!.senderId == _userId ? 'رد Ø¹Ù„Ù‰ Ù†فسك' : 'رد Ø¹Ù„Ù‰ المستشار',
                style: GoogleFonts.cairo(fontWeight: FontWeight.bold, fontSize: 12, color: _kPrimary),
              ),
              Text(
                _replyToMsg!.content,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.cairo(fontSize: 12, color: Colors.grey),
              ),
            ],
          ),
        ),
        IconButton(
          icon: const Icon(Icons.close, size: 18),
          onPressed: () => setState(() => _replyToMsg = null),
        ),
      ],
    ),
  );


  Widget _buildAttachmentPreview() {
    return Container(
      height: 90,
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
      decoration: const BoxDecoration(color: Colors.white, border: Border(bottom: BorderSide(color: Color(0xFFEEEEEE)))),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _selectedFiles.length,
        itemBuilder: (ctx, i) {
          final f = _selectedFiles[i];
          // On Web, blob URLs don't have extensions. We can check if it looks like a blob or has common image extension.
          final isImg = f.path.startsWith('blob:') || 
                        ['.jpg', '.jpeg', '.png', '.webp'].contains(p.extension(f.path).toLowerCase());
          
          return Container(
            margin: const EdgeInsets.only(right: 12),
            width: 70,
            child: Stack(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: Container(
                    color: const Color(0x1A0D6E6E), // _kPrimary with 0.1 opacity
                    child: Center(
                      child: isImg 
                        ? Image.network(
                            f.path, 
                            fit: BoxFit.cover, 
                            width: 70, 
                            height: 70, 
                            errorBuilder: (ctx, err, st) => const Icon(Icons.image, color: _kPrimary),
                          )
                        : const Icon(Icons.description, color: _kPrimary, size: 30),
                    ),
                  ),
                ),
                Positioned(
                  top: -2, right: -2,
                  child: GestureDetector(
                    onTap: () => setState(() => _selectedFiles.removeAt(i)),
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                      child: const Icon(Icons.close, size: 12, color: Colors.white),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

}

class _Bubble extends ConsumerWidget {
  final MessageModel msg;
  final bool isMe;
  final bool showTail;
  final bool isFirstInGroup;
  final bool isStarred;
  final VoidCallback onStar;
  final VoidCallback onLongPress;
  final VoidCallback onJoinCall;

  const _Bubble({
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
              painter: _BubbleTailPainter(color: _kReceiver, isMe: false),
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
                  gradient: isMe ? LinearGradient(
                    colors: [_kSage, const Color(0xFF7A9F7A)],
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
              painter: _BubbleTailPainter(color: _kSender, isMe: true),
            )
          else if (isMe)
            const SizedBox(width: 8),
          ],
        ),
      ),
    );
  }

  Widget _buildReplyInBubble() => Container(
// ... (omitting for brevity in TargetContent if possible, but I need to match the range)
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
        return _SecureImage(url: msg.content);
      
      case MessageType.video:
        return _VideoBubble(url: msg.content);
      
      case MessageType.audio:
        return _AudioPlayer(url: msg.content, isMe: isMe);

      case MessageType.document:
        final fileName = msg.metadata['fileName'] ?? 'Ù…Ø³ØªÙ†د.pdf';
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
                      Text(isMe ? 'Ù…Ùƒالمة صادرة' : 'Ù…Ùƒالمة فائتة',
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
                  label: const Text('Ø§Ù†ضمام الآن',
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
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _RichTextWithPreview(msg.content),
            if (msg.content.contains('http')) _buildLinkPreview(msg.content),
          ],
        );
      case MessageType.product:
        return _ProductBubble(msg: msg);
    }
  }

  // â”€â”€ Ù…Ø­Ø±Ùƒ Ù…Ø¹Ø§ÙŠÙ†ة Ø§Ù„Ø±Ùˆابط (Link Preview Engine) ──
  Widget _buildLinkPreview(String url) {
    final bool isShopLink = url.contains('biopara.ma');
    
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
                    Text('Ù…Ù†تج Ù…Ù† المتجر', 
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
                    isShopLink ? 'متجر BioPara الطبيعي' : 'Ù…Ø¹Ø§ÙŠÙ†ة الرابط',
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
    _player.onPositionChanged.listen((p) { if (mounted) setState(() => _pos = p); });
    _player.onDurationChanged.listen((d) { if (mounted) setState(() => _dur = d); });
    _player.onPlayerStateChanged.listen((s) {
      if (mounted) setState(() => _playing = s == PlayerState.playing);
    });
  }

  @override
  void dispose() { _player.dispose(); super.dispose(); }

  String _fmt(Duration d) =>
      '${d.inMinutes.toString().padLeft(2, '0')}:${(d.inSeconds % 60).toString().padLeft(2, '0')}';

  @override
  Widget build(BuildContext context) {
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
                  if (!_prepared) {
                    final storage = ref.read(storageServiceProvider);
                    final path = storage.extractPath(widget.url);
                    final playUrl = path != null
                        ? await storage.getSignedUrl(path)
                        : widget.url;

                    await _player.setSource(UrlSource(playUrl));
                    _prepared = true;
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
                    painter: _WaveformPainter(
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
      
      // Pseudo-real waveform using deterministic hashing for each file
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
          color: _kPrimary, shape: BoxShape.circle),
    ),
  );
}
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
                  child: Center(child: CircularProgressIndicator())),
          errorBuilder: (_, _, _) => const SizedBox(
            width: 220, height: 120,
            child: Icon(Icons.broken_image, color: Colors.grey, size: 48)),
        ),
      ),
    );
  }
}

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

class _BubbleTailPainter extends CustomPainter {
  final Color color;
  final bool isMe;

  _BubbleTailPainter({required this.color, required this.isMe});

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


class _ProductBubble extends StatelessWidget {
  final MessageModel msg;
  const _ProductBubble({required this.msg});

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
                Text(data['name'] ?? 'Ù…Ù†تج علاجي', style: GoogleFonts.cairo(fontWeight: FontWeight.bold, fontSize: 14)),
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
class _StatusPulse extends StatefulWidget {
  const _StatusPulse();
  @override
  State<_StatusPulse> createState() => _StatusPulseState();
}

class _StatusPulseState extends State<_StatusPulse> with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl = AnimationController(
    vsync: this, duration: const Duration(seconds: 2))..repeat();

  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }

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

class _RichTextWithPreview extends StatefulWidget {
  final String text;
  const _RichTextWithPreview(this.text);
  @override
  State<_RichTextWithPreview> createState() => _RichTextWithPreviewState();
}

class _RichTextWithPreviewState extends State<_RichTextWithPreview> {
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

class _VideoBubble extends ConsumerStatefulWidget {
  final String url;
  const _VideoBubble({required this.url});

  @override
  ConsumerState<_VideoBubble> createState() => _VideoBubbleState();
}

class _VideoBubbleState extends ConsumerState<_VideoBubble> {
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

