"use client";
import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleWhatsAppClick = () => {
    const phoneNumber = "+212673020264";
    const text = message || "مرحباً، أود الاستفسار عن منتجاتكم";
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  return (
    <>
      {/* Floating Button */}
      <div 
        className="fixed left-6 bottom-6 z-50 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-all duration-300 cursor-pointer hover:scale-110"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <MessageCircle size={24} />
        )}
      </div>

      {/* Chat Box */}
      {isOpen && (
        <div className="fixed left-6 bottom-24 z-50 w-80 bg-white rounded-lg shadow-2xl border border-gray-200">
          {/* Header */}
          <div className="bg-green-500 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">خدمة العملاء</h3>
                <p className="text-sm opacity-90">نحن هنا لمساعدتك!</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-green-600 rounded-full p-1 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="p-4 h-64 overflow-y-auto">
            <div className="bg-gray-100 rounded-lg p-3 mb-3">
              <p className="text-sm text-gray-700">
                مرحباً! كيف يمكنني مساعدتك اليوم؟ 😊
              </p>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب رسالتك..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onKeyPress={(e) => e.key === 'Enter' && handleWhatsAppClick()}
              />
              <button
                onClick={handleWhatsAppClick}
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              سيتم فتح WhatsApp لإرسال الرسالة
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppWidget;
