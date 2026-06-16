import CheckoutStepper from '@/components/checkout/CheckoutStepper'

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F0E8]" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <CheckoutStepper currentStep={2} />
      </div>
      {children}
    </div>
  )
}
