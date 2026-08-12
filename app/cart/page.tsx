"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  return <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-10 md:px-8 md:py-16">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#47655d]">Your selection</p><h1 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">Shopping bag</h1>
    {items.length === 0 ? <div className="mt-10 rounded-[22px] border border-stone-200 bg-white p-10"><p className="text-stone-600">Your bag is empty.</p><Link href="/products" className="mt-5 inline-block rounded-full bg-[#173f35] px-6 py-3 text-sm font-semibold text-white">Explore products</Link></div> :
    <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
      <section className="divide-y divide-stone-200 border-y border-stone-200">{items.map((item) => <article key={item.id} className="grid grid-cols-[88px_1fr] gap-5 py-6 sm:grid-cols-[110px_1fr_auto]"><div className="h-28 overflow-hidden rounded-xl bg-[#efeee8]"><img src={item.image} alt={item.name} className="h-full w-full object-cover" /></div><div><h2 className="font-semibold">{item.name}</h2><p className="mt-1 text-sm text-stone-500">{item.price} {item.currency}</p><div className="mt-4 flex items-center gap-4"><label className="text-sm">Qty <input aria-label={`Quantity for ${item.name}`} className="ml-2 w-16 rounded-full border border-stone-300 px-3 py-1.5" type="number" min={1} value={item.quantity} onChange={(e) => updateQuantity(item.id, Number(e.target.value))} /></label><button onClick={() => removeFromCart(item.id)} className="text-sm text-stone-500 underline underline-offset-4">Remove</button></div></div><strong className="col-start-2 sm:col-start-3">{item.price * item.quantity} {item.currency}</strong></article>)}</section>
      <aside className="h-fit rounded-[22px] bg-[#f2f0e9] p-6 lg:sticky lg:top-24"><h2 className="text-xl font-semibold">Order summary</h2><div className="mt-6 space-y-3 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{total} SEK</span></div><div className="flex justify-between text-stone-500"><span>Shipping</span><span>Calculated at checkout</span></div><div className="flex justify-between border-t border-stone-300 pt-4 text-lg font-semibold"><span>Total</span><span>{total} SEK</span></div></div><Link href="/checkout" className="mt-6 block rounded-full bg-[#173f35] px-5 py-3.5 text-center text-sm font-semibold text-white hover:bg-[#0f3028]">Proceed to checkout</Link><Link href="/products" className="mt-4 block text-center text-sm font-semibold text-stone-700">Continue shopping</Link><p className="mt-6 text-center text-xs text-stone-500">Secure checkout · 30-day returns</p></aside>
    </div>}
  </main>;
}
