// lib/patient/screens/chat_screen.dart
// ═══════════════════════════════════════════════════════════
//  BioPara Spiritual — شاشة الدردشة الكاملة
//  ميزات: فقاعات، تفاعلات، رد، مؤشر كتابة، صور، صوت
// ═══════════════════════════════════════════════════════════
import 'package:flutter/material.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:uuid/uuid.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;
import 'package:swipe_to/swipe_to.dart';
import 'package:zego_uikit/zego_uikit.dart';
import 'package:zego_uikit_prebuilt_call/zego_uikit_prebuilt_call.dart';
import 'package:audio_waveforms/audio_waveforms.dart' hide PlayerState;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:record/record.dart';
import 'dart:async';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:intl/intl.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/providers/shop_provider.dart';
import '../../core/services/zego_call_service.dart';

import 'call_overlay.dart';
import 'booking_screen.dart';
import 'profile_screen.dart';
import '../widgets/chat/chat_widgets.dart';
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
const Color _kPrimary    = Color(0xFF3D5A3E);
const Color _kForest     = Color(0xFF2D4A2E);
const Color _kGold       = Color(0xFFC8963E);
const Color _kParchment  = Color(0xFFF5F0E8);
const Color _kSage       = Color(0xFF8FAF8F);
const Color _kInputBg    = Color(0xFFFDFAF5);
const Color _kBg         = Color(0xFFF5F0E8);

// Emoji reactions for BioPara
const _kReactions = ['🌿', '❤️', '😊', '🙏', '👍', '✨'];

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
  RecorderController? _recorderCtrl;
  final _picker     = ImagePicker();
  final _audioRecorder = AudioRecorder();

  String? _userId;
  bool _isRecording = false;
  bool _isUploading = false;
  bool _isTyping    = false;
  Timer? _recTimer;
  int   _recSecs    = 0;

  List<XFile> _selectedFiles = [];
  bool _isSearching = false;
  String _searchQuery = '';
  MessageModel? _replyToMsg;
  List<String> _starredMessages = [];
  StreamSubscription<List<ConnectivityResult>>? _connectivitySub;
  RealtimeChannel? _incomingCallSub;
  final List<String> _processedCallIds = [];

  @override
  void initState() {
    super.initState();
    _userId = _supabase.auth.currentUser?.id;
    if (!kIsWeb) {
      _recorderCtrl = RecorderController();
    }
    _loadStarredMessages();
    OfflineQueueService.syncQueue();

    _connectivitySub = Connectivity().onConnectivityChanged.listen((results) {
      if (results.isNotEmpty && results.first != ConnectivityResult.none) {
        OfflineQueueService.syncQueue();
      }
    });

    // مراقبة مكالمات واردة
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
            final type   = msg['message_type'] as String? ?? 'text';
            final status = msg['status'] as String? ?? 'sent';
            final senderId = msg['sender_id'] as String? ?? '';
            final msgId  = msg['id'] as String? ?? '';

            if ((type == 'call_invite' || type == 'callInvite') &&
                status == 'ringing' &&
                senderId != (_supabase.auth.currentUser?.id ?? _userId) &&
                !_processedCallIds.contains(msgId)) {
              _processedCallIds.add(msgId);
              final content = msg['content'] as String? ?? '';
              final isVideo = content.contains('فيديو') || content.contains('video');
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => CallOverlay(
                    name: widget.expertName,
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

  Future<void> _loadStarredMessages() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() => _starredMessages = prefs.getStringList('starred_msgs') ?? []);
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

  bool _isAdmin() => ref.read(profileProvider).value?.isAdmin ?? false;

  @override
  void dispose() {
    _msgCtrl.dispose();
    _scrollCtrl.dispose();
    _recorderCtrl?.dispose();
    _audioRecorder.dispose();
    _recTimer?.cancel();
    _connectivitySub?.cancel();
    _incomingCallSub?.unsubscribe();
    super.dispose();
  }

  void _scrollToTop() {
    if (_scrollCtrl.hasClients) {
      _scrollCtrl.animateTo(0,
          duration: const Duration(milliseconds: 300), curve: Curves.easeOut);
    }
  }

  // ══════════════════════════════════════════════
  // Recording
  // ══════════════════════════════════════════════
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
      _sendMessage(type: MessageType.audio, content: url, metadata: {'duration': _recSecs});
    }
  }

  // ══════════════════════════════════════════════
  // File Picking
  // ══════════════════════════════════════════════
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

  // ══════════════════════════════════════════════
  // Send Message — الدالة الرئيسية
  // ══════════════════════════════════════════════
  Future<String> _sendMessage({
    MessageType type = MessageType.text,
    String content = '',
    Map<String, dynamic>? metadata,
    String? customId,
    String status = 'sent',
  }) async {
    final msgId = customId ?? const Uuid().v4();

    // معالجة الملفات المُرفقة أولاً
    if (_selectedFiles.isNotEmpty && type == MessageType.text) {
      final filesToSend = List<XFile>.from(_selectedFiles);
      setState(() { _selectedFiles = []; _isUploading = true; });

      for (var f in filesToSend) {
        final bytes = await f.readAsBytes();
        final ext = p.extension(f.path);
        final extension = ext.isEmpty ? '.jpg' : ext;
        final isImage = ['.jpg','.jpeg','.png','.webp'].contains(extension.toLowerCase());
        final isVideo = ['.mp4','.mov','.avi','.m4v'].contains(extension.toLowerCase());
        final folder = isImage ? 'images' : (isVideo ? 'videos' : 'documents');

        final url = await ref
            .read(chatUploadProvider.notifier)
            .uploadBytes(bytes, extension, folder: folder);

        if (url != null) {
          MessageType typeToSend = MessageType.document;
          if (isImage) typeToSend = MessageType.image;
          if (isVideo) typeToSend = MessageType.video;
          await _sendMessage(type: typeToSend, content: url,
              metadata: (isImage || isVideo) ? {} : {'fileName': f.name});
        }
      }
      setState(() => _isUploading = false);
      if (_msgCtrl.text.trim().isEmpty) return msgId;
    }

    final text = type == MessageType.text ? _msgCtrl.text.trim() : content;
    if (text.isEmpty) return msgId;
    if (_userId == null && _supabase.auth.currentUser == null) return msgId;

    if (type == MessageType.text) {
      _msgCtrl.clear();
      setState(() {
        _isTyping = false;
        _selectedFiles = [];
      });
      ref.read(presenceProvider(widget.conversationId).notifier).updateTyping(false);
    }

    final finalMetadata = Map<String, dynamic>.from(metadata ?? {});
    if (_replyToMsg != null) {
      finalMetadata['replyToId'] = _replyToMsg!.id;
      finalMetadata['replyToContent'] = _replyToMsg!.type == MessageType.text
          ? _replyToMsg!.content
          : _replyToMsg!.type.name;
      finalMetadata['replyToSender'] = _replyToMsg!.senderId;
      setState(() => _replyToMsg = null);
    }

    try {
      // 1. تأكد من وجود المحادثة (patient_id = conversationId في BioPara)
      await _supabase.from('conversations').upsert({
        'id': widget.conversationId,
        'patient_id': widget.conversationId,
      }, onConflict: 'id');

      final senderId = _supabase.auth.currentUser?.id ?? _userId ?? widget.conversationId;
      final payload = {
        'id': msgId,
        'conversation_id': widget.conversationId,
        'sender_id': senderId,
        'content': text,
        'message_type': type.name,
        'metadata': finalMetadata,
        'status': status,
        'is_ai': false,
        'created_at': DateTime.now().toIso8601String(),
      };

      // إضافة الرسالة محلياً فوراً لتحديث الواجهة فوراً
      final localMsg = MessageModel.fromMap(payload);
      ref.read(chatProvider(widget.conversationId).notifier).addMessageLocal(localMsg);

      try {
        await _supabase.from('messages').insert(payload);
        _scrollToTop();
      } catch (e) {
        debugPrint('Send error, queuing offline: $e');
        await OfflineQueueService.enqueueMessage(payload);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('أنت غير متصل. تم حفظ الرسالة وسيتم إرسالها لاحقاً.'),
              backgroundColor: Colors.orange,
            ),
          );
        }
      }

      // ذكاء اصطناعي (للمريض فقط)
      if (!_isAdmin() && type == MessageType.text) {
        _triggerAiResponse(text);
      }
    } catch (e) {
      debugPrint('Outer send error: $e');
    }
    return msgId;
  }

  Future<void> _triggerAiResponse(String userMessage) async {
    final messages = ref.read(chatProvider(widget.conversationId)).take(5).toList();
    final history = messages.reversed.map((m) {
      final isMe = m.senderId == _userId;
      return isMe
          ? genai.Content.text(m.content)
          : genai.Content.model([genai.TextPart(m.content)]);
    }).toList();

    debugPrint('🤖 Calling Gemini for: $userMessage');
    final aiResponse = await AiService().askChatbot(userMessage, history);
    debugPrint('🤖 Gemini Response: $aiResponse');

    // إدراج رد الذكاء الاصطناعي — sender_id = auth.uid() وليس 'ai_agent'
    final uid = _supabase.auth.currentUser?.id ?? widget.conversationId;
    final aiPayload = {
      'id': const Uuid().v4(),
      'conversation_id': widget.conversationId,
      'sender_id': uid,  // استخدام uid حقيقي بدل 'ai_agent'
      'content': aiResponse,
      'message_type': MessageType.text.name,
      'metadata': {'ai_generated': true},
      'is_ai': true,
      'status': 'delivered',
      'created_at': DateTime.now().toIso8601String(),
    };
    try {
      await _supabase.from('messages').insert(aiPayload);
      
      // إضافة رسالة الذكاء الاصطناعي محلياً فوراً
      final localAiMsg = MessageModel.fromMap(aiPayload);
      ref.read(chatProvider(widget.conversationId).notifier).addMessageLocal(localAiMsg);
      _scrollToTop();
    } catch (e) {
      debugPrint('AI response insert error: $e');
    }
  }

  void _startCall(bool isVideo, {bool isJoin = false, String? callId}) async {
    final activeCallId = callId ?? const Uuid().v4();
    if (!isJoin) {
      await _sendMessage(
        customId: activeCallId,
        type: MessageType.callInvite,
        content: isVideo ? 'مكالمة فيديو صادرة' : 'مكالمة صوتية صادرة',
        status: 'ringing',
        metadata: {
          'call_id': activeCallId,
          'call_type': isVideo ? 'video' : 'voice',
          'call_status': 'active',
          'call_started_at': DateTime.now().toIso8601String(),
        },
      );
    }
    if (mounted) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => CallOverlay(
            name: widget.expertName,
            callId: activeCallId,
            conversationId: widget.conversationId,
            initialMode: isJoin ? CallMode.active : CallMode.outgoing,
            isVideo: isVideo,
          ),
        ),
      );
    }
  }

  // ══════════════════════════════════════════════
  // Build
  // ══════════════════════════════════════════════
  @override
  Widget build(BuildContext context) {
    final uploadState    = ref.watch(chatUploadProvider);
    final isUploadingNow = uploadState is ChatUploadLoading || _isUploading;

    return Scaffold(
      extendBodyBehindAppBar: true,
      backgroundColor: _kBg,
      endDrawer: BioParaDrawer(conversationId: widget.conversationId),
      appBar: _buildAppBar(),
      body: GestureDetector(
        onTap: () => FocusScope.of(context).unfocus(),
        child: Column(
          children: [
            Expanded(child: _buildMessages()),
            _buildInputBar(isUploadingNow),
          ],
        ),
      ),
    );
  }

  // ══════════════════════════════════════════════
  // AppBar
  // ══════════════════════════════════════════════
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
            hintText: 'ابحث في المحادثة...',
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
      subtitle = '🎙 يسجل مقطعاً صوتياً...';
    } else if (presence.isTyping) {
      subtitle = '✍️ يكتب الآن...';
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
      ),
      titleSpacing: 0,
      leadingWidth: 60,
      leading: Padding(
        padding: const EdgeInsets.only(right: 12, top: 8, bottom: 8),
        child: Stack(
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
            if (isOnline) const Positioned(right: 0, bottom: 0, child: StatusPulse()),
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
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 300),
              child: Text(subtitle,
                key: ValueKey(subtitle),
                style: GoogleFonts.tajawal(fontSize: 12,
                    color: presence.isTyping ? _kGold : (isOnline ? Colors.greenAccent.shade100 : Colors.white70))),
            ),
          ],
        ),
      ),
      actions: [
        if (!_isSearching) ...[
          IconButton(icon: const Icon(Icons.search_rounded), onPressed: () => setState(() => _isSearching = true)),
          _buildCallButton(isVideo: true),
          _buildCallButton(isVideo: false),
        ],
        Builder(
          builder: (context) => IconButton(
            icon: const Icon(Icons.more_vert_rounded, size: 24),
            onPressed: () => Scaffold.of(context).openEndDrawer(),
          ),
        ),
      ],
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(2),
        child: Container(height: 2, color: _kGold.withValues(alpha: 0.7)),
      ),
    );
  }

  Widget _buildCallButton({required bool isVideo}) {
    // على الويب: Zego غير مدعوم — أظهر رسالة
    if (kIsWeb) {
      return IconButton(
        icon: Icon(isVideo ? Icons.videocam_rounded : Icons.call_rounded,
            color: Colors.white, size: 20),
        onPressed: () => ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('المكالمات متاحة على تطبيق الهاتف فقط')),
        ),
      );
    }

    // ── تحديد الطرف المستهدَف (موحّد مع تسجيل الدخول في main_*) ──
    // المريض → يتصل بالأدمن الثابت (biopara_admin)
    // الأدمن → يتصل بالمريض عبر معرّف المحادثة (= patient uid)
    final bool callerIsAdmin = _isAdmin();
    final String targetId = callerIsAdmin
        ? widget.conversationId.replaceAll(RegExp(r'[^a-zA-Z0-9_]'), '_') // patient uid
        : ZegoCallService.adminUserId;   // 'biopara_admin' — متطابق مع main_admin!
    final String targetName = callerIsAdmin
        ? 'المريض'
        : ZegoCallService.adminUserName;

    return ZegoSendCallInvitationButton(
      isVideoCall: isVideo,
      invitees: [ZegoUIKitUser(id: targetId, name: targetName)],
      resourceID: 'biopara_calls', // يجب أن يطابق resource فـ Zego Console
      timeoutSeconds: 30,
      iconSize: const Size(40, 40),
      buttonSize: const Size(40, 40),
      onPressed: (code, message, errorInvitees) {
        // Zego يفتح شاشة المكالمة تلقائياً — لا نستدعي _startCall هنا
        if (errorInvitees.isNotEmpty && mounted) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content: Text('تعذر الاتصال — تأكد أن المستخدم الآخر متصل',
                style: GoogleFonts.tajawal()),
            backgroundColor: Colors.red,
          ));
        }
      },
      icon: ButtonIcon(
        icon: Icon(isVideo ? Icons.videocam_rounded : Icons.call_rounded,
            color: Colors.white, size: 20),
      ),
    );
  }

  // ══════════════════════════════════════════════
  // Messages List
  // ══════════════════════════════════════════════
  Widget _buildMessages() {
    var messages = ref.watch(chatProvider(widget.conversationId));

    // ── إخفاء رسائل النظام الداخلية والـ UUID ──────────────
    // 1. إخفاء callSystem (call_cancel, call_end, call_accept, call_decline)
    // 2. إخفاء أي رسالة محتواها UUID خام (رسائل قديمة قبل الإصلاح)
    final uuidRegex = RegExp(
        r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
        caseSensitive: false);
    messages = messages.where((m) {
      if (m.type == MessageType.callSystem) return false;
      if (uuidRegex.hasMatch(m.content.trim())) return false;
      return true;
    }).toList();

    if (_searchQuery.isNotEmpty) {
      messages = messages
          .where((m) => m.content.toLowerCase().contains(_searchQuery.toLowerCase()))
          .toList();
    }

    return Stack(
      children: [
        // خلفية الدردشة — نمط BioPara
        Positioned.fill(child: _buildChatBackground()),

        if (messages.isEmpty)
          Center(child: _buildEmptyState())
        else
          ListView.builder(
            controller: _scrollCtrl,
            reverse: true,
            padding: EdgeInsets.only(
              left: 8, right: 8,
              top: MediaQuery.of(context).padding.top + kToolbarHeight + 16,
              bottom: 12,
            ),
            itemCount: messages.length + 1,
            itemBuilder: (_, i) {
              if (i == messages.length) return _buildEncryptionNotice();

              final m  = messages[i];
              // رسائل الذكاء الاصطناعي تظهر دائماً على اليسار (كالمستشار)
              final bool isMe = !m.isAi &&
                  (_supabase.auth.currentUser?.id != null) &&
                  (m.senderId == _supabase.auth.currentUser!.id);

              // منطق التجميع
              bool showTail = (i == messages.length - 1);
              bool showDateHeader = (i == messages.length - 1);

              if (i < messages.length - 1) {
                final older = messages[i + 1];
                if (m.senderId != older.senderId) showTail = true;
                if (m.createdAt != null && older.createdAt != null &&
                    m.createdAt!.day != older.createdAt!.day) {
                  showDateHeader = true;
                  showTail = true;
                }
              }

              return Column(
                children: [
                  if (showDateHeader) _buildDateHeader(m.createdAt),
                  _buildMessageItem(m, isMe, showTail),
                ],
              );
            },
          ),
      ],
    );
  }

  Widget _buildChatBackground() {
    return Container(
      color: _kParchment,
      child: CustomPaint(
        painter: _BioParaPatternPainter(),
        child: const SizedBox.expand(),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Container(
      margin: const EdgeInsets.all(32),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.9),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: _kGold.withValues(alpha: 0.4)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: RadialGradient(
                colors: [_kGold.withValues(alpha: 0.2), Colors.transparent],
              ),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.spa_rounded, color: _kGold, size: 48),
          ),
          const SizedBox(height: 16),
          Text('مرحباً بك في BioPara',
              style: GoogleFonts.cairo(fontSize: 18, fontWeight: FontWeight.bold, color: _kForest)),
          const SizedBox(height: 8),
          Text(
            'ابدأ محادثتك مع المستشار الروحاني.\nنحن هنا للاستماع إليك بكل خصوصية.',
            textAlign: TextAlign.center,
            style: GoogleFonts.tajawal(fontSize: 13, color: Colors.black54, height: 1.6),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: _kGold.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: _kGold.withValues(alpha: 0.3)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.lock_outline_rounded, size: 14, color: _kGold),
                const SizedBox(width: 6),
                Text('محادثة مشفرة وآمنة',
                    style: GoogleFonts.tajawal(fontSize: 12, color: _kGold, fontWeight: FontWeight.w600)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEncryptionNotice() {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 20, horizontal: 30),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.8),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: _kGold.withValues(alpha: 0.5)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.lock_outline_rounded, size: 13, color: _kGold),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              'هذه المحادثة مشفرة وخاصة. لا يمكن لأي طرف ثالث الاطلاع عليها.',
              textAlign: TextAlign.center,
              style: GoogleFonts.tajawal(fontSize: 11, color: Colors.black54, height: 1.5),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageItem(MessageModel m, bool isMe, bool showTail) {
    return GestureDetector(
      onLongPress: () {
        HapticFeedback.mediumImpact();
        _showMessageContextMenu(m, isMe);
      },
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          SwipeTo(
            onRightSwipe: (_) => setState(() => _replyToMsg = m),
            child: Bubble(
              msg: m,
              isMe: isMe,
              showTail: showTail,
              isFirstInGroup: showTail,
              isStarred: _starredMessages.contains(m.id),
              onStar: () => _toggleStar(m.id),
              onLongPress: () => _showMessageContextMenu(m, isMe),
              onJoinCall: () => _startCall(
                  m.content.contains('فيديو'), isJoin: true, callId: m.id),
            ),
          ),
          // Reactions display
          if (m.reactions.isNotEmpty)
            Positioned(
              bottom: -8,
              right: isMe ? 20 : null,
              left: isMe ? null : 20,
              child: _buildReactionsDisplay(m),
            ),
        ],
      ),
    );
  }

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

  // قائمة السياق عند الضغط المطوّل
  void _showMessageContextMenu(MessageModel m, bool isMe) {
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
            // Drag handle
            Container(
              width: 40, height: 4,
              margin: const EdgeInsets.symmetric(vertical: 12),
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(4),
              ),
            ),

            // معاينة الرسالة
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: _kParchment,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: _kGold.withValues(alpha: 0.3)),
              ),
              child: Text(
                m.isDeleted ? 'تم حذف هذه الرسالة' : (m.content.length > 60 ? '${m.content.substring(0, 60)}...' : m.content),
                style: GoogleFonts.tajawal(fontSize: 13, color: Colors.black87),
                textAlign: TextAlign.right,
              ),
            ),

            // تفاعلات (Reactions)
            Container(
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: _kReactions.map((emoji) {
                  return GestureDetector(
                    onTap: () {
                      Navigator.pop(ctx);
                      ref.read(chatProvider(widget.conversationId).notifier)
                          .addReaction(m.id, emoji, _userId ?? '');
                    },
                    child: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: _kParchment,
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

            // خيارات الرسالة
            _buildContextOption(Icons.reply_rounded, 'رد', _kPrimary, () {
              Navigator.pop(ctx);
              setState(() => _replyToMsg = m);
            }),
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

  // ══════════════════════════════════════════════
  // Input Bar
  // ══════════════════════════════════════════════
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
            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 8, offset: const Offset(0, -2))],
          ),
          child: SafeArea(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                // زر الإيموجي
                IconButton(
                  icon: const Icon(Icons.emoji_emotions_outlined, color: _kGold, size: 26),
                  onPressed: () => _showEmojiPicker(),
                ),
                // حقل الإدخال
                Expanded(
                  child: Container(
                    constraints: const BoxConstraints(maxHeight: 120),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(26),
                      border: Border.all(color: _kSage.withValues(alpha: 0.5)),
                      boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 4)],
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Expanded(
                          child: Focus(
                            onKeyEvent: (node, event) {
                              if (event is KeyDownEvent &&
                                  event.logicalKey == LogicalKeyboardKey.enter) {
                                if (!HardwareKeyboard.instance.isShiftPressed) {
                                  if (_isTyping || _selectedFiles.isNotEmpty) {
                                    _sendMessage();
                                  }
                                  return KeyEventResult.handled;
                                }
                              }
                              return KeyEventResult.ignored;
                            },
                            child: TextField(
                              controller: _msgCtrl,
                              minLines: 1,
                              maxLines: 5,
                              onChanged: (v) {
                                final typing = v.trim().isNotEmpty;
                                if (typing != _isTyping) {
                                  setState(() => _isTyping = typing);
                                  ref.read(presenceProvider(widget.conversationId).notifier)
                                      .updateTyping(typing);
                                }
                              },
                              style: GoogleFonts.tajawal(fontSize: 15),
                              textInputAction: TextInputAction.send,
                              onSubmitted: (_) {
                                if (_isTyping || _selectedFiles.isNotEmpty) {
                                  _sendMessage();
                                }
                              },
                              decoration: InputDecoration(
                                hintText: 'اكتب رسالتك...',
                                hintStyle: GoogleFonts.tajawal(
                                    color: Colors.grey.shade400, fontSize: 14),
                                border: InputBorder.none,
                                contentPadding: const EdgeInsets.symmetric(
                                    horizontal: 16, vertical: 12),
                              ),
                            ),
                          ),
                        ),
                        // زر المرفقات
                        IconButton(
                          icon: Icon(Icons.add_circle_outline_rounded,
                              color: _kPrimary.withValues(alpha: 0.7), size: 22),
                          onPressed: () => _showQuickActions(context),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                // زر الإرسال / الميكروفون
                GestureDetector(
                  onLongPress: () {
                    if (!_isTyping && _selectedFiles.isEmpty) {
                      HapticFeedback.heavyImpact();
                      _startRecording();
                    }
                  },
                  onTap: () => (_isTyping || _selectedFiles.isNotEmpty)
                      ? _sendMessage()
                      : _startRecording(),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    width: 50, height: 50,
                    margin: const EdgeInsets.only(bottom: 2),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: (_isTyping || _selectedFiles.isNotEmpty)
                            ? [_kGold, const Color(0xFFE8A84E)]
                            : [_kPrimary, _kForest],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: (_isTyping ? _kGold : _kPrimary).withValues(alpha: 0.4),
                          blurRadius: 8, offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: busy
                        ? const Center(child: SizedBox(width: 20, height: 20,
                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)))
                        : Icon(
                            (_isTyping || _selectedFiles.isNotEmpty)
                                ? Icons.send_rounded
                                : Icons.mic_rounded,
                            color: Colors.white, size: 22,
                          ),
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
      decoration: BoxDecoration(
        color: Colors.white,
        border: const Border(top: BorderSide(color: Color(0xFFEEEEEE))),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 8, offset: const Offset(0, -2))],
      ),
      child: SafeArea(
        child: Row(
          children: [
            const PulsingDot(),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: Colors.red.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(_fmt(Duration(seconds: _recSecs)),
                  style: GoogleFonts.cairo(color: Colors.redAccent, fontWeight: FontWeight.bold, fontSize: 13)),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: (!kIsWeb && _recorderCtrl != null)
                  ? AudioWaveforms(
                      size: const Size(double.infinity, 30),
                      recorderController: _recorderCtrl!,
                      enableGesture: false,
                      waveStyle: WaveStyle(
                        waveColor: _kPrimary.withValues(alpha: 0.5),
                        showMiddleLine: false,
                        spacing: 6,
                        extendWaveform: true,
                      ),
                    )
                  : Row(children: [
                      const Icon(Icons.graphic_eq, color: _kSage),
                      Text(' يسجل...', style: GoogleFonts.cairo(color: Colors.black54)),
                    ]),
            ),
            // إلغاء
            IconButton(
              icon: const Icon(Icons.delete_outline, color: Colors.redAccent),
              onPressed: _cancelRecording,
            ),
            // إرسال
            GestureDetector(
              onTap: _stopAndSend,
              child: Container(
                width: 46, height: 46,
                decoration: const BoxDecoration(
                  gradient: LinearGradient(colors: [_kPrimary, _kForest]),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _fmt(Duration d) =>
      '${d.inMinutes.toString().padLeft(2, '0')}:${(d.inSeconds % 60).toString().padLeft(2, '0')}';

  // ══════════════════════════════════════════════
  // Quick Actions (Attach)
  // ══════════════════════════════════════════════
  void _showQuickActions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: const EdgeInsets.only(top: 12, bottom: 32, left: 24, right: 24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
          border: Border.all(color: _kGold.withValues(alpha: 0.2)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40, height: 4,
              margin: const EdgeInsets.only(bottom: 20),
              decoration: BoxDecoration(
                color: _kGold.withValues(alpha: 0.6),
                borderRadius: BorderRadius.circular(4),
              ),
            ),
            Text('إرفاق ملف',
                style: GoogleFonts.cairo(fontSize: 14, fontWeight: FontWeight.bold, color: _kPrimary)),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildActionItem(Icons.camera_alt_rounded, 'صورة', const Color(0xFF795548),
                    () { Navigator.pop(ctx); _pickAndUploadImage(); }),
                _buildActionItem(Icons.videocam_rounded, 'فيديو', Colors.redAccent,
                    () { Navigator.pop(ctx); _pickAndUploadVideo(); }),
                _buildActionItem(Icons.calendar_month_rounded, 'حجز جلسة', _kGold,
                    () { Navigator.pop(ctx); Navigator.push(context, MaterialPageRoute(builder: (_) => const BookingScreen())); }),
                _buildActionItem(Icons.eco_rounded, 'منتج', _kPrimary,
                    () { Navigator.pop(ctx); _showProductPicker(); }),
              ],
            ),
          ],
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
            child: Icon(icon, color: color, size: 26),
          ),
        ),
        const SizedBox(height: 8),
        Text(label, style: GoogleFonts.cairo(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.black87)),
      ],
    );
  }

  void _showEmojiPicker() {
    // لوحة إيموجي مبسّطة
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
                    _msgCtrl.text += e;
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
            subtitle: Text('${prods[i].price} درهم'),
            onTap: () {
              Navigator.pop(ctx);
              _sendMessage(
                type: MessageType.product,
                content: 'مشاركة منتج: ${prods[i].name}',
                metadata: prods[i].toMap(),
              );
            },
          ),
        ),
      );
    });
  }

  Widget _buildReplyPreview() => Container(
    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
    decoration: BoxDecoration(
      color: Colors.white,
      border: Border(top: BorderSide(color: _kSage.withValues(alpha: 0.3))),
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
                _replyToMsg!.senderId == _userId ? 'أنت' : 'المستشار',
                style: GoogleFonts.cairo(fontWeight: FontWeight.bold, fontSize: 12, color: _kGold),
              ),
              Text(
                _replyToMsg!.content,
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

  Widget _buildAttachmentPreview() {
    return Container(
      height: 90,
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: Color(0xFFEEEEEE))),
      ),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _selectedFiles.length,
        itemBuilder: (ctx, i) {
          final f = _selectedFiles[i];
          final isImg = f.path.startsWith('blob:') ||
              ['.jpg', '.jpeg', '.png', '.webp']
                  .contains(p.extension(f.path).toLowerCase());

          return Container(
            margin: const EdgeInsets.only(right: 12),
            width: 70,
            child: Stack(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: Container(
                    color: _kPrimary.withValues(alpha: 0.1),
                    child: Center(
                      child: isImg
                          ? Image.network(f.path, fit: BoxFit.cover,
                              width: 70, height: 70,
                              errorBuilder: (ctx, err, st) =>
                                  const Icon(Icons.image, color: _kPrimary))
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

// ══════════════════════════════════════════════
// خلفية الدردشة — نمط زخرفي BioPara
// ══════════════════════════════════════════════
class _BioParaPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFFC8963E).withValues(alpha: 0.04)
      ..strokeWidth = 1
      ..style = PaintingStyle.stroke;

    // نمط ورق شجر بسيط متكرر
    for (double y = 0; y < size.height; y += 80) {
      for (double x = 0; x < size.width; x += 80) {
        final path = Path();
        path.moveTo(x + 10, y + 40);
        path.cubicTo(x + 10, y + 20, x + 40, y + 10, x + 40, y + 40);
        path.cubicTo(x + 40, y + 70, x + 10, y + 60, x + 10, y + 40);
        canvas.drawPath(path, paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
