-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  🌿 BioPara Spiritual — قاعدة البيانات الكاملة والنهائية           ║
-- ║  انسخ هذا الملف بالكامل وشغّله في Supabase SQL Editor مرة واحدة   ║
-- ╚══════════════════════════════════════════════════════════════════════╝

-- ══════════════════════════════════════════════════════════════════════
-- 0. تنظيف شامل لتجنب أي تعارض (DROP بالترتيب الصحيح)
-- ══════════════════════════════════════════════════════════════════════

-- حذف الـ Triggers أولاً
DROP TRIGGER IF EXISTS on_new_message       ON public.messages;
DROP TRIGGER IF EXISTS on_review_change     ON public.reviews;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS profiles_updated_at  ON public.profiles;
DROP TRIGGER IF EXISTS categories_updated_at ON public.categories;
DROP TRIGGER IF EXISTS orders_updated_at    ON public.orders;
DROP TRIGGER IF EXISTS reviews_updated_at   ON public.reviews;
DROP TRIGGER IF EXISTS conversations_updated_at ON public.conversations;

-- حذف الجداول بالترتيب الصحيح (من الأبناء إلى الآباء)
DROP TABLE IF EXISTS public.notifications  CASCADE;
DROP TABLE IF EXISTS public.reviews        CASCADE;
DROP TABLE IF EXISTS public.wishlists      CASCADE;
DROP TABLE IF EXISTS public.appointments   CASCADE;
DROP TABLE IF EXISTS public.order_items    CASCADE;
DROP TABLE IF EXISTS public.orders         CASCADE;
DROP TABLE IF EXISTS public.messages       CASCADE;
DROP TABLE IF EXISTS public.conversations  CASCADE;
DROP TABLE IF EXISTS public.products       CASCADE;
DROP TABLE IF EXISTS public.categories     CASCADE;
DROP TABLE IF EXISTS public.profiles       CASCADE;

-- حذف الدوال
DROP FUNCTION IF EXISTS public.handle_updated_at()          CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user()            CASCADE;
DROP FUNCTION IF EXISTS public.is_admin()                   CASCADE;
DROP FUNCTION IF EXISTS public.update_conversation_last_message() CASCADE;
DROP FUNCTION IF EXISTS public.update_product_rating()      CASCADE;

-- ══════════════════════════════════════════════════════════════════════
-- 1. تفعيل الامتدادات
-- ══════════════════════════════════════════════════════════════════════
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ══════════════════════════════════════════════════════════════════════
-- 2. الدوال المساعدة (Utility Functions)
-- ══════════════════════════════════════════════════════════════════════

-- دالة التحديث التلقائي لـ updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- دالة التحقق من صلاحية المسؤول (آمنة ضد التكرار اللانهائي)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  v_is_admin BOOLEAN := FALSE;
BEGIN
  SELECT COALESCE((raw_app_meta_data->>'is_admin')::boolean, FALSE)
  INTO v_is_admin
  FROM auth.users
  WHERE id = auth.uid();
  RETURN COALESCE(v_is_admin, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- دالة إنشاء ملف شخصي تلقائي عند التسجيل
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'مستخدم BioPara'),
    NEW.phone
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ══════════════════════════════════════════════════════════════════════
-- 3. جدول الملفات الشخصية (Profiles) — الجدول الأساسي
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL DEFAULT 'مستخدم BioPara',
  avatar_url  TEXT,
  bio         TEXT,
  phone       TEXT,
  is_admin    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger: إنشاء profile عند تسجيل مستخدم جديد
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ══════════════════════════════════════════════════════════════════════
-- 4. جدول الفئات (Categories)
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE public.categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,
  slug        TEXT UNIQUE,
  description TEXT DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ══════════════════════════════════════════════════════════════════════
-- 5. جدول المنتجات (Products)
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE public.products (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  description     TEXT DEFAULT '',
  price           NUMERIC(10,2) NOT NULL DEFAULT 0,
  original_price  NUMERIC(10,2),
  category        TEXT NOT NULL DEFAULT 'أعشاب طبية',
  category_id     UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url       TEXT,
  images          JSONB DEFAULT '[]'::jsonb,
  stock_quantity  INTEGER NOT NULL DEFAULT 0,
  rating          NUMERIC(3,1) NOT NULL DEFAULT 0,
  reviews_count   INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
  tags            TEXT[] DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category   ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active     ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured   ON public.products(is_featured);

-- ══════════════════════════════════════════════════════════════════════
-- 6. جدول المحادثات (Conversations)
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE public.conversations (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consultant_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status              TEXT NOT NULL DEFAULT 'active' 
                        CHECK (status IN ('active', 'archived', 'closed')),
  last_message        TEXT,
  last_message_at     TIMESTAMPTZ,
  last_message_type   TEXT DEFAULT 'text',
  unread_count        INTEGER NOT NULL DEFAULT 0,
  patient_report      TEXT,
  report_generated_at TIMESTAMPTZ,
  sentiment_score     INTEGER DEFAULT 5,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_conversations_patient    ON public.conversations(patient_id);
CREATE INDEX IF NOT EXISTS idx_conversations_consultant ON public.conversations(consultant_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated    ON public.conversations(updated_at DESC);

-- ══════════════════════════════════════════════════════════════════════
-- 7. جدول الرسائل (Messages) — الجدول الأهم
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE public.messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id       TEXT NOT NULL,  -- TEXT لدعم UUIDs و'ai_agent'
  content         TEXT NOT NULL DEFAULT '',
  message_type    TEXT NOT NULL DEFAULT 'text',
                  -- text | image | audio | video | document | callInvite | call_invite | product
  file_url        TEXT,
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  is_ai           BOOLEAN NOT NULL DEFAULT FALSE,
  status          TEXT NOT NULL DEFAULT 'sent',
                  -- sent | delivered | read | ringing | error
  metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at  ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender      ON public.messages(sender_id);

-- Trigger: تحديث المحادثة تلقائياً عند إضافة رسالة
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

CREATE TRIGGER on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_conversation_last_message();

-- ══════════════════════════════════════════════════════════════════════
-- 8. جدول الطلبات (Orders)
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE public.orders (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
  total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  notes       TEXT,
  address     TEXT,
  phone       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status  ON public.orders(status);

-- ══════════════════════════════════════════════════════════════════════
-- 9. جدول عناصر الطلب (Order Items)
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE public.order_items (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id     UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id   UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  price        NUMERIC(10,2) NOT NULL,
  quantity     INTEGER NOT NULL DEFAULT 1,
  image_url    TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- ══════════════════════════════════════════════════════════════════════
-- 10. جدول المواعيد (Appointments)
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE public.appointments (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_date TIMESTAMPTZ NOT NULL,
  session_type     TEXT DEFAULT 'chat'
                     CHECK (session_type IN ('video','audio','chat')),
  duration_minutes INTEGER DEFAULT 30,
  status           TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending','confirmed','completed','cancelled')),
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date    ON public.appointments(appointment_date);

-- ══════════════════════════════════════════════════════════════════════
-- 11. جدول قائمة الأماني (Wishlists)
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE public.wishlists (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlists_user ON public.wishlists(user_id);

-- ══════════════════════════════════════════════════════════════════════
-- 12. جدول تقييمات المنتجات (Reviews)
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE public.reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger: تحديث تقييم المنتج تلقائياً
CREATE OR REPLACE FUNCTION public.update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products SET
    rating        = (SELECT ROUND(AVG(rating)::NUMERIC, 1) FROM public.reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)),
    reviews_count = (SELECT COUNT(*) FROM public.reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id))
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_product_rating();

-- ══════════════════════════════════════════════════════════════════════
-- 13. جدول الإشعارات (Notifications)
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  type        TEXT DEFAULT 'general',
  data        JSONB DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user  ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id) WHERE is_read = FALSE;

-- ══════════════════════════════════════════════════════════════════════
-- 14. سياسات RLS (Row Level Security)
-- ══════════════════════════════════════════════════════════════════════

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "profiles_update_own_or_admin" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "profiles_insert_own_or_admin" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id OR public.is_admin());
CREATE POLICY "profiles_delete_admin" ON public.profiles
  FOR DELETE USING (public.is_admin());

-- Categories — للجميع قراءة، فقط الأدمن يكتب
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_read_all"  ON public.categories FOR SELECT USING (TRUE);
CREATE POLICY "categories_admin_all" ON public.categories FOR ALL    USING (public.is_admin());

-- Products — للجميع قراءة المنتجات النشطة، الأدمن يملك صلاحيات كاملة
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_read_active"  ON public.products FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "products_admin_write"  ON public.products FOR ALL    USING (public.is_admin());

-- Conversations — المريض يرى محادثته، الأدمن يرى الكل
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "conversations_access" ON public.conversations FOR ALL
  USING (
    patient_id = auth.uid()
    OR consultant_id = auth.uid()
    OR public.is_admin()
  );
-- السماح للمريض بإنشاء محادثة بـ patient_id الخاص به
CREATE POLICY "conversations_insert_patient" ON public.conversations FOR INSERT
  WITH CHECK (patient_id = auth.uid() OR public.is_admin());

-- Messages — ✅ سياسة مرنة تدعم ai_agent وجميع الحالات
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_access" ON public.messages FOR ALL
  USING (
    -- المرسل نفسه يمكنه الوصول (بما في ذلك ai_agent يُكتب بـ SECURITY DEFINER)
    sender_id = auth.uid()::text
    -- أو المستخدم طرف في المحادثة
    OR EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
        AND (c.patient_id = auth.uid() OR c.consultant_id = auth.uid())
    )
    -- أو الأدمن
    OR public.is_admin()
  );

-- ✅ سياسة إدراج مرنة تتيح للمريض والأدمن وفانكشنات SECURITY DEFINER الإدراج
CREATE POLICY "messages_insert_access" ON public.messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
        AND (c.patient_id = auth.uid() OR c.consultant_id = auth.uid())
    )
    OR public.is_admin()
  );

-- Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_own"       ON public.orders FOR ALL USING (user_id = auth.uid() OR public.is_admin());

-- Order Items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_items_access" ON public.order_items FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.is_admin()))
  );

-- Appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "appointments_own" ON public.appointments FOR ALL
  USING (patient_id = auth.uid() OR public.is_admin());

-- Wishlists
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wishlists_own" ON public.wishlists FOR ALL USING (user_id = auth.uid());

-- Reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_read_all"   ON public.reviews FOR SELECT USING (TRUE);
CREATE POLICY "reviews_own_write"  ON public.reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "reviews_own_update" ON public.reviews FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "reviews_own_delete" ON public.reviews FOR DELETE USING (user_id = auth.uid() OR public.is_admin());

-- Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_own" ON public.notifications FOR ALL
  USING (user_id = auth.uid() OR public.is_admin());

-- ══════════════════════════════════════════════════════════════════════
-- 15. Storage Buckets
-- ══════════════════════════════════════════════════════════════════════
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars',    'avatars',    TRUE,  5242880,  ARRAY['image/jpeg','image/png','image/webp']),
  ('products',   'products',   TRUE,  10485760, ARRAY['image/jpeg','image/png','image/webp']),
  ('chat_media', 'chat_media', FALSE, 52428800, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- سياسات Storage
DROP POLICY IF EXISTS "avatars_upload"    ON storage.objects;
DROP POLICY IF EXISTS "avatars_read"      ON storage.objects;
DROP POLICY IF EXISTS "avatars_update"    ON storage.objects;
DROP POLICY IF EXISTS "products_read"     ON storage.objects;
DROP POLICY IF EXISTS "chat_media_auth"   ON storage.objects;
DROP POLICY IF EXISTS "chat_media_delete" ON storage.objects;

CREATE POLICY "avatars_upload"    ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);
CREATE POLICY "avatars_read"      ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "avatars_update"    ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);
CREATE POLICY "products_read"     ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "chat_media_auth"   ON storage.objects FOR ALL    USING (bucket_id = 'chat_media' AND auth.uid() IS NOT NULL);

-- ══════════════════════════════════════════════════════════════════════
-- 16. بيانات أولية (Seed Data)
-- ══════════════════════════════════════════════════════════════════════

-- مزامنة ملفات شخصية للمستخدمين الموجودين
INSERT INTO public.profiles (id, full_name, phone)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'full_name', 'مستخدم BioPara'), 
  phone
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- تعيين حساب الأدمن (استبدل UUID بالـ UUID الصحيح لحسابك الإداري)
-- UPDATE auth.users 
-- SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"is_admin": true}'::jsonb
-- WHERE email = 'admin@biopara.com';

-- فئات المنتجات الافتراضية
INSERT INTO public.categories (name, slug, description) VALUES
  ('أعشاب طبية', 'herbs', 'أعشاب طبية طبيعية 100%'),
  ('شاي الأعشاب', 'herbal-tea', 'شاي مستخلص من أجود الأعشاب'),
  ('مكملات غذائية', 'supplements', 'مكملات غذائية طبيعية'),
  ('زيوت طبية', 'oils', 'زيوت عطرية وطبية طبيعية'),
  ('عسل طبيعي', 'honey', 'أنواع العسل الطبيعي الأصيل')
ON CONFLICT (name) DO NOTHING;

-- ══════════════════════════════════════════════════════════════════════
-- 17. إعادة تحميل كاش Supabase API
-- ══════════════════════════════════════════════════════════════════════
NOTIFY pgrst, 'reload schema';

-- ══════════════════════════════════════════════════════════════════════
-- ✅ تم إنشاء قاعدة البيانات بنجاح!
-- للتحقق: SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
-- ══════════════════════════════════════════════════════════════════════
