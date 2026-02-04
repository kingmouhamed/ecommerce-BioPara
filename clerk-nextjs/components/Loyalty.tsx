import React from "react";

const Loyalty = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-emerald-600 to-green-700">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-6">
              برنامج ولاء BioPara
            </h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎁</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">نقاط على كل عملية شراء</h3>
                  <p className="text-emerald-100">اجمع النقاط واحصل على خصومات حصرية</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👑</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">عضوية ذهبية</h3>
                  <p className="text-emerald-100">وصول خاص للعروض والمنتجات الحصرية</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🚚</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">شحن مجاني</h3>
                  <p className="text-emerald-100">للأعضاء الذهبيين على جميع الطلبات</p>
                </div>
              </div>
            </div>
            <button className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">
              انضم الآن
            </button>
          </div>
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                أكثر من 10,000 عضو
              </h3>
              <p className="text-emerald-100">
                انضم إلى مجتمعنا واستمتع بمزايا حصرية
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Loyalty;
