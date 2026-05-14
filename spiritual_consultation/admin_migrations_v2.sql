-- ═══════════════════════════════════════════════════════════════
-- BioPara Admin Dashboard — SQL Migrations v2.0
-- Run these in Supabase SQL Editor IN ORDER
-- ═══════════════════════════════════════════════════════════════

-- ── 1. Add missing columns to conversations ─────────────────────
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS last_message TEXT,
  ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS unread_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS patient_report TEXT,
  ADD COLUMN IF NOT EXISTS report_generated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sentiment_score INT;

-- ── 2. Add status column to messages ─────────────────────────────
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'sent';

-- ── 3. Function: auto-update conversations on new message ────────
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations SET
    last_message = NEW.content,
    last_message_at = NEW.created_at,
    unread_count = COALESCE(unread_count, 0) + 1
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── 4. Trigger: fire on every new message ────────────────────────
DROP TRIGGER IF EXISTS on_new_message ON messages;
CREATE TRIGGER on_new_message
AFTER INSERT ON messages
FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- ── 5. RLS Policies: Admin full access ───────────────────────────
-- conversations
DROP POLICY IF EXISTS "Admin full access to conversations" ON conversations;
CREATE POLICY "Admin full access to conversations"
ON conversations FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- messages
DROP POLICY IF EXISTS "Admin full access to messages" ON messages;
CREATE POLICY "Admin full access to messages"
ON messages FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- ── 6. Backfill existing conversations with last message ─────────
UPDATE conversations c SET
  last_message = (
    SELECT content FROM messages m
    WHERE m.conversation_id = c.id
    ORDER BY created_at DESC LIMIT 1
  ),
  last_message_at = (
    SELECT created_at FROM messages m
    WHERE m.conversation_id = c.id
    ORDER BY created_at DESC LIMIT 1
  ),
  unread_count = (
    SELECT COUNT(*) FROM messages m
    WHERE m.conversation_id = c.id
      AND (m.status IS NULL OR m.status = 'sent')
  );
