export default function About() {
  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-right">من نحن</h1>
      <div className="max-w-4xl">
        <p className="mb-6 text-lg text-right">
          BioPara هو صيدليتكم الإلكترونية الموثوقة في المغرب، المخصصة لتوفير منتجات الصحة والعافية عالية الجودة.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-right">رسالتنا</h2>
            <p className="mb-4 text-right">
              جعل منتجات الصحة والعافية متاحة للجميع في المغرب، وتقديم منتجات أصلية من العلامات التجارية الموثوقة بأسعار تنافسية.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-right">قيمنا</h2>
            <ul className="list-disc list-inside space-y-2 text-right">
              <li>الجودة والأصالة</li>
              <li>رضا العملاء</li>
              <li>النصيحة المهنية والدعم</li>
              <li>التوصيل السريع والموثوق</li>
            </ul>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-right">لماذا تختارون BioPara؟</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">تشكيلة واسعة</h3>
              <p>آلاف المنتجات من أفضل العلامات التجارية</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">دعم الخبراء</h3>
              <p>نصيحة مهنية من فريقنا</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">تسوق آمن</h3>
              <p>معاملات إلكترونية آمنة وموثوقة</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
