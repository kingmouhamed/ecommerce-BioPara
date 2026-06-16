"use client";

import React, { useState, useRef, useEffect } from "react";

interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function AccordionSection({
  title,
  children,
  defaultOpen = false,
}: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children, isOpen]);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 ${
        isOpen ? "border-l-4 border-l-[#2D4A2E]" : "border-l-4 border-l-transparent"
      }`}
    >
      <button
        type="button"
        onClick={toggle}
        className="w-full flex items-center justify-between px-6 py-4 text-right focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4A2E] focus-visible:ring-offset-2"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-bold text-[#2D4A2E]">{title}</span>
        <span
          className="flex-shrink-0 w-7 h-7 rounded-full border-2 border-[#2D4A2E] flex items-center justify-center text-[#2D4A2E] font-bold text-xl leading-none select-none"
          aria-hidden="true"
        >
          {isOpen ? "−" : "+"}
        </span>
      </button>

      <div
        style={{
          maxHeight: isOpen ? `${contentHeight || 500}px` : "0px",
          overflow: "hidden",
          transition: "max-height 0.3s ease-in-out, opacity 0.25s ease-in-out",
          opacity: isOpen ? 1 : 0,
        }}
        aria-hidden={!isOpen}
      >
        <div ref={contentRef} className="px-6 pb-5 text-gray-700 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
