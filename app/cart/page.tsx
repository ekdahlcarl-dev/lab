"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total } = useCart();

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-slate-950">Your cart</h1>

        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm">
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p>{item.price} {item.currency}</p>
              </div>
              <div className="flex items-center gap-3">
                <input className="w-16 border rounded p-1" type="number" value={item.quantity} onChange={(e) => updateQuantity(item.id, Number(e.target.value))} />
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xl font-bold">Total: {total} SEK</p>
        <Link className="mt-6 inline-block" href="/products">Continue shopping</Link>
      </div>
    </main>
  );
}
