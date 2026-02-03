# 🚀 كيفية نشر التغييرات في Vercel

## 📋 **الخطوات لنشر المشروع على Vercel:**

### **1. تسجيل الدخول إلى Vercel**
```bash
# إذا لم يكن لديك حساب
npx vercel login

# أو اذهب إلى https://vercel.com وسجل دخولك
```

### **2. ربط المشروع بـ Vercel**
```bash
cd "c:\Users\msi\Desktop\Ecommerce BioPara\clerk-nextjs"
npx vercel
```

### **3. إعدادات النشر الأولى**
- اختر **Link to existing project**
- اختر حسابك في Vercel
- اختر المشروع أو أنشئ مشروع جديد
- تأكد من إعدادات:
  - **Framework Preset**: Next.js
  - **Root Directory**: ./
  - **Build Command**: `npm run build`
  - **Output Directory**: `.next`
  - **Install Command**: `npm install`

### **4. إضافة متغيرات البيئة (Environment Variables)**
في Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### **5. نشر التغييرات (Deployment)**
```bash
# لنشر التغييرات الحالية
npx vercel --prod

# أو تلقائيا عند ربط GitHub
git add .
git commit -m "Update project - fix all errors"
git push origin main
```

## 🔧 **النشر التلقائي مع GitHub:**

### **1. ربط Repository**
- في Vercel Dashboard → Import Project
- اختر GitHub
- اختر repository الخاص بك
- Vercel سينشر تلقائيا عند كل push

### **2. إعدادات GitHub**
```bash
# إذا لم يكن لديك repository
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/biopara-ecommerce.git
git push -u origin main
```

## 📱 **مراقبة النشر:**

### **1. Vercel Dashboard**
- زر **Deployments** لرؤية جميع النشرات
- **Logs** لمشاهدة سجلات النشر
- **Functions** لمراقبة API routes

### **2. أوامر Vercel**
```bash
# عرض حالة النشر
npx vercel ls

# عرض سجلات النشر
npx vercel logs

# إزالة النشر
npx vercel rm your-project-name
```

## 🎯 **ملاحظات هامة:**

### **1. متغيرات البيئة**
- تأكد من إضافة جميع متغيرات البيئة في Vercel
- `.env.local` لا يرفع تلقائياً إلى Vercel

### **2. Domain مخصص**
```bash
# في Vercel Dashboard → Settings → Domains
# أضف نطاقك الخاص: biopara.ma
```

### **3. تحسينات الأداء**
- Vercel يقوم تلقائياً بـ:
  - Image optimization
  - CDN distribution
  - Edge caching
  - Automatic HTTPS

## 🚨 **استكشاف الأخطاء:**

### **إذا فشل النشر:**
1. تحقق من **Build Logs** في Vercel
2. تأكد من جميع متغيرات البيئة
3. تحقق من `package.json` و `next.config.js`
4. تأكد من أن المشروع يعمل محلياً

### **أوامر مفيدة:**
```bash
# نشر محلي للاختبار
npx vercel dev

# عرض التفاصيل
npx vercel inspect
```

## 🎉 **بعد النشر:**
سيحصل مشروعك على:
- رابط Vercel تلقائي: `your-project.vercel.app`
- SSL certificate مجاني
- CDN عالي السرعة
- Analytics مجانية

**الآن مشروعك جاهز للنشر على Vercel!** 🚀
