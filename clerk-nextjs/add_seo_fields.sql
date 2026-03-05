-- إضافة حقول السيو (SEO) والتسويق الجديدة إلى جدول المنتجات
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS short_description_ar text,
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS seo_keywords text[];

-- تحديث الحقول القديمة وتفريغها أو إعدادات مبدئية إذا لزم الأمر
-- (هذا مجرد احتياط لجعل قاعدة البيانات متوافقة مع الذكاء الاصطناعي الجديد)
