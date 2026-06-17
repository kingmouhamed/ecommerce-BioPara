'use client'

import React from 'react'
import { MessageCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function WhatsAppFloatingButton() {
  const phoneNumber = "212673020264"
  const whatsappUrl = `https://wa.me/${phoneNumber}`
  const pathname = usePathname()

  // Hide the floating button on the checkout page to avoid clutter / overlap
  if (pathname === '/checkout') return null

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-transform duration-300 group"
      aria-label="تحدث معنا على واتساب"
    >
      <MessageCircle className="w-8 h-8" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 whitespace-nowrap bg-gray-900 text-white text-sm font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:-right-1 before:border-4 before:border-transparent before:border-l-gray-900 shadow-xl">
        تحدث معنا على واتساب
      </span>
    </a>
  )
}
