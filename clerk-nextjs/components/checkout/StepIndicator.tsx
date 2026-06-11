'use client'

import React from 'react'
import { Check } from 'lucide-react'

interface Step {
  id: number
  title: string
}

const steps: Step[] = [
  { id: 1, title: 'سلة التسوق' },
  { id: 2, title: 'معلومات التوصيل' },
  { id: 3, title: 'طريقة الدفع' },
  { id: 4, title: 'تأكيد الطلب' },
]

interface StepIndicatorProps {
  currentStep: number
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full py-6" dir="rtl">
      <div className="max-w-3xl mx-auto px-4">
        <div className="relative">
          {/* Progress Bar Background */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full" aria-hidden="true"></div>
          
          {/* Active Progress Bar */}
          <div 
            className="absolute top-1/2 right-0 h-1 bg-[#3D5A3E] -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            aria-hidden="true"
          ></div>

          <ol className="relative z-10 flex justify-between text-sm font-medium">
            {steps.map((step) => {
              const isCompleted = currentStep > step.id
              const isActive = currentStep === step.id
              const isFuture = currentStep < step.id

              return (
                <li key={step.id} className="flex flex-col items-center gap-2 relative bg-gray-50/0">
                  <div 
                    className={`
                      w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300
                      ${isCompleted ? 'bg-[#3D5A3E] border-[#3D5A3E] text-white' : ''}
                      ${isActive ? 'bg-[#3D5A3E] border-[#3D5A3E] text-white ring-4 ring-[#3D5A3E]/20' : ''}
                      ${isFuture ? 'bg-white border-gray-300 text-gray-400' : ''}
                    `}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  <span 
                    className={`
                      text-xs md:text-sm whitespace-nowrap hidden sm:block
                      ${isActive ? 'text-[#3D5A3E] font-bold' : ''}
                      ${isCompleted ? 'text-gray-900 font-medium' : ''}
                      ${isFuture ? 'text-gray-500' : ''}
                    `}
                  >
                    {step.title}
                  </span>
                  {/* Mobile title tooltip replacement */}
                  <span 
                    className={`
                      text-[10px] mt-1 whitespace-nowrap sm:hidden absolute top-10
                      ${isActive ? 'text-[#3D5A3E] font-bold' : 'hidden'}
                    `}
                  >
                    {step.title}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}
