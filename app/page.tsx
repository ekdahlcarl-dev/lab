export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <section className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-600 mb-8">Secure payment for your product</p>

        <div className="border rounded-xl p-4 mb-6">
          <div className="flex justify-between">
            <span>Product</span>
            <strong>499 SEK</strong>
          </div>
        </div>

        <h2 className="font-semibold mb-3">Payment method</h2>
        <button className="w-full bg-green-600 text-white rounded-xl py-3 font-semibold">
          Pay with Swish
        </button>

        <p className="text-xs text-gray-500 mt-6">
          More payment methods can be added later.
        </p>
      </section>
    </main>
  );
}
