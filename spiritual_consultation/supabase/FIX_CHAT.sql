-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  💬 BioPara — الإصلاح النهائي الشامل v2 لجداول الدردشة             ║
-- ║  شغّل هذا كاملاً في Supabase SQL Editor                            ║
-- ║  يحل: PGRST205 + RLS + Realtime + رسائل مرئية لكلا الطرفين        ║
-- ╚══════════════════════════════════════════════════════════════════════╝

-- ═══════════════════════════════════════
-- 0. تنظيف وإعادة إنشاء الجداول
-- ═══════════════════════════════════════
DROP TABLE IF EXISTS public.message_reactions CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;

-- إنشاء جدول المحادثات
CREATE TABLE public.conversations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id        UUID NOT NULL,
  consultant_id     UUID,
  status            TEXT NOT NULL DEFAULT 'active',
  last_message      TEXT,
  last_message_at   TIMESTAMPTZ DEFAULT NOW(),
  last_message_type TEXT DEFAULT 'text',
  unread_count      INTEGER NOT NULL DEFAULT 0,
  patient_report    TEXT,
  report_generated_at TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- إنشاء جدول الرسائل — sender_id = TEXT لدعم 'ai_agent'
CREATE TABLE public.messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id       TEXT NOT NULL,   -- TEXT يدعم UUID و'ai_agent'
  content         TEXT NOT NULL DEFAULT '',
  message_type    TEXT NOT NULL DEFAULT 'text',
  file_url        TEXT,
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  is_ai           BOOLEAN NOT NULL DEFAULT FALSE,
  status          TEXT NOT NULL DEFAULT 'sent',
  metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
  reply_to_id     TEXT,  -- TEXT بدل UUID لتفادي FK issues
  reactions       JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_starred      BOOLEAN NOT NULL DEFAULT FALSE,
  is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- 1. Triggers
-- ═══════════════════════════════════════
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS conversations_updated_at ON public.conversations;
CREATE TRIGGER conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS messages_updated_at ON public.messages;
CREATE TRIGGER messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger: تحديث آخر رسالة في المحادثة تلقائياً
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations SET
    last_message      = NEW.content,
    last_message_at   = NEW.created_at,
    last_message_type = NEW.message_type,
    unread_count      = COALESCE(unread_count, 0) + 1,
    updated_at        = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_new_message ON public.messages;
CREATE TRIGGER on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_conversation_last_message();

-- ═══════════════════════════════════════
-- 2. دالة التحقق من المسؤول
-- ═══════════════════════════════════════
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE v_is_admin BOOLEAN := FALSE;
BEGIN
  SELECT COALESCE(is_admin, FALSE) INTO v_is_admin
  FROM public.profiles WHERE id = auth.uid();
  RETURN COALESCE(v_is_admin, FALSE);
EXCEPTION WHEN OTHERS THEN
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ═══════════════════════════════════════
-- 3. RLS Policies — مفتوحة لأي مستخدم مُصادَق
-- ═══════════════════════════════════════

-- Conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "conv_open_access" ON public.conversations;
DROP POLICY IF EXISTS "conv_all_access" ON public.conversations;
CREATE POLICY "conv_open_access" ON public.conversations
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Messages: مفتوح لأي مستخدم مُصادَق
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_open_access" ON public.messages;
DROP POLICY IF EXISTS "messages_all_access" ON public.messages;
CREATE POLICY "messages_open_access" ON public.messages
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- ═══════════════════════════════════════
-- 4. Realtime — تفعيل البث المباشر
-- ═══════════════════════════════════════
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    public.conversations,
    public.messages;
COMMIT;

-- تفعيل Realtime REPLICA IDENTITY لتلقي تفاصيل التحديث
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.conversations REPLICA IDENTITY FULL;

-- ═══════════════════════════════════════
-- 5. مزامنة profiles
-- ═══════════════════════════════════════
INSERT INTO public.profiles (id, full_name)
SELECT 
  id, 
  COALESCE(
    NULLIF(raw_user_meta_data->>'full_name', ''),
    NULLIF(split_part(email, '@', 1), ''),
    'مستخدم'   -- قيمة افتراضية إذا كان الاسم فارغاً
  )
FROM auth.users
ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name
  WHERE public.profiles.full_name IS NULL OR public.profiles.full_name = '';

-- تعيين المسؤول
UPDATE public.profiles SET is_admin = TRUE
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'ilyasseelmoussaoui890@gmail.com' 
  LIMIT 1
);

-- ═══════════════════════════════════════
-- 6. تحديث schema cache — يحل PGRST205
-- ═══════════════════════════════════════
NOTIFY pgrst, 'reload schema';

-- ═══════════════════════════════════════
-- ✅ تحقق
-- ═══════════════════════════════════════
SELECT 'conversations' AS tbl, COUNT(*) AS count FROM public.conversations
UNION ALL
SELECT 'messages', COUNT(*) FROM public.messages
UNION ALL  
SELECT 'profiles_admins', COUNT(*) FROM public.profiles WHERE is_admin = TRUE;
