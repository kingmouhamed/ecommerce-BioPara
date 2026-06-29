-- ════════════════════════════════════════════════════════════
--  BioPara — تتبّع منصة الأدمن النشطة (للتوجيه الهجين للمكالمات)
--  mobile  → المريض يتصل عبر ZegoCloud الأصلي
--  windows → المريض يتصل عبر Jitsi (CallOverlay)
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.admin_presence (
  admin_id   UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  platform   TEXT NOT NULL DEFAULT 'mobile',   -- 'mobile' | 'windows' | 'web'
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_presence ENABLE ROW LEVEL SECURITY;

-- أي مستخدم مُصادَق يقدر يقرأ (المريض محتاج يعرف منصة الأدمن قبل المكالمة)
DROP POLICY IF EXISTS "admin_presence_read" ON public.admin_presence;
CREATE POLICY "admin_presence_read" ON public.admin_presence
  FOR SELECT USING (auth.role() = 'authenticated');

-- الأدمن فقط يقدر يكتب/يحدّث صفّه
DROP POLICY IF EXISTS "admin_presence_insert" ON public.admin_presence;
CREATE POLICY "admin_presence_insert" ON public.admin_presence
  FOR INSERT WITH CHECK (auth.uid() = admin_id);

DROP POLICY IF EXISTS "admin_presence_update" ON public.admin_presence;
CREATE POLICY "admin_presence_update" ON public.admin_presence
  FOR UPDATE USING (auth.uid() = admin_id);

NOTIFY pgrst, 'reload schema';
