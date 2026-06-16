'use client';

import { useState, useEffect } from 'react';

interface ShippingBannerProps {
  cartTotal?: number;
}

const SESSION_KEY = 'shipping_banner_dismissed';
const FREE_SHIPPING_THRESHOLD = 200;

export default function ShippingBanner({ cartTotal }: ShippingBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored === 'true') {
      setDismissed(true);
    }
  }, []);

  function handleDismiss() {
    sessionStorage.setItem(SESSION_KEY, 'true');
    setDismissed(true);
  }

  // Avoid SSR mismatch — render nothing until mounted
  if (!mounted || dismissed) return null;

  const remaining =
    cartTotal !== undefined
      ? FREE_SHIPPING_THRESHOLD - cartTotal
      : null;

  const progressPercent =
    cartTotal !== undefined
      ? Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
      : 0;

  const isEligible = cartTotal !== undefined && cartTotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <div
      dir="rtl"
      className="w-full bg-[#2D4A2E] text-white py-2.5 px-4"
      role="banner"
      aria-label="معلومات الشحن"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Main content */}
        <div className="flex-1 flex flex-col items-center gap-1">
          {cartTotal === undefined ? (
            /* Static message — no cart context */
            <p className="text-sm text-center leading-snug">
              <span className="ml-1">🚚</span>
              توصيل{' '}
              <span className="text-[#C8963E] font-bold">مجاني</span>{' '}
              لجميع الطلبات فوق{' '}
              <span className="font-semibold">200 درهم</span>
              <span className="mx-2 opacity-50">·</span>
              <span className="ml-1">✓</span>
              توصيل 3–5 أيام
            </p>
          ) : isEligible ? (
            /* Cart qualifies */
            <p className="text-sm text-center font-semibold">
              <span className="ml-1">🎉</span>
              مبروك! توصيلك{' '}
              <span className="text-[#C8963E] font-bold">مجاني</span>
            </p>
          ) : (
            /* Cart doesn't qualify yet */
            <div className="flex flex-col items-center gap-1.5 w-full max-w-sm">
              <p className="text-sm text-center leading-snug">
                أضف{' '}
                <span className="text-[#C8963E] font-bold">
                  {remaining!.toFixed(0)} درهم
                </span>{' '}
                للحصول على توصيل{' '}
                <span className="text-[#C8963E] font-bold">مجاني</span>
              </p>
              {/* Progress bar */}
              <div
                className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${progressPercent.toFixed(0)}% من حد الشحن المجاني`}
              >
                <div
                  className="h-full bg-[#C8963E] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all"
          aria-label="إغلاق شريط الشحن"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
