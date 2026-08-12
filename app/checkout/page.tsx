"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import PaymentSelector from "@/components/PaymentSelector";
import SwishButton from "@/components/SwishButton";

export default function CheckoutPage() {
  const { items, total } = useCart();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-950">Checkout</h1>
          <p className="mt-4 text-slate-600">Your cart is empty.</p>
          <Link href="/products" className="mt-6 inline-block rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white">
            Browse products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/cart" className="text-sm font-medium text-slate-500 hover:text-slate-900">
          ← Back to cart
        </Link>
        <div className="mt-4 rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-950">Checkout</h1>

          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                </div>
                <p className="font-medium text-slate-900">{item.price * item.quantity} {item.currency}</p>
              </div>
            ))}
          </div>

          <div className="my-6 flex justify-between text-xl font-bold text-slate-950">
            <span>Total</span>
            <span>{total} SEK</span>
          </div>

          <PaymentSelector />
          <SwishButton amount={total} />
        </div>
      </div>
    </main>
  );
}
