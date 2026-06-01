-- ═══════════════════════════════════════════════════
--  0. تنظيف قاعدة البيانات (Reset) لتفادي أي أخطاء تكرار
-- ═══════════════════════════════════════════════════
DROP TABLE IF EXISTS 
  public.notifications, 
  public.reviews, 
  public.wishlists, 
  public.appointments, 
  public.order_items, 
  public.orders, 
  public.intake_forms, 
  public.consultations, 
  public.messages, 
  public.conversations, 
  public.products, 
  public.categories, 
  public.users, 
  public.profiles 
CASCADE;

-- ═══════════════════════════════════════════════════
--  BioPara Spiritual — قاعدة البيانات الكاملة
--  Supabase Migration: init_schema.sql
-- ═══════════════════════════════════════════════════

-- ─── تفعيل الامتدادات ───────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- تحديث تلقائي لـ updated_at (دالة مشتركة)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════
--  1. جدول الملفات الشخصية (Profiles)
-- ═══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.profiles (
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

-- إنشاء ملف شخصي عند التسجيل تلقائياً
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- دالة للتحقق من هوية المسؤول بشكل آمن دون حدوث تكرار لا نهائي (RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ═══════════════════════════════════════════════════
--  2. جدول المستخدمين المخصص (Users)
-- ═══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT UNIQUE,
  role        TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('admin', 'patient', 'consultant')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ═══════════════════════════════════════════════════
--  3. جدول الفئات (Categories)
-- ═══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.categories (
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

-- ═══════════════════════════════════════════════════
--  4. جدول المنتجات (Products)
-- ═══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.products (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  description     TEXT DEFAULT '',
  price           NUMERIC(10,2) NOT NULL DEFAULT 0,
  category        TEXT NOT NULL DEFAULT 'أعشاب طبية',
  category_id     UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url       TEXT,
  stock_quantity  INTEGER NOT NULL DEFAULT 0,
  rating          NUMERIC(3,1) NOT NULL DEFAULT 0,
  reviews_count   INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active   ON public.products(is_active);

-- ═══════════════════════════════════════════════════
--  5. جدول المحادثات (Conversations)
-- ═══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.conversations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  consultant_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_conversations_patient ON public.conversations(patient_id);
CREATE INDEX IF NOT EXISTS idx_conversations_consultant ON public.conversations(consultant_id);

-- ═══════════════════════════════════════════════════
--  6. جدول الرسائل (Messages)
-- ═══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content         TEXT,
  type            TEXT NOT NULL DEFAULT 'text', -- text | image | audio | video | file | ai
  file_url        TEXT,
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  is_ai           BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at  ON public.messages(created_at DESC);

-- ═══════════════════════════════════════════════════
--  7. جدول الاستشارات (Consultations)
-- ═══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.consultations (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  consultant_id    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  scheduled_at     TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes            TEXT,
  price            NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER consultations_updated_at
  BEFORE UPDATE ON public.consultations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_consultations_patient ON public.consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_date ON public.consultations(scheduled_at);

-- ═══════════════════════════════════════════════════
--  8. جدول نماذج الإدخال الطبي (Intake Forms)
-- ═══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.intake_forms (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id UUID NOT NULL REFERENCES public.consultations(id) ON DELETE CASCADE,
  patient_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  medical_history TEXT,
  symptoms        TEXT,
  lifestyle_notes TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER intake_forms_updated_at
  BEFORE UPDATE ON public.intake_forms
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_intake_forms_consultation ON public.intake_forms(consultation_id);

-- ═══════════════════════════════════════════════════
--  9. جدول الطلبات (Orders)
-- ═══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.orders (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
  total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

-- ═══════════════════════════════════════════════════
--  10. جدول عناصر الطلب (Order Items)
-- ═══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.order_items (
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

-- ═══════════════════════════════════════════════════
--  11. جدول المواعيد (Appointments - Legacy)
-- ═══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.appointments (
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

CREATE INDEX IF NOT EXISTS idx_appointments_patient   ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date      ON public.appointments(appointment_date);

-- ═══════════════════════════════════════════════════
--  12. جدول قائمة الأماني (Wishlists)
-- ═══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.wishlists (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlists_user ON public.wishlists(user_id);

-- ═══════════════════════════════════════════════════
--  13. جدول تقييمات المنتجات الموحد (Reviews)
-- ═══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.reviews (
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

-- تحديث تلقائي لـ rating و reviews_count في جدول المنتجات
CREATE OR REPLACE FUNCTION public.update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET
    rating        = (SELECT ROUND(AVG(rating)::NUMERIC, 1) FROM public.reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)),
    reviews_count = (SELECT COUNT(*) FROM public.reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id))
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_product_rating();

-- ═══════════════════════════════════════════════════
--  14. جدول الإشعارات (Notifications)
-- ═══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  type        TEXT DEFAULT 'general', -- general | order | consultation | message
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id) WHERE is_read = FALSE;

-- ═══════════════════════════════════════════════════
--  15. RLS — Row Level Security (حماية البيانات)
-- ═══════════════════════════════════════════════════

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own"   ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own"   ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_admin_all"    ON public.profiles FOR ALL
  USING (public.is_admin());

-- Users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_select_own"   ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own"   ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "users_admin_all"    ON public.users FOR ALL
  USING (public.is_admin());

-- Categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_read_all" ON public.categories FOR SELECT USING (TRUE);
CREATE POLICY "categories_admin_all" ON public.categories FOR ALL
  USING (public.is_admin());

-- Products — القراءة للجميع، الكتابة للأدمن فقط
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_read_all"   ON public.products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "products_admin_write" ON public.products FOR ALL
  USING (public.is_admin());

-- Conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "conversations_own" ON public.conversations FOR ALL
  USING (patient_id = auth.uid() OR consultant_id = auth.uid() OR public.is_admin());

-- Messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_own_conversation" ON public.messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c 
      WHERE c.id = conversation_id AND (c.patient_id = auth.uid() OR c.consultant_id = auth.uid())
    )
    OR sender_id = auth.uid()
    OR public.is_admin()
  );

-- Consultations
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "consultations_own" ON public.consultations FOR ALL
  USING (patient_id = auth.uid() OR consultant_id = auth.uid() OR public.is_admin());

-- Intake Forms
ALTER TABLE public.intake_forms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "intake_forms_own" ON public.intake_forms FOR ALL
  USING (
    patient_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM public.consultations c 
      WHERE c.id = consultation_id AND c.consultant_id = auth.uid()
    )
    OR public.is_admin()
  );

-- Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_own"       ON public.orders FOR ALL USING (user_id = auth.uid());
CREATE POLICY "orders_admin_all" ON public.orders FOR ALL
  USING (public.is_admin());

-- Order Items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_items_own" ON public.order_items FOR ALL
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));
CREATE POLICY "order_items_admin" ON public.order_items FOR ALL
  USING (public.is_admin());

-- Appointments (Legacy)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "appointments_own"       ON public.appointments FOR ALL USING (patient_id = auth.uid());
CREATE POLICY "appointments_admin_all" ON public.appointments FOR ALL
  USING (public.is_admin());

-- Wishlists
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wishlists_own" ON public.wishlists FOR ALL USING (user_id = auth.uid());

-- Reviews (Product Reviews)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_read_all"   ON public.reviews FOR SELECT USING (TRUE);
CREATE POLICY "reviews_own_write"  ON public.reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "reviews_own_update" ON public.reviews FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "reviews_own_delete" ON public.reviews FOR DELETE USING (user_id = auth.uid());

-- Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_own" ON public.notifications FOR ALL USING (user_id = auth.uid());

-- ═══════════════════════════════════════════════════
--  16. Storage Buckets
-- ═══════════════════════════════════════════════════
-- مسح السياسات القديمة لتفادي الأخطاء
DROP POLICY IF EXISTS "avatars_upload" ON storage.objects;
DROP POLICY IF EXISTS "avatars_read" ON storage.objects;
DROP POLICY IF EXISTS "avatars_update" ON storage.objects;
DROP POLICY IF EXISTS "products_read" ON storage.objects;
DROP POLICY IF EXISTS "chat_media_auth" ON storage.objects;

-- bucket لصور الملفات الشخصية
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', TRUE)
ON CONFLICT (id) DO NOTHING;

-- bucket للمحادثات (صور، صوت، فيديو)
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat_media', 'chat_media', FALSE)
ON CONFLICT (id) DO NOTHING;

-- bucket لصور المنتجات
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', TRUE)
ON CONFLICT (id) DO NOTHING;

-- سياسة: أي مستخدم مسجّل يمكنه رفع صورته الشخصية
CREATE POLICY "avatars_upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

CREATE POLICY "avatars_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

-- سياسة: المنتجات للقراءة العامة
CREATE POLICY "products_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

-- سياسة: chat_media للمستخدمين المسجّلين
CREATE POLICY "chat_media_auth" ON storage.objects FOR ALL
  USING (bucket_id = 'chat_media' AND auth.uid() IS NOT NULL);