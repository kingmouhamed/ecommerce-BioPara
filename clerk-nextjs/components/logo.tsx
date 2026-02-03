import React from "react";

export default function Logo({ className = "w-40 h-auto" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 300 100"
      fill="none"
      className={className}
      aria-label="BioPara Logo"
    >
      {/* --- الأيقونة (هاون + مدقة + أعشاب + صليب) --- */}
      <g transform="translate(10, 10)">
        {/* الهاون (Mortar) */}
        <path
          d="M10 40 C10 65 30 80 50 80 C70 80 90 65 90 40 L10 40Z"
          fill="#166534" // emerald-800
        />
        <path d="M10 40 L90 40 L90 35 L10 35 Z" fill="#14532d" /> {/* حافة الهاون */}

        {/* المدقة (Pestle) */}
        <path
          d="M65 20 L45 50"
          stroke="#3f6212" // لون عشبي
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* الصليب الطبي (داخل الهاون) */}
        <rect x="42" y="50" width="16" height="6" rx="1" fill="white" />
        <rect x="47" y="45" width="6" height="16" rx="1" fill="white" />

        {/* أوراق الأعشاب (خلفية) */}
        <path
          d="M50 35 Q30 10 20 25 M50 35 Q70 5 80 20"
          stroke="#22c55e" // emerald-500
          strokeWidth="3"
          fill="none"
        />
        <path
           d="M20 25 Q15 15 30 15 Z M80 20 Q85 10 70 10 Z"
           fill="#4ade80"
        />
      </g>

      {/* --- النص --- */}
      <g transform="translate(110, 25)">
        {/* كلمة BioPara */}
        <text
          x="0"
          y="40"
          fontFamily="sans-serif"
          fontWeight="bold"
          fontSize="48"
          fill="#064e3b" // emerald-900
        >
          Bio<tspan fill="#16a34a">Para</tspan>
        </text>

        {/* الشعار الفرعي */}
        <text
          x="2"
          y="65"
          fontFamily="sans-serif"
          fontSize="14"
          fontWeight="500"
          fill="#15803d" // emerald-700
          letterSpacing="0.5"
        >
          Herbes &amp; Parapharmacie
        </text>
      </g>
    </svg>
  );
}