export default function Delivery() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Delivery & Shipping</h1>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
          <p className="mb-4">
            We offer fast and reliable delivery services across Morocco. All orders are processed within 24 hours.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Standard Delivery</h3>
              <p>2-3 business days - Free on orders over 500 MAD</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Express Delivery</h3>
              <p>1 business day - 50 MAD</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Delivery Areas</h2>
          <p className="mb-4">We deliver to all major cities in Morocco:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Casablanca</li>
            <li>Rabat</li>
            <li>Marrakech</li>
            <li>Fes</li>
            <li>Tangier</li>
            <li>And all other cities</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Tracking Your Order</h2>
          <p>
            Once your order is shipped, you&apos;ll receive a tracking number via email and SMS to monitor your delivery status.
          </p>
        </div>
      </div>
    </div>
  );
}
