import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

// ─────────────────────────────────────────────────────────────
// showMessageContextMenu
//
// Call this from chat_screen when a bubble is long-pressed.
// [context]     — BuildContext from the ListView item
// [message]     — the message map from Supabase
// [isMe]        — whether the current user sent it
// [bubbleKey]   — a GlobalKey attached to the bubble so we can
//                 position the popup relative to it
// [onReply]     — callback that triggers Phase-3 swipe-to-reply
// ─────────────────────────────────────────────────────────────
Future<void> showMessageContextMenu({
  required BuildContext context,
  required Map<String, dynamic> message,
  required bool isMe,
  required GlobalKey bubbleKey,
  required void Function(Map<String, dynamic>) onReply,
  required void Function(String) onReaction,
  required VoidCallback onDelete, // Phase 6
}) {
  // ── calculate bubble position on screen ──
  final box = bubbleKey.currentContext?.findRenderObject() as RenderBox?;
  final overlay = Overlay.of(context).context.findRenderObject() as RenderBox?;
  Offset bubbleOffset = Offset.zero;
  Size   bubbleSize   = Size.zero;

  if (box != null && overlay != null) {
    bubbleOffset = box.localToGlobal(Offset.zero, ancestor: overlay);
    bubbleSize   = box.size;
  }

  return showGeneralDialog(
    context: context,
    barrierDismissible: true,
    barrierLabel: 'dismiss',
    barrierColor: Colors.black54,
    transitionDuration: const Duration(milliseconds: 180),
    transitionBuilder: (ctx, anim, _, child) => FadeTransition(
      opacity: CurvedAnimation(parent: anim, curve: Curves.easeOut),
      child: child,
    ),
    pageBuilder: (ctx, animation, secondaryAnimation) => _MessageContextOverlay(
      message:      message,
      isMe:         isMe,
      bubbleOffset: bubbleOffset,
      bubbleSize:   bubbleSize,
      onReply:      onReply,
      onReaction:   onReaction,
      onDelete:     onDelete, // Phase 6
    ),
  );
}

// ─────────────────────────────────────────────────────────────
// _MessageContextOverlay  (internal)
// ─────────────────────────────────────────────────────────────
class _MessageContextOverlay extends StatelessWidget {
  final Map<String, dynamic> message;
  final bool isMe;
  final Offset bubbleOffset;
  final Size   bubbleSize;
  final void Function(Map<String, dynamic>) onReply;
  final void Function(String) onReaction;
  final VoidCallback onDelete; // Phase 6

  const _MessageContextOverlay({
    required this.message,
    required this.isMe,
    required this.bubbleOffset,
    required this.bubbleSize,
    required this.onReply,
    required this.onReaction,
    required this.onDelete, // Phase 6
  });

  // ── Brand colours ──
  static const _green = Color(0xFF1B5E20);
  static const _red   = Colors.red;

  @override
  Widget build(BuildContext context) {
    final screenH   = MediaQuery.of(context).size.height;
    final screenW   = MediaQuery.of(context).size.width;
    final content   = message['content'] as String? ?? '';
    final type      = message['message_type'] as String? ?? 'text';

    // Determine vertical anchor for the popup:
    // if bubble is in lower half → show popup ABOVE it, else BELOW.
    final showAbove = bubbleOffset.dy > screenH / 2;

    // Horizontal: align popup to left/right edge of bubble
    double popupLeft = isMe
        ? (bubbleOffset.dx + bubbleSize.width - 260).clamp(8, screenW - 268)
        : bubbleOffset.dx.clamp(8, screenW - 268);

    double popupTop;
    if (showAbove) {
      // emoji pill + menu (≈260px total) above bubble
      popupTop = (bubbleOffset.dy - 280).clamp(8, screenH - 290);
    } else {
      // below bubble
      popupTop = (bubbleOffset.dy + bubbleSize.height + 8).clamp(8, screenH - 290);
    }

    return Material(
      color: Colors.transparent,
      child: Stack(
        children: [
          // ── tap anywhere to dismiss ──
          Positioned.fill(
            child: GestureDetector(
              onTap: () => Navigator.pop(context),
              behavior: HitTestBehavior.opaque,
              child: const SizedBox.shrink(),
            ),
          ),

          // ── emoji pill ──
          Positioned(
            left:  popupLeft,
            top:   showAbove ? popupTop : popupTop,
            child: _EmojiPill(
              onEmojiTap: (emoji) {
                Navigator.pop(context);
                onReaction(emoji); // Trigger backend update
              },
            ),
          ),

          // ── actions menu ──
          Positioned(
            left:  popupLeft,
            top:   showAbove ? popupTop + 56 : popupTop + 56,
            child: _ActionsMenu(
              actions: [
                _MenuAction(
                  icon: Icons.reply,
                  label: 'رد',
                  color: _green,
                  onTap: () {
                    Navigator.pop(context);
                    onReply(message);
                  },
                ),
                if (type == 'text')
                  _MenuAction(
                    icon: Icons.copy,
                    label: 'نسخ',
                    color: Colors.blueGrey,
                    onTap: () {
                      Navigator.pop(context);
                      Clipboard.setData(ClipboardData(text: content));
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('✅ تم نسخ الرسالة'),
                          duration: Duration(seconds: 1),
                          behavior: SnackBarBehavior.floating,
                        ),
                      );
                    },
                  ),
                _MenuAction(
                  icon: Icons.delete_outline,
                  label: 'حذف',
                  color: _red,
                  onTap: () {
                    Navigator.pop(context);
                    // Show confirmation
                    _showDeleteConfirm(context, onDelete);
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showDeleteConfirm(BuildContext context, VoidCallback onConfirm) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('حذف الرسالة؟', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        content: const Text('هل تريد حذف هذه الرسالة لدى الجميع؟'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('إلغاء', style: TextStyle(color: Colors.grey))),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              onConfirm();
            },
            child: const Text('حذف لدى الجميع', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Emoji Pill Widget
// ─────────────────────────────────────────────────────────────
class _EmojiPill extends StatelessWidget {
  final void Function(String) onEmojiTap;
  static const _emojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

  const _EmojiPill({required this.onEmojiTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 48,
      padding: const EdgeInsets.symmetric(horizontal: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(30),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.18),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          ..._emojis.map(
            (e) => GestureDetector(
              onTap: () => onEmojiTap(e),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 5),
                child: Text(e, style: const TextStyle(fontSize: 24)),
              ),
            ),
          ),
          const SizedBox(width: 4),
          GestureDetector(
            onTap: () => onEmojiTap('+'),
            child: Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: Colors.grey[200],
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.add, size: 18, color: Colors.black54),
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Actions Menu Widget
// ─────────────────────────────────────────────────────────────
class _ActionsMenu extends StatelessWidget {
  final List<_MenuAction> actions;
  const _ActionsMenu({required this.actions});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 220,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.18),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(14),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: actions.asMap().entries.map((entry) {
            final i      = entry.key;
            final action = entry.value;
            final isLast = i == actions.length - 1;
            return Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                _ActionTile(action: action),
                if (!isLast)
                  Divider(height: 1, thickness: 0.5, color: Colors.grey[200]),
              ],
            );
          }).toList(),
        ),
      ),
    );
  }
}

class _ActionTile extends StatelessWidget {
  final _MenuAction action;
  const _ActionTile({required this.action});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: action.onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 13),
        child: Row(
          children: [
            Icon(action.icon, size: 20, color: action.color),
            const SizedBox(width: 14),
            Text(
              action.label,
              style: TextStyle(
                fontSize: 15,
                color: action.color == Colors.red ? Colors.red : Colors.black87,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Data class for a menu action
// ─────────────────────────────────────────────────────────────
class _MenuAction {
  final IconData    icon;
  final String      label;
  final Color       color;
  final VoidCallback onTap;
  const _MenuAction({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });
}
