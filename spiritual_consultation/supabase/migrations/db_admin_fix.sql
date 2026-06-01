-- ═══════════════════════════════════════════════════════════════════
-- 🌿 BioPara Spiritual — الحل النهائي الخالي تماماً من التكرار (v4 - Bulletproof Fix)
-- ═══════════════════════════════════════════════════════════════════
-- قم بتشغيل هذا الملف بالكامل في محرر SQL الخاص بـ Supabase (SQL Editor)
-- ═══════════════════════════════════════════════════════════════════

-- ── 1. تحديث بيانات المستخدم في جدول auth.users الداخلي لتعيين صلاحية الأدمن ──
-- نقوم بدمج صلاحية الأدمن داخل حقل raw_app_meta_data الخاص بنظام الحماية الداخلي لـ Supabase
UPDATE auth.users
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"is_admin": true}'::jsonb
WHERE id = 'c6367cb8-a62c-4aed-b743-3ee0ff6e4937';

-- ── 2. إعادة تعريف دالة التحقق (is_admin) للاستعلام من جدول auth.users الداخلي ──
-- جدول auth.users هو جدول داخلي محمي ولا يمكن تفعيل RLS عليه، وبالتالي فإن الاستعلام
-- منه مستحيل أن يتسبب في أي تكرار لانهائي (Recursion) على الإطلاق!
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  v_is_admin BOOLEAN;
BEGIN
  -- نستعلم مباشرة من جدول الحماية الداخلي auth.users
  SELECT COALESCE((raw_app_meta_data ->> 'is_admin')::boolean, FALSE) INTO v_is_admin
  FROM auth.users
  WHERE id = auth.uid();
  
  RETURN COALESCE(v_is_admin, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 3. تنظيف وإلغاء جميع السياسات القديمة والمسببة للتكرار اللانهائي ──
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;
DROP POLICY IF EXISTS "Admin reads all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete" ON public.profiles;

-- ── 4. تفعيل سياسات حماية جديدة كلياً ونظيفة لـ profiles ──
-- هذه السياسات الآن آمنة 100% لأنها تستعلم من auth.users وتمنع التكرار نهائياً

CREATE POLICY "profiles_select" ON public.profiles FOR SELECT
  USING (
    auth.uid() = id 
    OR 
    public.is_admin()
  );

CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE
  USING (
    auth.uid() = id 
    OR 
    public.is_admin()
  );

CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT
  WITH CHECK (
    auth.uid() = id 
    OR 
    public.is_admin()
  );

CREATE POLICY "profiles_delete" ON public.profiles FOR DELETE
  USING (
    public.is_admin()
  );

-- ── 5. تأكيد البيانات في جدول profiles و users للمسؤول ──
INSERT INTO public.profiles (id, full_name, is_admin)
VALUES ('c6367cb8-a62c-4aed-b743-3ee0ff6e4937', 'مدير BioPara', TRUE)
ON CONFLICT (id) DO UPDATE
SET is_admin = TRUE;

INSERT INTO public.users (id, email, role)
VALUES ('c6367cb8-a62c-4aed-b743-3ee0ff6e4937', 'ilyasseelmoussaoui890@gmail.com', 'admin')
ON CONFLICT (id) DO UPDATE
SET role = 'admin';

-- ── 6. تحديث ذاكرة التخزين المؤقت للـ API ──
NOTIFY pgrst, 'reload schema';
