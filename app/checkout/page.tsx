"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useCart } from "@/components/CartProvider";
import PaymentSelector, { type PaymentMethod } from "@/components/PaymentSelector";

type CheckoutFields = {
  name: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  deliveryMethod: "standard" | "express";
};

type FieldErrors = Partial<Record<keyof CheckoutFields, string>>;

const initialFields: CheckoutFields = {
  name: "",
  email: "",
  phone: "",
  address: "",
  postalCode: "",
  city: "",
  deliveryMethod: "standard",
};

export default function CheckoutPage() {
  const { items, total } = useCart();
  const [fields, setFields] = useState(initialFields);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("swish");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

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

  const updateField = <K extends keyof CheckoutFields>(key: K, value: CheckoutFields[K]) => {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submitOrder = async (event: FormEvent) => {
    event.preventDefault();
    setResult(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (paymentMethod === "swish") {
        const response = await fetch("/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: orderTotal, currency: "SEK" }),
        });
        if (!response.ok) throw new Error("Payment request failed.");
        const payment = await response.json();
        setResult(`Order ready. Payment ${payment.status}: ${payment.transactionId}`);
      } else {
        setResult("Order ready. Invoice payment selected.");
      }
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Could not place the order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-950">Checkout</h1>
          <p className="mt-4 text-slate-600">Your cart is empty.</p>
          <Link href="/products" className="mt-6 inline-block rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white">Browse products</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl">
        <Link href="/cart" className="text-sm font-medium text-slate-500 hover:text-slate-900">← Back to cart</Link>
        <form onSubmit={submitOrder} className="mt-4 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h1 className="text-3xl font-bold text-slate-950">Checkout</h1>
              <h2 className="mt-8 text-xl font-semibold">Customer information</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Full name" error={errors.name}><input value={fields.name} onChange={(e) => updateField("name", e.target.value)} className="w-full rounded-lg border p-3" /></Field>
                <Field label="Email" error={errors.email}><input type="email" value={fields.email} onChange={(e) => updateField("email", e.target.value)} className="w-full rounded-lg border p-3" /></Field>
                <Field label="Phone" error={errors.phone}><input value={fields.phone} onChange={(e) => updateField("phone", e.target.value)} className="w-full rounded-lg border p-3" /></Field>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Delivery</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <DeliveryOption id="standard" checked={fields.deliveryMethod === "standard"} onChange={() => updateField("deliveryMethod", "standard")} title="Standard delivery" detail="2–4 business days · 39 SEK" />
                <DeliveryOption id="express" checked={fields.deliveryMethod === "express"} onChange={() => updateField("deliveryMethod", "express")} title="Express delivery" detail="1–2 business days · 79 SEK" />
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Street address" error={errors.address}><input value={fields.address} onChange={(e) => updateField("address", e.target.value)} className="w-full rounded-lg border p-3" /></Field>
                <Field label="Postal code" error={errors.postalCode}><input inputMode="numeric" value={fields.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} className="w-full rounded-lg border p-3" /></Field>
                <Field label="City" error={errors.city}><input value={fields.city} onChange={(e) => updateField("city", e.target.value)} className="w-full rounded-lg border p-3" /></Field>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <PaymentSelector value={paymentMethod} onChange={setPaymentMethod} />
            </section>
          </div>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <h2 className="text-xl font-semibold">Order review</h2>
            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between border-b border-slate-100 pb-4">
                  <div><p className="font-semibold">{item.name}</p><p className="text-sm text-slate-500">Quantity: {item.quantity}</p></div>
                  <p>{item.price * item.quantity} {item.currency}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between"><span>Products</span><span>{total} SEK</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>{deliveryCost} SEK</span></div>
              <div className="flex justify-between border-t pt-3 text-lg font-bold"><span>Total</span><span>{orderTotal} SEK</span></div>
            </div>
            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Delivery to</p>
              <p>{fields.name || "Customer name"}</p>
              <p>{fields.address || "Street address"}</p>
              <p>{fields.postalCode || "Postal code"} {fields.city || "City"}</p>
            </div>
            <button type="submit" disabled={submitting} className="mt-6 w-full rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white disabled:opacity-60">{submitting ? "Placing order…" : "Place order"}</button>
            {result && <p role="status" className="mt-4 rounded-lg bg-slate-100 p-3 text-sm">{result}</p>}
          </aside>
        </form>
      </div>
    </main>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-slate-700"><span>{label}</span><div className="mt-1">{children}</div>{error && <span className="mt-1 block text-red-600">{error}</span>}</label>;
}

function DeliveryOption({ id, checked, onChange, title, detail }: { id: string; checked: boolean; onChange: () => void; title: string; detail: string }) {
  return <label className="flex cursor-pointer gap-3 rounded-xl border p-4"><input type="radio" name="deliveryMethod" value={id} checked={checked} onChange={onChange} /><span><span className="block font-medium">{title}</span><span className="text-sm text-slate-500">{detail}</span></span></label>;
}
