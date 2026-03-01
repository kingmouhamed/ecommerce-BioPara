# BioPara E-commerce with Supabase

دليل إعداد متجر BioPara الإلكتروني باستخدام Supabase و Next.js App Router.

## المتطلبات الأساسية

- Node.js 18+ 
- حساب Supabase
- حساب Resend (للإيميلات)

## خطوات الإعداد

### 1. إعداد Supabase

1. قم بإنشاء مشروع جديد في [Supabase](https://supabase.com)
2. انسخ الـ URL و API Keys من Settings > API
3. افتح SQL Editor في Supabase
4. قم بتنفيذ الملف `database/schema.sql` لإنشاء الجداول والبيانات

### 2. إعداد المتغيرات البيئية

أنشئ ملف `.env.local` في جذر المشروع:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM=noreply@biopara.com
RESEND_FROM_NAME=BioPara

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### 3. تثبيت الاعتماديات

```bash
npm install @supabase/supabase-js
npm install lucide-react
```

### 4. تشغيل المشروع

```bash
npm run dev
```

## هيكل المشروع

```
├── app/
│   ├── api/
│   │   ├── products/
│   │   └── categories/
│   ├── products/
│   │   ├── page.tsx
│   │   ├── [slug]/
│   │   └── loading.tsx
│   ├── categories/
│   │   └── [slug]/
│   ├── cart/
│   ├── checkout/
│   ├── error.tsx
│   └── not-found.tsx
├── components/
│   ├── ProductCard.tsx
│   ├── ProductSkeleton.tsx
│   ├── EmptyState.tsx
│   ├── Pagination.tsx
│   └── SearchFilters.tsx
├── lib/
│   ├── supabase/
│   │   ├── server.ts
│   │   └── client.ts
│   └── data/
│       ├── products.ts
│       └── categories.ts
└── database/
    └── schema.sql
```

## الميزات

### ✅ تم الانتهاء منها

- **قاعدة البيانات**: Supabase PostgreSQL مع RLS
- **المنتجات**: عرض المنتجات مع البحث والفلترة
- **الفئات**: عرض المنتجات حسب الفئة
- **تفاصيل المنتج**: صفحة تفصيلية لكل منتج
- **سلة التسوق**: إدارة السلة
- **صفحة الدفع**: نموذج إتمام الطلب
- **SEO**: Metadata مخصصة لكل صفحة
- **Loading States**: Skeletons و loading pages
- **Error Handling**: صفحات الخطأ المناسبة
- **Responsive Design**: متوافق مع جميع الأجهزة

### 🚧 قيد التطوير

- لوحة تحكم المشرف
- نظام المستخدمين والمصادقة
- إدارة الطلبات
- نظام الدفع الفعلي
- إدارة المخزون

## API Endpoints

### المنتجات
- `GET /api/products` - جلب المنتجات مع البحث والفلترة
- `GET /api/products/[slug]` - جلب منتج واحد

### الفئات
- `GET /api/categories/[slug]` - جلب الفئة مع منتجاتها

## قاعدة البيانات

### الجداول

1. **categories** - الفئات
   - id, name, name_ar, slug, description, description_ar, image

2. **products** - المنتجات
   - id, name, name_ar, slug, description, description_ar, price, currency, stock, images, category_id, is_active, featured

### العلاقات

- products.category_id → categories.id (One-to-Many)

## الأمان

- Row Level Security (RLS) مفعّل
- فقط المنتجات النشطة (is_active = true) ظاهرة للعامة
- Service Role مطلوب للعمليات الكتابة

## النشر

### Vercel (موصى به)

1. قم بربط المشروع بـ Vercel
2. أضف متغيرات البيئية في Vercel Dashboard
3. انشر المشروع

### Docker

```bash
docker build -t biopara .
docker run -p 3000:3000 biopara
```

## الدعم

لأي استفسارات أو مشاكل:
1. تحقق من الـ Console في المتصفح
2. تأكد من إعدادات Supabase
3. تحقق من متغيرات البيئية
