'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SESSION_KEY = 'exit_popup_shown';
const COUPON_CODE = 'BIOPARA10';
const MOBILE_IDLE_MS = 30_000;

export default function ExitIntentPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const shownRef = useRef(false);
  const mobileTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Never show on checkout
  const isCheckout = pathname?.startsWith('/checkout');

  const showPopup = useCallback(() => {
    if (shownRef.current || isCheckout) return;
    shownRef.current = true;
    sessionStorage.setItem(SESSION_KEY, 'true');
    setVisible(true);
  }, [isCheckout]);

  useEffect(() => {
    // Already shown this session
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
      shownRef.current = true;
      return;
    }

    if (isCheckout) return;

    // Detect touch device for mobile vs desktop strategy
    const isMobile =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    if (isMobile) {
      // Mobile: show after 30 s idle
      mobileTimerRef.current = setTimeout(showPopup, MOBILE_IDLE_MS);
    } else {
      // Desktop: mouse leaves viewport from top edge
      function handleMouseLeave(e: MouseEvent) {
        if (e.clientY < 10) {
          showPopup();
        }
      }
      document.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    }

    return () => {
      if (mobileTimerRef.current) {
        clearTimeout(mobileTimerRef.current);
      }
    };
  }, [showPopup, isCheckout]);

  function handleClose() {
    setVisible(false);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(COUPON_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for browsers that block clipboard
      const el = document.createElement('textarea');
      el.value = COUPON_CODE;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-popup-title"
      onClick={(e) => {
        // Close when clicking the backdrop
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        dir="rtl"
        className="bg-white rounded-2xl p-8 max-w-md w-full mx-auto mt-20 text-center shadow-2xl relative animate-in fade-in slide-in-from-top-4 duration-300"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
          aria-label="إغلاق"
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

        {/* Gift emoji */}
        <div className="text-5xl mb-4 select-none" aria-hidden="true">
          🎁
        </div>

        {/* Heading */}
        <h2
          id="exit-popup-title"
          className="text-2xl font-bold text-[#2D4A2E] mb-2 leading-snug"
        >
          انتظر! قبل أن تغادر...
        </h2>

        {/* Sub-text */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          احصل على خصم 10% على أول طلب لك
        </p>

        {/* Coupon box */}
        <div className="bg-[#F5F0E8] border-2 border-dashed border-[#C8963E] rounded-xl p-4 my-4">
          <p className="font-mono text-2xl font-bold text-[#C8963E] tracking-widest mb-3 select-all">
            {COUPON_CODE}
          </p>
          <button
            onClick={handleCopy}
            className={`
              text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200
              ${
                copied
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-[#C8963E]/10 text-[#C8963E] border border-[#C8963E]/30 hover:bg-[#C8963E]/20'
              }
            `}
            aria-label={copied ? 'تم نسخ الكود' : 'نسخ كود الخصم'}
          >
            {copied ? '✓ تم النسخ' : 'نسخ الكود'}
          </button>
        </div>

        {/* CTA button */}
        <Link
          href="/products"
          onClick={handleClose}
          className="
            block w-full bg-[#C8963E] text-white font-bold
            rounded-xl py-3 text-sm text-center
            hover:bg-[#b8852e] active:scale-[0.98]
            transition-all duration-200 shadow-md hover:shadow-lg
            mb-3
          "
        >
          تسوق الآن بخصم 10%
        </Link>

        {/* Fine print */}
        <p className="text-xs text-gray-400">
          العرض صالح لمدة 24 ساعة
        </p>
      </div>
    </div>
  );
}
