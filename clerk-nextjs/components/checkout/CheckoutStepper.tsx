import React from 'react';

interface Step {
  id: number;
  icon: string;
  label: string;
}

const steps: Step[] = [
  { id: 1, icon: '🛒', label: 'سلة التسوق' },
  { id: 2, icon: '📦', label: 'معلومات التوصيل' },
  { id: 3, icon: '💳', label: 'طريقة الدفع' },
  { id: 4, icon: '✅', label: 'تأكيد الطلب' },
];

interface CheckoutStepperProps {
  currentStep: number;
}

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  return (
    <div dir="rtl" className="w-full mb-6">
      {/* Desktop stepper */}
      <div className="relative flex items-center justify-between">
        {/* Background connecting line */}
        <div className="absolute top-5 right-0 left-0 h-0.5 bg-gray-200" aria-hidden="true" />

        {/* Completed progress line — grows right to left */}
        <div
          className="absolute top-5 h-0.5 bg-[#27AE60] transition-all duration-500"
          style={{
            right: 0,
            width:
              currentStep <= 1
                ? '0%'
                : currentStep === 2
                ? '33.33%'
                : currentStep === 3
                ? '66.66%'
                : '100%',
          }}
          aria-hidden="true"
        />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div key={step.id} className="relative flex flex-col items-center flex-1">
              {/* Circle */}
              <div
                className={[
                  'w-10 h-10 rounded-full flex items-center justify-center text-base font-bold z-10 transition-all duration-300',
                  isCompleted
                    ? 'bg-[#27AE60] text-white'
                    : isActive
                    ? 'bg-[#C8963E] text-white ring-4 ring-[#C8963E]/20'
                    : 'bg-white border-2 border-gray-300 text-gray-400',
                ].join(' ')}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? '✓' : step.icon}
              </div>

              {/* Label — hidden on mobile */}
              <span
                className={[
                  'hidden sm:block mt-2 text-xs text-center transition-all duration-300',
                  isActive
                    ? 'font-bold text-[#C8963E]'
                    : isCompleted
                    ? 'font-medium text-[#27AE60]'
                    : 'text-gray-400',
                ].join(' ')}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile step counter */}
      <p className="sm:hidden text-center mt-3 text-sm font-medium text-gray-600">
        الخطوة {currentStep} من 4
      </p>
    </div>
  );
}
