export default function Routes() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Site Map</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <ul className="space-y-2">
            <li><a href="/products" className="text-green-700 hover:underline">All Products</a></li>
            <li><a href="/products?category=Visage" className="text-green-700 hover:underline">Facial Care</a></li>
            <li><a href="/products?category=Parapharmacie" className="text-green-700 hover:underline">Parapharmacy</a></li>
            <li><a href="/products?category=Hair" className="text-green-700 hover:underline">Hair Care</a></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <ul className="space-y-2">
            <li><a href="/sign-in" className="text-green-700 hover:underline">Sign In</a></li>
            <li><a href="/sign-up" className="text-green-700 hover:underline">Sign Up</a></li>
            <li><a href="/cart" className="text-green-700 hover:underline">Cart</a></li>
            <li><a href="/favorites" className="text-green-700 hover:underline">Favorites</a></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Information</h2>
          <ul className="space-y-2">
            <li><a href="/about" className="text-green-700 hover:underline">About Us</a></li>
            <li><a href="/contact" className="text-green-700 hover:underline">Contact</a></li>
            <li><a href="/delivery" className="text-green-700 hover:underline">Delivery</a></li>
            <li><a href="/payment" className="text-green-700 hover:underline">Payment</a></li>
            <li><a href="/terms" className="text-green-700 hover:underline">Terms of Use</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
