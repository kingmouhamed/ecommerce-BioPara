export default function TrustBar() {
  return (
    <div className="bg-[#2D4A2E] text-white py-2.5 w-full">
      <div className="flex items-center justify-center gap-6 flex-wrap text-sm px-4">
        <span>🔒 دفع آمن ومشفر 100%</span>

        <span className="hidden sm:inline text-white/40">|</span>

        <span className="flex items-center gap-1.5">
          <span className="font-bold italic text-blue-300 text-xs border border-blue-300 px-1 rounded">VISA</span>
          <span className="font-bold text-red-300 text-xs border border-red-300 px-1 rounded">MC</span>
          <span className="font-bold text-green-300 text-xs border border-green-300 px-1 rounded">CMI</span>
        </span>

        <span className="hidden sm:inline text-white/40">|</span>

        <span>✅ ضمان استرجاع 7 أيام</span>

        <span className="hidden sm:inline text-white/40">|</span>

        <span>🚚 توصيل مجاني +200 درهم</span>
      </div>
    </div>
  );
}
