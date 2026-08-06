import ProductSummary from "@/components/ProductSummary";
import PaymentSelector from "@/components/PaymentSelector";
import SwishButton from "@/components/SwishButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <section className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-600 mb-8">Secure payment for your product</p>

        <ProductSummary />
        <PaymentSelector />
        <SwishButton />

        <p className="text-xs text-gray-500 mt-6">
          More payment methods can be added later.
        </p>
      </section>
    </main>
  );
}
