-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  🛠️ BioPara — إصلاح الأعمدة المفقودة في جدول الرسائل دون مسح البيانات ║
-- ║  انسخ هذا الكود بالكامل وشغّله في Supabase SQL Editor                 ║
-- ╚══════════════════════════════════════════════════════════════════════╝

-- 1. إضافة الأعمدة المفقودة لجدول الرسائل (messages) بأمان دون التأثير على البيانات الحالية
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS reply_to_id TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS reactions JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS is_starred BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- 2. تفعيل التحديث التلقائي للوقت عند تعديل الرسائل (اختياري وآمن)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS messages_updated_at ON public.messages;
CREATE TRIGGER messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3. تحديث الكاش الخاص بـ PostgREST لتفعيل الأعمدة الجديدة فوراً
NOTIFY pgrst, 'reload schema';
