import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:image_picker/image_picker.dart';
import 'package:record/record.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;
import 'dart:io' as io;
import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import '../providers/cart_provider.dart';
import 'booking_screen.dart';
import 'cart_screen.dart';
import 'call_screen.dart';
import '../widgets/message_context_menu.dart';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN CHAT SCREEN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class ChatScreen extends ConsumerStatefulWidget {
  final String conversationId;
  const ChatScreen({super.key, required this.conversationId});

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final TextEditingController _msgController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final SupabaseClient _supabase = Supabase.instance.client;

  bool _isAdmin = false;
  String? _currentUserId;

  // Media
  final AudioRecorder _audioRecorder = AudioRecorder();
  bool _isRecording = false;
  final ImagePicker _picker = ImagePicker();
  bool _isUploading = false;

  // Swipe-to-Reply
  Map<String, dynamic>? _replyingTo;

  // ── Phase 4: Presence & Typing ──────────────────────
  RealtimeChannel? _presenceChannel;
  bool   _otherIsTyping  = false;
  bool   _otherIsOnline  = false;
  String _otherLastSeen  = '';
  Timer? _typingTimer;           // debounce – stops broadcasting after 2s
  bool   _isBroadcastingTyping = false;
  // ─────────────────────────────────────────────────────

  // Brand Colors (BioPara - unchanged)
  static const Color _primaryGreen  = Color(0xFF1B5E20);
  static const Color _accentGreen   = Color(0xFF4CAF50);
  static const Color _lightGreen    = Color(0xFFE8F5E9);
  // WhatsApp sender bubble color: Color(0xFFE7FFDB) — applied directly in _WhatsAppBubble
  static const Color _bgChat        = Color(0xFFE5DDD5); // WhatsApp wallpaper bg

  @override
  void initState() {
    super.initState();
    _currentUserId = _supabase.auth.currentUser?.id;
    final email = _supabase.auth.currentUser?.email ?? '';
    _isAdmin = email.startsWith('admin');
    _subscribeToPresence();
  }

  @override
  void dispose() {
    _typingTimer?.cancel();
    _presenceChannel?.unsubscribe();
    _msgController.dispose();
    _scrollController.dispose();
    _audioRecorder.dispose();
    super.dispose();
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PHASE 4: PRESENCE & TYPING
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  void _subscribeToPresence() {
    if (_currentUserId == null) return;

    final channelName = 'chat:${widget.conversationId}';
    _presenceChannel = _supabase.channel(channelName);

    // ── Listen to presence state changes (BEFORE subscribe) ──
    _presenceChannel!.onPresenceSync((payload) {
      // presenceState() returns List<SinglePresenceState> in supabase_flutter v2
      final presences = _presenceChannel!.presenceState();
      if (!mounted) return;

      bool otherOnline = false;
      bool otherTyping = false;
      String lastSeen  = '';

      for (final entry in presences) {
        final data = entry.presences;
        for (final presence in data) {
          final pld = presence.payload;
          if (pld['user_id'] != _currentUserId) {
            otherOnline = true;
            if (pld['typing'] == true) otherTyping = true;
            if (pld['online_at'] != null) {
              try {
                final dt = DateTime.parse(pld['online_at'] as String).toLocal();
                lastSeen = DateFormat('H:mm').format(dt);
              } catch (_) {}
            }
          }
        }
      }

      setState(() {
        _otherIsOnline = otherOnline;
        _otherIsTyping = otherTyping;
        _otherLastSeen = lastSeen;
      });
    });

    _presenceChannel!.onPresenceLeave((payload) {
      if (!mounted) return;
      setState(() {
        _otherIsOnline = false;
        _otherIsTyping = false;
      });
    });

    // ── Subscribe & track own presence ──
    _presenceChannel!.subscribe((status, error) async {
      if (status == RealtimeSubscribeStatus.subscribed) {
        await _presenceChannel!.track({
          'user_id':   _currentUserId,
          'online_at': DateTime.now().toIso8601String(),
          'typing':    false,
        });
      }
    });
  }

  /// Called every keystroke – broadcasts typing=true then debounces stop.
  void _broadcastTyping() {
    if (_presenceChannel == null || _currentUserId == null) return;

    // Broadcast typing = true (only once until stopped)
    if (!_isBroadcastingTyping) {
      _isBroadcastingTyping = true;
      _presenceChannel!.track({
        'user_id':   _currentUserId,
        'online_at': DateTime.now().toIso8601String(),
        'typing':    true,
      });
    }

    // Reset debounce timer – 2 seconds after last keystroke
    _typingTimer?.cancel();
    _typingTimer = Timer(const Duration(seconds: 2), _stopTypingBroadcast);
  }

  /// Called after 2s inactivity or when message is sent.
  void _stopTypingBroadcast() {
    _isBroadcastingTyping = false;
    _presenceChannel?.track({
      'user_id':   _currentUserId,
      'online_at': DateTime.now().toIso8601String(),
      'typing':    false,
    });
  }

  /// Returns the correct subtitle string for the AppBar.
  String get _appBarSubtitle {
    if (_otherIsTyping)  return 'يكتب...';
    if (_otherIsOnline)  return 'متصل الآن 🟢';
    if (_otherLastSeen.isNotEmpty) return 'آخر ظهور في $_otherLastSeen';
    return _isAdmin ? 'مشاهدة ملف المريض' : 'في انتظار المعالج';
  }

  /// Returns the subtitle colour (green for online/typing, faded otherwise).
  Color get _subtitleColor {
    if (_otherIsTyping) return const Color(0xFF80CBC4); // teal for typing
    if (_otherIsOnline) return Colors.white70;
    return Colors.white38;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SUPABASE LOGIC
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Future<String?> _uploadFile(Uint8List bytes, String fileName, String folder) async {
    try {
      final uploadPath = '$folder/$fileName';
      await _supabase.storage.from('chat_media').uploadBinary(uploadPath, bytes);
      return _supabase.storage.from('chat_media').getPublicUrl(uploadPath);
    } catch (e) {
      debugPrint('❌ Upload error: $e');
      return null;
    }
  }

  Future<void> _pickImage(ImageSource source) async {
    Navigator.maybeOf(context)?.maybePop(); // close bottom sheet if open
    final XFile? image = await _picker.pickImage(source: source, imageQuality: 70);
    if (image == null) return;

    setState(() => _isUploading = true);
    final bytes = await image.readAsBytes();
    final fileName = '${DateTime.now().millisecondsSinceEpoch}_${image.name}';
    final url = await _uploadFile(bytes, fileName, 'images');
    setState(() => _isUploading = false);

    if (url != null) _sendMessage(type: 'image', content: url);
  }

  Future<void> _startRecording() async {
    try {
      if (await _audioRecorder.hasPermission()) {
        String path = '';
        if (!kIsWeb) {
          final dir = await getTemporaryDirectory();
          path = p.join(dir.path, 'rec_${DateTime.now().millisecondsSinceEpoch}.m4a');
        }
        await _audioRecorder.start(const RecordConfig(), path: path);
        setState(() => _isRecording = true);
        HapticFeedback.mediumImpact();
      }
    } catch (e) {
      debugPrint('❌ Start recording: $e');
    }
  }

  Future<void> _stopRecording() async {
    try {
      final path = await _audioRecorder.stop();
      setState(() => _isRecording = false);
      if (path == null) return;

      setState(() => _isUploading = true);
      Uint8List bytes;
      if (kIsWeb) {
        final resp = await http.get(Uri.parse(path));
        bytes = resp.bodyBytes;
      } else {
        bytes = await io.File(path).readAsBytes();
      }
      final url = await _uploadFile(bytes, 'rec_${DateTime.now().millisecondsSinceEpoch}.m4a', 'audio');
      setState(() => _isUploading = false);
      if (url != null) _sendMessage(type: 'audio', content: url);
    } catch (e) {
      debugPrint('❌ Stop recording: $e');
    }
  }

  Future<void> _sendMessage({
    String type = 'text',
    String content = '',
    Map<String, dynamic>? metadata,
  }) async {
    final text = type == 'text' ? _msgController.text.trim() : content;
    if (text.isEmpty && type == 'text') return;
    if (type == 'text') {
      _msgController.clear();
      _stopTypingBroadcast(); // Phase 4: stop typing indicator on send
    }

    final userId = _supabase.auth.currentUser?.id;
    if (userId == null) return;

    String convId = widget.conversationId;
    if (convId.length < 10) convId = userId;

    try {
      await _supabase.from('conversations').upsert({
        'id': convId,
        'patient_id': convId,
      });

      await _supabase.from('messages').insert({
        'conversation_id': convId,
        'sender_id': userId,
        'content': text,
        'message_type': type,
        'metadata': metadata,
        'reply_to_id': _replyingTo?['id'],  // Phase 3: Swipe-to-Reply
        'status': 'sent',                    // Phase 3: Ticks
      });

      _cancelReply();
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          0,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    } catch (e) {
      debugPrint('❌ Send error: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('فشل الإرسال: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PHASE 3: SWIPE-TO-REPLY
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  void _onSwiped(Map<String, dynamic> message) {
    HapticFeedback.lightImpact();
    setState(() => _replyingTo = message);
  }

  void _cancelReply() {
    _stopTypingBroadcast(); // ensure typing stops if user cancels reply
    setState(() => _replyingTo = null);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PHASE 5: LONG-PRESS CONTEXT MENU
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  void _showContextMenu(
    BuildContext ctx,
    Map<String, dynamic> message,
    bool isMe,
    GlobalKey bubbleKey,
  ) {
    HapticFeedback.mediumImpact();
    showMessageContextMenu(
      context: ctx,
      message: message,
      isMe: isMe,
      bubbleKey: bubbleKey,
      onReply: _onSwiped,
      onReaction: (emoji) => _toggleReaction(message['id'], emoji),
      onDelete: () => _deleteMessage(message['id']), // Phase 6
    );
  }

  // ── Phase 6: Delete Message ──
  Future<void> _deleteMessage(String messageId) async {
    try {
      // WhatsApp behavior for "Delete for everyone":
      // We change the content and type so the record remains but UI hides it.
      await _supabase.from('messages').update({
        'content': 'تم حذف هذه الرسالة',
        'message_type': 'deleted',
        'metadata': {}, // clear any file metadata
      }).eq('id', messageId);

      HapticFeedback.lightImpact();
    } catch (e) {
      debugPrint('❌ Delete error: $e');
    }
  }

  // ── Phase 6: Reactions Backend ──
  Future<void> _toggleReaction(String messageId, String emoji) async {
    final userId = _supabase.auth.currentUser?.id;
    if (userId == null) return;

    try {
      // 1. Get current reactions
      final res = await _supabase
          .from('messages')
          .select('reactions')
          .eq('id', messageId)
          .single();

      Map<String, dynamic> reactions = Map<String, dynamic>.from(res['reactions'] ?? {});

      // Logic: Simple WhatsApp style (one reaction per user per message)
      // If user clicks same emoji -> remove it.
      // If user clicks different emoji -> replace old one.
      
      // Clean up existing reaction for this user
      reactions.removeWhere((key, value) {
        if (value is List) {
          value.remove(userId);
          return value.isEmpty;
        }
        return false;
      });

      // Add new reaction
      if (emoji != 'remove') {
        if (reactions[emoji] == null) reactions[emoji] = [];
        (reactions[emoji] as List).add(userId);
      }

      await _supabase
          .from('messages')
          .update({'reactions': reactions})
          .eq('id', messageId);

      HapticFeedback.lightImpact();
    } catch (e) {
      debugPrint('❌ Reaction error: $e');
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ZEGOCLOUD CALLS (preserved untouched)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  void _startCall(bool isVideo) {
    _sendMessage(
      type: 'call_invite',
      content: isVideo ? 'مكالمة فيديو واردة 🎥' : 'مكالمة صوتية واردة 📞',
      metadata: {'call_id': widget.conversationId, 'is_video': isVideo},
    );
    Navigator.push(context, MaterialPageRoute(builder: (_) => CallScreen(
      callID: widget.conversationId,
      userID: _currentUserId!,
      userName: _isAdmin ? 'المعالج' : 'المريض',
      isVideoCall: isVideo,
    )));
  }

  void _joinCall(Map<String, dynamic> metadata) {
    Navigator.push(context, MaterialPageRoute(builder: (_) => CallScreen(
      callID: metadata['call_id'] ?? widget.conversationId,
      userID: _currentUserId!,
      userName: _isAdmin ? 'المعالج' : 'المريض',
      isVideoCall: metadata['is_video'] ?? true,
    )));
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ADMIN ACTIONS (preserved)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  void _onAdminSendBookingInvite() {
    _sendMessage(
      type: 'booking_invite',
      content: 'لقد تم تشخيص حالتك بدقة 🌿. لترتيب جلسة روحانية كاملة، يرجى حجز الموعد الآن.',
      metadata: {'action': 'open_booking_calendar'},
    );
  }

  void _onAdminSendProductLink() {
    _sendMessage(
      type: 'product_link',
      content: 'العلاج المقترح. عشبة BioPara المختارة بعناية لك.',
      metadata: {
        'id': 'promo_1',
        'name_ar': 'علاج روحي بالأعشاب الطبيعية',
        'price': 150.0,
        'image_url': '',
      },
    );
  }

  void _addToCart(Map<String, dynamic> metadata) {
    ref.read(cartProvider.notifier).addToCart(
      productId: metadata['id'].toString(),
      productName: metadata['name_ar'] ?? 'منتج موصى به',
      productPrice: (metadata['price'] as num?)?.toDouble() ?? 0,
      imageUrl: metadata['image_url'],
    );
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('✅ الإضافة للسلة: ${metadata['name_ar']}'), backgroundColor: _primaryGreen),
    );
  }

  void _showPatientReport() async {
    final data = await _supabase
        .from('conversations')
        .select('patient_report, sentiment_mood, sentiment_score, sentiment_summary, sentiment_advice')
        .eq('id', widget.conversationId)
        .maybeSingle();

    if (data == null || data['patient_report'] == null) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('لا يوجد تقرير بعد')));
      return;
    }

    if (mounted) {
      showModalBottomSheet(
        context: context,
        isScrollControlled: true,
        backgroundColor: Colors.transparent,
        builder: (_) => Container(
          height: MediaQuery.of(context).size.height * 0.75,
          decoration: const BoxDecoration(color: Colors.white, borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
          padding: const EdgeInsets.all(20),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(child: Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey, borderRadius: BorderRadius.circular(2)))),
                const SizedBox(height: 20),
                const Text('📋 تقرير المساعد الذكي', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: _primaryGreen)),
                const Divider(),
                const SizedBox(height: 10),
                Text(data['patient_report'], style: const TextStyle(fontSize: 16, height: 1.6)),
                const SizedBox(height: 20),
                const Text('🧠 التحليل النفسي', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.orange)),
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.all(15),
                  decoration: BoxDecoration(color: Colors.orange.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('الحالة: ${data['sentiment_mood']} (درجة: ${data['sentiment_score']}/10)', style: const TextStyle(fontWeight: FontWeight.bold)),
                      const SizedBox(height: 5),
                      Text(data['sentiment_summary'] ?? ''),
                      const SizedBox(height: 10),
                      const Text('نصيحة:', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blueGrey)),
                      Text(data['sentiment_advice'] ?? ''),
                    ],
                  ),
                ),
                const SizedBox(height: 30),
              ],
            ),
          ),
        ),
      );
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // BUILD
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bgChat,
      appBar: AppBar(
        backgroundColor: _primaryGreen,
        foregroundColor: Colors.white,
        leadingWidth: 70,
        leading: Row(
          children: [
            const SizedBox(width: 4),
            IconButton(
              padding: EdgeInsets.zero,
              icon: const Icon(Icons.arrow_back),
              onPressed: () => Navigator.pop(context),
            ),
            GestureDetector(
              onTap: () => _openContactDetail(),
              child: Hero(
                tag: 'avatar_${widget.conversationId}',
                child: const CircleAvatar(
                  radius: 18,
                  backgroundColor: Colors.white24,
                  child: Icon(Icons.person, color: Colors.white, size: 24),
                ),
              ),
            ),
          ],
        ),
        title: InkWell(
          onTap: () => _openContactDetail(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('عيادة BioPara', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: Text(
                  _appBarSubtitle,
                  key: ValueKey(_appBarSubtitle),
                  style: TextStyle(fontSize: 11, color: _subtitleColor),
                ),
              ),
            ],
          ),
        ),
        actions: [
          IconButton(icon: const Icon(Icons.videocam), onPressed: () => _startCall(true)),
          IconButton(icon: const Icon(Icons.call), onPressed: () => _startCall(false)),
          if (_isAdmin)
            IconButton(
              icon: const Icon(Icons.assignment_ind, color: Colors.orangeAccent),
              onPressed: _showPatientReport,
              tooltip: 'ملف المريض',
            ),
          IconButton(
            icon: const Icon(Icons.shopping_cart),
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const CartScreen())),
          ),
        ],
      ),
      body: Stack(
        children: [
          // ── Chat Wallpaper Layer (Phase 9) ──
          Positioned.fill(
            child: Container(
              color: const Color(0xFFE5DDD5), // Classic WhatsApp beige
              child: Opacity(
                opacity: 0.08,
                child: Image.network(
                  'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded51.png',
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),
          Column(
            children: [
              Expanded(child: _buildChatStream()),
              if (_isAdmin) _buildAdminActionStrip(),
              _buildInputBar(),
            ],
          ),
        ],
      ),
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CHAT STREAM
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Widget _buildChatStream() {
    return StreamBuilder<List<Map<String, dynamic>>>(
      stream: _supabase
          .from('messages')
          .stream(primaryKey: ['id'])
          .eq('conversation_id', widget.conversationId)
          .order('created_at', ascending: false)
          .map((m) => m.toList()),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          return Center(child: Text('خطأ: ${snapshot.error}'));
        }
        final messages = snapshot.data ?? [];
        if (messages.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.spa_outlined, size: 60, color: Colors.green.withValues(alpha: 0.4)),
                const SizedBox(height: 12),
                const Text('ابدأ المحادثة الآن 🌿', style: TextStyle(color: Colors.grey, fontSize: 16)),
              ],
            ),
          );
        }
        return ListView.builder(
          controller: _scrollController,
          reverse: true,
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
          itemCount: messages.length,
          itemBuilder: (ctx, i) {
            final msg = messages[i];
            final isMe = msg['sender_id'] == _currentUserId;
            // Find quoted message if any
            Map<String, dynamic>? quotedMsg;
            if (msg['reply_to_id'] != null) {
              try {
                quotedMsg = messages.firstWhere((m) => m['id'] == msg['reply_to_id']);
              } catch (_) {
                quotedMsg = null;
              }
            }
            final bubbleKey = GlobalKey();
            return _SwipeableBubble(
              key: ValueKey(msg['id']),
              message: msg,
              isMe: isMe,
              quotedMsg: quotedMsg,
              currentUserId: _currentUserId,
              primaryGreen: _primaryGreen,
              accentGreen: _accentGreen,
              lightGreen: _lightGreen,
              bubbleKey: bubbleKey,
              onSwipe: _onSwiped,
              onLongPress: (m) => _showContextMenu(ctx, m, isMe, bubbleKey),
              onJoinCall: _joinCall,
              onAddToCart: _addToCart,
              onBooking: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const BookingScreen())),
            );
          },
        );
      },
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // INPUT BAR (WhatsApp Style)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Widget _buildInputBar() {
    final bool hasText = _msgController.text.trim().isNotEmpty;

    return Container(
      color: Colors.transparent,
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [

            // --- Swipe-to-Reply Preview ---
            if (_replyingTo != null)
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 8),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                  border: Border(left: BorderSide(color: _accentGreen, width: 4)),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _replyingTo!['sender_id'] == _currentUserId ? 'أنت' : 'الطرف الآخر',
                            style: TextStyle(fontWeight: FontWeight.bold, color: _accentGreen, fontSize: 12),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            _replyingTo!['message_type'] == 'text'
                                ? (_replyingTo!['content'] ?? '')
                                : _replyingTo!['message_type'] == 'image' ? '📷 صورة' : '🎤 رسالة صوتية',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(color: Colors.black54, fontSize: 13),
                          ),
                        ],
                      ),
                    ),
                    IconButton(icon: const Icon(Icons.close, size: 18, color: Colors.grey), onPressed: _cancelReply),
                  ],
                ),
              ),

            // --- Main Input Row ---
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 6),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  // TextField container
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(28),
                        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 4, offset: const Offset(0, 2))],
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          const SizedBox(width: 4),
                          IconButton(
                            icon: const Icon(Icons.emoji_emotions_outlined, color: Colors.grey),
                            onPressed: () {},
                          ),
                          Expanded(
                            child: TextField(
                              controller: _msgController,

                              minLines: 1,
                              maxLines: 5,
                              onChanged: (val) {
                                setState(() {});
                                _broadcastTyping();
                              },
                              onSubmitted: (_) => _sendMessage(),
                              decoration: const InputDecoration(
                                hintText: 'اكتب رسالة...',
                                hintStyle: TextStyle(color: Colors.grey, fontSize: 14),
                                border: InputBorder.none,
                                contentPadding: EdgeInsets.symmetric(horizontal: 4, vertical: 10),
                              ),
                            ),
                          ),
                          // Paperclip icon (inside field, right edge)
                          if (!hasText)
                            IconButton(
                              icon: const Icon(Icons.attach_file, color: Colors.grey),
                              onPressed: _showAttachmentMenu,
                            ),
                          if (!hasText)
                            IconButton(
                              icon: const Icon(Icons.camera_alt, color: Colors.grey),
                              onPressed: () => _pickImage(ImageSource.camera),
                            ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(width: 6),

                  // Circular FAB - Mic OR Send (WhatsApp behavior)
                  GestureDetector(
                    onLongPress: () {
                      if (!hasText) _startRecording();
                    },
                    onLongPressUp: () {
                      if (_isRecording) _stopRecording();
                    },
                    onTap: () {
                      if (hasText) _sendMessage();
                    },
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: _isRecording ? Colors.red : _primaryGreen,
                        shape: BoxShape.circle,
                        boxShadow: [BoxShadow(color: _primaryGreen.withValues(alpha: 0.4), blurRadius: 8, offset: const Offset(0, 3))],
                      ),
                      child: _isUploading
                          ? const Padding(
                              padding: EdgeInsets.all(14),
                              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                            )
                          : Icon(
                              _isRecording
                                  ? Icons.mic
                                  : hasText
                                      ? Icons.send_rounded
                                      : Icons.mic,
                              color: Colors.white,
                              size: 22,
                            ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showAttachmentMenu() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        height: 240,
        margin: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Column(
          children: [
            const SizedBox(height: 10),
            Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey[300], borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: 20),
            Expanded(
              child: GridView.count(
                crossAxisCount: 3,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                children: [
                  _attachItem(Icons.photo, Colors.purple, 'معرض الصور',
                      onTap: () => _pickImage(ImageSource.gallery)),
                  _attachItem(Icons.camera_alt, Colors.pink, 'الكاميرا',
                      onTap: () => _pickImage(ImageSource.camera)),
                  _attachItem(Icons.insert_drive_file, Colors.indigo, 'مستند'),
                  _attachItem(Icons.headphones, Colors.orange, 'صوت'),
                  _attachItem(Icons.location_on, Color(0xFF00897B), 'الموقع'),
                  _attachItem(Icons.person, Colors.blue, 'جهة اتصال'),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _attachItem(IconData icon, Color color, String label, {VoidCallback? onTap}) {
    return GestureDetector(
      onTap: () {
        Navigator.pop(context);
        if (onTap != null) onTap();
      },
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          CircleAvatar(backgroundColor: color, radius: 26, child: Icon(icon, color: Colors.white, size: 22)),
          const SizedBox(height: 6),
          Text(label, style: const TextStyle(fontSize: 11, color: Colors.black54)),
        ],
      ),
    );
  }

  Widget _buildAdminActionStrip() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      color: Colors.white,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          TextButton.icon(
            onPressed: _onAdminSendBookingInvite,
            icon: const Icon(Icons.calendar_month, color: Colors.orange, size: 18),
            label: const Text('دعوة حجز', style: TextStyle(color: Colors.orange, fontWeight: FontWeight.bold)),
          ),
          TextButton.icon(
            onPressed: _onAdminSendProductLink,
            icon: const Icon(Icons.local_pharmacy, color: _primaryGreen, size: 18),
            label: const Text('إرسال وصفة', style: TextStyle(color: _primaryGreen, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SWIPEABLE BUBBLE WRAPPER (Phase 3: Swipe-to-Reply)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class _SwipeableBubble extends StatefulWidget {
  final Map<String, dynamic> message;
  final Map<String, dynamic>? quotedMsg;
  final bool isMe;
  final String? currentUserId;
  final Color primaryGreen;
  final Color accentGreen;
  final Color lightGreen;
  final GlobalKey bubbleKey;                                    // Phase 5
  final Function(Map<String, dynamic>) onSwipe;
  final Function(Map<String, dynamic>) onLongPress;            // Phase 5
  final Function(Map<String, dynamic>) onJoinCall;
  final Function(Map<String, dynamic>) onAddToCart;
  final VoidCallback onBooking;

  const _SwipeableBubble({
    super.key,
    required this.message,
    this.quotedMsg,
    required this.isMe,
    required this.currentUserId,
    required this.primaryGreen,
    required this.accentGreen,
    required this.lightGreen,
    required this.bubbleKey,
    required this.onSwipe,
    required this.onLongPress,
    required this.onJoinCall,
    required this.onAddToCart,
    required this.onBooking,
  });

  @override
  State<_SwipeableBubble> createState() => _SwipeableBubbleState();
}

class _SwipeableBubbleState extends State<_SwipeableBubble> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  double _dragOffset = 0;
  bool _triggered = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 150));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onDragUpdate(DragUpdateDetails d) {
    setState(() {
      _dragOffset = math.max(0, math.min(_dragOffset + d.delta.dx, 70));
    });
    if (_dragOffset >= 55 && !_triggered) {
      _triggered = true;
      HapticFeedback.lightImpact();
    }
  }

  void _onDragEnd(DragEndDetails d) {
    if (_dragOffset >= 55) {
      widget.onSwipe(widget.message);
    }
    setState(() {
      _dragOffset = 0;
      _triggered = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onLongPress: () => widget.onLongPress(widget.message), // Phase 5
      onHorizontalDragUpdate: _onDragUpdate,
      onHorizontalDragEnd: _onDragEnd,
      child: Transform.translate(
        offset: Offset(_dragOffset * (widget.isMe ? -1 : 1), 0),
        child: Stack(
          children: [
            // Reply icon that appears on swipe
            if (_dragOffset > 15)
              Positioned(
                left: widget.isMe ? 12 : null,
                right: widget.isMe ? null : 12,
                top: 0, bottom: 0,
                child: Center(
                  child: Opacity(
                    opacity: (_dragOffset / 55).clamp(0, 1),
                    child: CircleAvatar(
                      radius: 16,
                      backgroundColor: Colors.grey[400],
                      child: const Icon(Icons.reply, color: Colors.white, size: 16),
                    ),
                  ),
                ),
              ),
            _WhatsAppBubble(
              key: widget.bubbleKey,         // Phase 5: used for positioning
              message: widget.message,
              quotedMsg: widget.quotedMsg,
              isMe: widget.isMe,
              currentUserId: widget.currentUserId,
              primaryGreen: widget.primaryGreen,
              accentGreen: widget.accentGreen,
              lightGreen: widget.lightGreen,
              onJoinCall: widget.onJoinCall,
              onAddToCart: widget.onAddToCart,
              onBooking: widget.onBooking,
            ),
          ],
        ),
      ),
    );
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WHATSAPP BUBBLE (Phase 2 + Phase 3)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class _WhatsAppBubble extends StatelessWidget {
  final Map<String, dynamic> message;
  final Map<String, dynamic>? quotedMsg;
  final bool isMe;
  final String? currentUserId;
  final Color primaryGreen;
  final Color accentGreen;
  final Color lightGreen;
  final Function(Map<String, dynamic>) onJoinCall;
  final Function(Map<String, dynamic>) onAddToCart;
  final VoidCallback onBooking;

  const _WhatsAppBubble({
    super.key,
    required this.message,
    this.quotedMsg,
    required this.isMe,
    required this.currentUserId,
    required this.primaryGreen,
    required this.accentGreen,
    required this.lightGreen,
    required this.onJoinCall,
    required this.onAddToCart,
    required this.onBooking,
  });

  @override
  Widget build(BuildContext context) {
    final type    = message['message_type'] ?? 'text';
    final content = message['content'] ?? '';
    final meta    = (message['metadata'] as Map<String, dynamic>?) ?? {};
    final status  = message['status'] ?? 'sent';
    final timeStr = message['created_at'] != null
        ? DateFormat('H:mm').format(DateTime.parse(message['created_at']).toLocal())
        : '';

    final bubbleColor = isMe ? const Color(0xFFE7FFDB) : Colors.white;

    Widget innerContent;
    switch (type) {
      case 'image':
        innerContent = _buildImageContent(context, content);
        break;
      case 'audio':
        innerContent = VoiceMessageWidget(url: content, isMe: isMe, accentColor: accentGreen);
        break;
      case 'call_invite':
        innerContent = _buildCallInvite(content, meta);
        break;
      case 'booking_invite':
        innerContent = _buildBookingCard(content);
        break;
      case 'product_link':
        innerContent = _buildProductCard(content, meta);
        break;
      case 'deleted':
        innerContent = Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.block, size: 16, color: Colors.grey[500]),
            const SizedBox(width: 6),
            Text(
              'تم حذف هذه الرسالة',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[500],
                fontStyle: FontStyle.italic,
              ),
            ),
          ],
        );
        break;
      default:
        innerContent = Text(
          content,

          style: const TextStyle(fontSize: 15, color: Colors.black87, height: 1.4),
        );
    }

    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.78),
        child: CustomPaint(
          painter: _BubbleTailPainter(isMe: isMe, color: bubbleColor),
          child: Container(
            margin: EdgeInsets.only(
              top: 3, bottom: 3,
              left: isMe ? 18 : 6,
              right: isMe ? 6 : 18,
            ),
            padding: const EdgeInsets.fromLTRB(10, 8, 10, 6),
            decoration: BoxDecoration(
              color: bubbleColor,
              borderRadius: BorderRadius.only(
                topLeft: const Radius.circular(14),
                topRight: const Radius.circular(14),
                bottomLeft: Radius.circular(isMe ? 14 : 0),
                bottomRight: Radius.circular(isMe ? 0 : 14),
              ),
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.07), blurRadius: 4, offset: const Offset(0, 2))],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                // Quoted message box (Phase 3)
                if (quotedMsg != null && quotedMsg!.isNotEmpty)
                  _buildQuotedBox(quotedMsg!),
                innerContent,
                // Timestamp + Ticks (Phase 2 + 3)
                Padding(
                  padding: const EdgeInsets.only(top: 4),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Text(timeStr, style: TextStyle(fontSize: 10, color: Colors.black.withValues(alpha: 0.45))),
                      if (isMe) ...[
                        const SizedBox(width: 3),
                        _buildTicks(status),
                      ]
                    ],
                  ),
                ),
                // Reactions Badge (Phase 6)
                if (message['reactions'] != null && (message['reactions'] as Map).isNotEmpty)
                   _buildReactionsBadge(message['reactions'] as Map),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ── Phase 6: Reactions UI ──
  Widget _buildReactionsBadge(Map<dynamic, dynamic> reactions) {
    if (reactions.isEmpty) return const SizedBox.shrink();

    // Sum up total reactions
    int totalCount = 0;
    List<String> emojiList = [];
    reactions.forEach((emoji, users) {
      if (users is List) {
        totalCount += users.length;
        emojiList.add(emoji.toString());
      }
    });

    if (totalCount == 0) return const SizedBox.shrink();

    return Transform.translate(
      offset: const Offset(4, 8), // slightly pop out of the bubble corner
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
          border: Border.all(color: Colors.grey[200]!, width: 0.5),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Display unique emojis (max 3 for clean look)
            ...emojiList.take(3).map((e) => Padding(
              padding: const EdgeInsets.symmetric(horizontal: 1),
              child: Text(e, style: const TextStyle(fontSize: 13)),
            )),
            if (totalCount > 1)
              Padding(
                padding: const EdgeInsets.only(left: 3),
                child: Text(
                  '$totalCount',
                  style: TextStyle(fontSize: 11, color: Colors.grey[700], fontWeight: FontWeight.bold),
                ),
              ),
          ],
        ),
      ),
    );
  }

  // --- Quoted Box ---
  Widget _buildQuotedBox(Map<String, dynamic> quoted) {
    return Container(
      margin: const EdgeInsets.only(bottom: 6),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.black.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(8),
        border: Border(left: BorderSide(color: accentGreen, width: 3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            quoted['sender_id'] == currentUserId ? 'أنت' : 'المعالج',
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: accentGreen),
          ),
          const SizedBox(height: 2),
          Text(
            _getPreview(quoted),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 12, color: Colors.black54),
          ),
        ],
      ),
    );
  }

  String _getPreview(Map<String, dynamic> m) {
    switch (m['message_type']) {
      case 'image':   return '📷 صورة';
      case 'audio':   return '🎤 رسالة صوتية';
      default:        return m['content'] ?? '...';
    }
  }

  // --- WhatsApp Ticks (Phase 3) ---
  Widget _buildTicks(String status) {
    switch (status) {
      case 'read':
        return const Icon(Icons.done_all, size: 15, color: Color(0xFF53BDEB)); // أزرق
      case 'delivered':
        return const Icon(Icons.done_all, size: 15, color: Colors.grey); // رمادي مزدوج
      default: // sent
        return const Icon(Icons.done, size: 15, color: Colors.grey); // رمادي واحد
    }
  }

  Widget _buildImageContent(BuildContext context, String url) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => _FullscreenImageViewer(url: url),
          ),
        );
      },
      child: Hero(
        tag: url,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(10),
          child: Image.network(
            url,
            fit: BoxFit.cover,
            loadingBuilder: (ctx, child, progress) =>
                progress == null ? child : const Center(child: CircularProgressIndicator()),
            errorBuilder: (e, err, stack) => const Icon(Icons.broken_image, size: 60, color: Colors.grey),
          ),
        ),
      ),
    );
  }

  // --- Call Invite ---
  Widget _buildCallInvite(String content, Map<String, dynamic> meta) {
    final isVideo = meta['is_video'] ?? true;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(children: [
          Icon(isVideo ? Icons.videocam : Icons.call, color: Colors.blueAccent, size: 22),
          const SizedBox(width: 8),
          Expanded(child: Text(content, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14))),
        ]),
        if (currentUserId != null) ...[
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () => onJoinCall(meta),
              icon: const Icon(Icons.login, size: 16),
              label: const Text('انضمام للمكالمة'),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.blueAccent, foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(vertical: 8)),
            ),
          ),
        ]
      ],
    );
  }

  // --- Booking Card ---
  Widget _buildBookingCard(String content) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Row(children: [
          Icon(Icons.event_available, color: Colors.orange, size: 18),
          SizedBox(width: 6),
          Text('دعوة حجز جلسة', style: TextStyle(color: Colors.orange, fontWeight: FontWeight.bold, fontSize: 13)),
        ]),
        const SizedBox(height: 6),
        Text(content, style: const TextStyle(fontSize: 13)),
        const SizedBox(height: 10),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: onBooking,
            style: ElevatedButton.styleFrom(backgroundColor: Colors.orange, foregroundColor: Colors.white),
            child: const Text('احجز الموعد الآن', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
          ),
        ),
      ],
    );
  }

  // --- Product Card ---
  Widget _buildProductCard(String content, Map<String, dynamic> meta) {
    final price = meta['price']?.toString() ?? '0';
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(children: [
          const Icon(Icons.medication_liquid_rounded, color: Colors.white, size: 18),
          const SizedBox(width: 6),
          const Text('علاج موصى به', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
        ]),
        const SizedBox(height: 6),
        Text(content, style: const TextStyle(color: Colors.white70, fontSize: 13)),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(8)),
          child: Row(children: [
            Expanded(child: Text(meta['name_ar'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white))),
            Text('$price د.م', style: const TextStyle(color: Colors.yellow, fontWeight: FontWeight.bold)),
          ]),
        ),
        const SizedBox(height: 8),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: () => onAddToCart(meta),
            icon: const Icon(Icons.add_shopping_cart, size: 16),
            label: const Text('إضافة للسلة'),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.white, foregroundColor: primaryGreen),
          ),
        ),
      ],
    );
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BUBBLE TAIL PAINTER (WhatsApp tail shape)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class _BubbleTailPainter extends CustomPainter {
  final bool isMe;
  final Color color;

  const _BubbleTailPainter({required this.isMe, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = color;
    final path = Path();

    if (isMe) {
      // Right tail
      path.moveTo(size.width, 0);
      path.lineTo(size.width + 8, 0);
      path.quadraticBezierTo(size.width + 8, 16, size.width, 14);
      path.close();
    } else {
      // Left tail
      path.moveTo(0, 0);
      path.lineTo(-8, 0);
      path.quadraticBezierTo(-8, 16, 0, 14);
      path.close();
    }
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(_BubbleTailPainter old) => old.isMe != isMe || old.color != color;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VOICE MESSAGE PLAYER WIDGET
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class VoiceMessageWidget extends StatefulWidget {
  final String url;
  final bool isMe;
  final Color accentColor;

  const VoiceMessageWidget({
    super.key,
    required this.url,
    required this.isMe,
    required this.accentColor,
  });

  @override
  State<VoiceMessageWidget> createState() => _VoiceMessageWidgetState();
}

class _VoiceMessageWidgetState extends State<VoiceMessageWidget> {
  final AudioPlayer _player = AudioPlayer();
  bool _isPlaying = false;
  Duration _duration = Duration.zero;
  Duration _position = Duration.zero;

  @override
  void initState() {
    super.initState();
    _player.onDurationChanged.listen((d) => setState(() => _duration = d));
    _player.onPositionChanged.listen((p) => setState(() => _position = p));
    _player.onPlayerComplete.listen((_) => setState(() {
      _isPlaying = false;
      _position = Duration.zero;
    }));
  }

  @override
  void dispose() {
    _player.dispose();
    super.dispose();
  }

  void _togglePlay() async {
    if (_isPlaying) {
      await _player.pause();
    } else {
      await _player.play(UrlSource(widget.url));
    }
    setState(() => _isPlaying = !_isPlaying);
  }

  String _fmt(Duration d) {
    final m = d.inMinutes.remainder(60).toString().padLeft(2, '0');
    final s = d.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  @override
  Widget build(BuildContext context) {
    final maxVal = _duration.inMilliseconds.toDouble();
    final curVal = _position.inMilliseconds.toDouble().clamp(0.0, maxVal > 0 ? maxVal : 1.0);

    return SizedBox(
      width: 210,
      child: Row(
        children: [
          CircleAvatar(
            radius: 18,
            backgroundColor: widget.accentColor,
            child: IconButton(
              padding: EdgeInsets.zero,
              icon: Icon(_isPlaying ? Icons.pause : Icons.play_arrow, color: Colors.white, size: 18),
              onPressed: _togglePlay,
            ),
          ),
          const SizedBox(width: 6),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SliderTheme(
                  data: SliderTheme.of(context).copyWith(
                    trackHeight: 2,
                    thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 5),
                    overlayShape: const RoundSliderOverlayShape(overlayRadius: 10),
                    activeTrackColor: widget.accentColor,
                    inactiveTrackColor: Colors.grey[300],
                    thumbColor: widget.accentColor,
                  ),
                  child: Slider(
                    value: curVal,
                    max: maxVal > 0 ? maxVal : 1.0,
                    onChanged: (v) => _player.seek(Duration(milliseconds: v.toInt())),
                  ),
                ),
                Text(_fmt(_position), style: TextStyle(fontSize: 10, color: Colors.black.withValues(alpha: 0.45))),
              ],
            ),
          ),
          const SizedBox(width: 4),
          const CircleAvatar(radius: 14, backgroundColor: Colors.black12, child: Icon(Icons.person, size: 14, color: Colors.grey)),
        ],
      ),
    );
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FULL SCREEN IMAGE VIEWER (Phase 12)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class _FullscreenImageViewer extends StatelessWidget {
  final String url;
  const _FullscreenImageViewer({required this.url});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        iconTheme: const IconThemeData(color: Colors.white),
        elevation: 0,
      ),
      body: Center(
        child: Hero(
          tag: url,
          child: InteractiveViewer(
            panEnabled: true,
            minScale: 0.5,
            maxScale: 4.0,
            child: Image.network(
              url,
              fit: BoxFit.contain,
              width: double.infinity,
              height: double.infinity,
            ),
          ),
        ),
      ),
    );
  }
}
