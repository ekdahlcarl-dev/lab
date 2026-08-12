"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { useCart } from "@/components/CartProvider";
import PaymentSelector, { type PaymentMethod } from "@/components/PaymentSelector";

type CheckoutFields = { name: string; email: string; phone: string; address: string; postalCode: string; city: string; deliveryMethod: "standard" | "express" };
type FieldErrors = Partial<Record<keyof CheckoutFields, string>>;
const initialFields: CheckoutFields = { name: "", email: "", phone: "", address: "", postalCode: "", city: "", deliveryMethod: "standard" };

export default function CheckoutPage() {
  const { items, total } = useCart();
  const [fields, setFields] = useState(initialFields);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("swish");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const idempotencyKey = useRef(crypto.randomUUID());
  const deliveryCost = fields.deliveryMethod === "express" ? 79 : 39;
  const orderTotal = total + deliveryCost;

  const validate = () => {
    const nextErrors: FieldErrors = {};
    if (!fields.name.trim()) nextErrors.name = "Name is required.";
    if (!/^\S+@\S+\.\S+$/.test(fields.email)) nextErrors.email = "Enter a valid email address.";
    if (!fields.phone.trim()) nextErrors.phone = "Phone number is required.";
    if (!fields.address.trim()) nextErrors.address = "Delivery address is required.";
    if (!/^\d{5}$/.test(fields.postalCode.replace(/\s/g, ""))) nextErrors.postalCode = "Enter a valid 5-digit postal code.";
    if (!fields.city.trim()) nextErrors.city = "City is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };
  const updateField = <K extends keyof CheckoutFields>(key: K, value: CheckoutFields[K]) => { setFields((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: undefined })); };
  const submitOrder = async (event: FormEvent) => {
    event.preventDefault(); setResult(null); if (!validate()) return; setSubmitting(true);
    try {
      if (paymentMethod === "swish") {
        const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey.current }, body: JSON.stringify({ customer: { name: fields.name, email: fields.email, phone: fields.phone, address: fields.address, postalCode: fields.postalCode, city: fields.city }, items, amount: orderTotal, currency: "SEK", provider: "SWISH" }) });
        const order = await response.json(); if (!response.ok) throw new Error(order.error ?? "Order/payment request failed."); window.location.assign(`/order-confirmation?orderId=${order.orderId}`);
      } else setResult("Order ready. Invoice payment selected.");
    } catch (error) { setResult(error instanceof Error ? error.message : "Could not place the order."); } finally { setSubmitting(false); }
  };

  if (items.length === 0) return <main className="mx-auto max-w-3xl px-5 py-16"><div className="rounded-[22px] border border-stone-200 bg-white p-8"><h1 className="text-3xl font-medium">Checkout</h1><p className="mt-4 text-stone-600">Your cart is empty.</p><Link href="/products" className="mt-6 inline-block rounded-full bg-[#173f35] px-6 py-3 text-sm font-semibold text-white">Browse products</Link></div></main>;
  return <main className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
    <Link href="/cart" className="text-sm text-stone-500 hover:text-[#173f35]">← Back to bag</Link>
    <div className="mt-7 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400"><span className="text-[#173f35]">1 Bag</span><span>—</span><span className="text-[#173f35]">2 Details</span><span>—</span><span className="text-[#173f35]">3 Payment</span><span>—</span><span>4 Confirmation</span></div>
    <h1 className="mt-4 text-4xl font-medium tracking-tight md:text-5xl">Checkout</h1>
    <form onSubmit={submitOrder} className="mt-9 grid gap-10 lg:grid-cols-[1fr_400px]">
      <div className="space-y-5">
        <Section title="Customer information"><div className="grid gap-4 sm:grid-cols-2"><Field label="Full name" error={errors.name}><input value={fields.name} onChange={(e) => updateField("name", e.target.value)} className="input" /></Field><Field label="Email" error={errors.email}><input type="email" value={fields.email} onChange={(e) => updateField("email", e.target.value)} className="input" /></Field><Field label="Phone" error={errors.phone}><input value={fields.phone} onChange={(e) => updateField("phone", e.target.value)} className="input" /></Field></div></Section>
        <Section title="Delivery"><div className="grid gap-3 sm:grid-cols-2"><DeliveryOption id="standard" checked={fields.deliveryMethod === "standard"} onChange={() => updateField("deliveryMethod", "standard")} title="Standard delivery" detail="2–4 business days · 39 SEK" /><DeliveryOption id="express" checked={fields.deliveryMethod === "express"} onChange={() => updateField("deliveryMethod", "express")} title="Express delivery" detail="1–2 business days · 79 SEK" /></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Street address" error={errors.address}><input value={fields.address} onChange={(e) => updateField("address", e.target.value)} className="input" /></Field><Field label="Postal code" error={errors.postalCode}><input inputMode="numeric" value={fields.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} className="input" /></Field><Field label="City" error={errors.city}><input value={fields.city} onChange={(e) => updateField("city", e.target.value)} className="input" /></Field></div></Section>
        <section className="rounded-[22px] border border-stone-200 bg-white p-6"><PaymentSelector value={paymentMethod} onChange={setPaymentMethod} /></section>
      </div>
      <aside className="h-fit rounded-[22px] bg-[#f2f0e9] p-6 lg:sticky lg:top-24"><h2 className="text-xl font-semibold">Order review</h2><div className="mt-5 space-y-4">{items.map((item) => <div key={item.id} className="flex justify-between border-b border-stone-300 pb-4 text-sm"><div><p className="font-semibold">{item.name}</p><p className="text-stone-500">Quantity: {item.quantity}</p></div><p>{item.price * item.quantity} {item.currency}</p></div>)}</div><div className="mt-5 space-y-2 text-sm"><div className="flex justify-between"><span>Products</span><span>{total} SEK</span></div><div className="flex justify-between"><span>Delivery</span><span>{deliveryCost} SEK</span></div><div className="flex justify-between border-t border-stone-300 pt-4 text-lg font-semibold"><span>Total</span><span>{orderTotal} SEK</span></div></div><div className="mt-5 rounded-xl bg-white/70 p-4 text-sm text-stone-600"><p className="font-semibold text-stone-900">Delivery to</p><p>{fields.name || "Customer name"}</p><p>{fields.address || "Street address"}</p><p>{fields.postalCode || "Postal code"} {fields.city || "City"}</p></div><button type="submit" disabled={submitting} className="mt-6 w-full rounded-full bg-[#173f35] px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-60">{submitting ? "Placing order…" : "Place order securely"}</button><p className="mt-4 text-center text-xs text-stone-500">Secure payment · Your information is protected</p>{result && <p role="status" className="mt-4 rounded-xl bg-white p-3 text-sm">{result}</p>}</aside>
    </form><style jsx global>{`.input{width:100%;border:1px solid #d6d3d1;border-radius:12px;background:white;padding:.75rem .9rem}.input:focus{border-color:#173f35}`}</style>
  </main>;
}
function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-[22px] border border-stone-200 bg-white p-6"><h2 className="mb-5 text-xl font-semibold">{title}</h2>{children}</section>; }
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="block text-sm font-medium text-stone-700"><span>{label}</span><div className="mt-1.5">{children}</div>{error && <span className="mt-1 block text-red-700">{error}</span>}</label>; }
function DeliveryOption({ id, checked, onChange, title, detail }: { id: string; checked: boolean; onChange: () => void; title: string; detail: string }) { return <label className={`flex cursor-pointer gap-3 rounded-2xl border p-4 ${checked ? "border-[#173f35] bg-[#f0f4f1]" : "border-stone-200"}`}><input className="accent-[#173f35]" type="radio" name="deliveryMethod" value={id} checked={checked} onChange={onChange} /><span><span className="block font-semibold">{title}</span><span className="text-sm text-stone-500">{detail}</span></span></label>; }
