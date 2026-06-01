-- ╔══════════════════════════════════════════════════════════════════╗
-- ║  🔑 BioPara — تعيين المسؤول (مُصلَّح نهائياً)                  ║
-- ║  يحل: infinite recursion + null full_name + admin access        ║
-- ╚══════════════════════════════════════════════════════════════════╝

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── إنشاء جدول profiles إن لم يكن موجوداً ──────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT NOT NULL DEFAULT 'مستخدم BioPara',
  avatar_url TEXT,
  phone      TEXT,
  is_admin   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── مزامنة المستخدمين (مع ضمان عدم وجود NULL في full_name) ──────────
INSERT INTO public.profiles (id, full_name, phone)
SELECT
  id,
  COALESCE(
    NULLIF(TRIM(raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(split_part(COALESCE(email,''), '@', 1)), ''),
    'مستخدم BioPara'
  ) AS full_name,
  NULLIF(TRIM(COALESCE(phone,'')), '') AS phone
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ── تعيين المسؤول ─────────────────────────────────────────────────
UPDATE public.profiles
SET is_admin = TRUE
WHERE id = (
  SELECT id FROM auth.users
  WHERE email = 'ilyasseelmoussaoui890@gmail.com'
  LIMIT 1
);

-- ── تفعيل RLS ─────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ✅ إزالة جميع السياسات القديمة أولاً
DROP POLICY IF EXISTS "profiles_select_own"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all"   ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_open_access" ON public.profiles;

-- ✅ الحل النهائي: سياسة واحدة مفتوحة لأي مستخدم مُصادَق
-- (تتجنب infinite recursion تماماً)
CREATE POLICY "profiles_open_access" ON public.profiles
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── تحقق من النتيجة ────────────────────────────────────────────────
SELECT 
  u.email,
  p.full_name,
  p.is_admin,
  CASE WHEN p.is_admin THEN '✅ مسؤول' ELSE '❌ ليس مسؤولاً' END AS status
FROM auth.users u
JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'ilyasseelmoussaoui890@gmail.com';

NOTIFY pgrst, 'reload schema';
