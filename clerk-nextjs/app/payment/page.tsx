export default function Payment() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Secure Payment</h1>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Payment Methods</h2>
          <p className="mb-4">
            We accept various secure payment methods to ensure your shopping experience is safe and convenient.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Credit/Debit Cards</h3>
              <p>Visa, MasterCard, and other major cards accepted</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">PayPal</h3>
              <p>Fast and secure PayPal payments</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Bank Transfer</h3>
              <p>Direct bank transfer for larger orders</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Cash on Delivery</h3>
              <p>Pay when you receive your order</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Security</h2>
          <p className="mb-4">
            Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>256-bit SSL encryption</li>
            <li>PCI DSS compliant</li>
            <li>Secure payment gateways</li>
            <li>No storage of card details</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Payment Process</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Select your products and add to cart</li>
            <li>Proceed to checkout</li>
            <li>Choose your preferred payment method</li>
            <li>Enter payment details securely</li>
            <li>Confirm your order</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
