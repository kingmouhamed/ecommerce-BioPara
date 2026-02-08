"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-emerald-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-2">جاري التحميل...</h2>
        <p className="text-gray-600">يرجى الانتظار بينما نحضر محتواك</p>
      </div>
    </div>
  );
}
