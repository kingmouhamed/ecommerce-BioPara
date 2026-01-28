export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-right">اتصل بنا</h1>
      <div className="max-w-2xl">
        <p className="mb-4 text-right">
          تواصل مع BioPara لأي أسئلة حول منتجاتنا أو خدماتنا.
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-right">البريد الإلكتروني</h3>
            <p className="text-right">contact@biopara.ma</p>
          </div>
          <div>
            <h3 className="font-semibold text-right">الهاتف</h3>
            <p className="text-right">+212 6XX XXX XXX</p>
          </div>
          <div>
            <h3 className="font-semibold text-right">العنوان</h3>
            <p className="text-right">المغرب</p>
          </div>
        </div>
      </div>
    </div>
  );
}
