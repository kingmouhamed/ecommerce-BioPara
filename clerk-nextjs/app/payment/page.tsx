export default function Payment() {
  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-right">الدفع</h1>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-right">طريقة الدفع</h2>
          <p className="mb-4 text-right">
            حالياً، نقبل الدفع عند الاستلام فقط.
          </p>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-right">الدفع عند الاستلام</h3>
            <p className="text-right">ادفع عند استلام طلبك نقداً أو بالبطاقة.</p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              تأكيد الطلب
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
