"use client";

export type PaymentMethod = "swish" | "invoice";

const methods: Array<{ id: PaymentMethod; name: string; description: string; badge?: string }> = [
  { id: "swish", name: "Swish", description: "Fast and secure payment with Swish.", badge: "Recommended" },
  { id: "invoice", name: "Invoice", description: "Receive an invoice after placing the order." },
];

export default function PaymentSelector({ value, onChange }: { value: PaymentMethod; onChange: (method: PaymentMethod) => void }) {
  return <fieldset className="space-y-3">
    <legend className="text-xl font-semibold text-stone-950">Payment</legend>
    {methods.map((method) => <label key={method.id} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${value === method.id ? "border-[#173f35] bg-[#f0f4f1]" : "border-stone-200 bg-white"}`}>
      <input className="mt-1 accent-[#173f35]" type="radio" name="paymentMethod" value={method.id} checked={value === method.id} onChange={() => onChange(method.id)} />
      <span className="flex-1"><span className="flex items-center gap-2 font-semibold text-stone-950">{method.name}{method.badge && <span className="rounded-full bg-[#173f35] px-2 py-0.5 text-[10px] uppercase tracking-wide text-white">{method.badge}</span>}</span><span className="mt-1 block text-sm text-stone-500">{method.description}</span></span>
    </label>)}
  </fieldset>;
}
