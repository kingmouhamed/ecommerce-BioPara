import React from "react";

const Newsletter = () => {
  return (
    <section className="py-12 bg-emerald-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          انضم إلى نشرتنا الإخبارية
        </h2>
        <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
          احصل على أحدث العروض والمنتجات الجديدة مباشرة في بريدك الإلكتروني
        </p>
        <div className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            placeholder="بريدك الإلكتروني"
            className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            dir="rtl"
          />
          <button className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">
            اشترك الآن
          </button>
        </div>
        <p className="text-emerald-100 text-sm mt-4">
          نحن نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
