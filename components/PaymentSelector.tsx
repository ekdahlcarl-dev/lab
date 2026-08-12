"use client";

export type PaymentMethod = "swish" | "invoice";

interface PaymentSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const methods: Array<{ id: PaymentMethod; name: string; description: string }> = [
  { id: "swish", name: "Swish", description: "Pay securely with Swish." },
  { id: "invoice", name: "Invoice", description: "Receive an invoice after placing the order." },
];

export default function PaymentSelector({ value, onChange }: PaymentSelectorProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="font-semibold text-slate-950">Payment method</legend>
      {methods.map((method) => (
        <label key={method.id} className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 p-4">
          <input
            type="radio"
            name="paymentMethod"
            value={method.id}
            checked={value === method.id}
            onChange={() => onChange(method.id)}
          />
          <span>
            <span className="block font-medium text-slate-950">{method.name}</span>
            <span className="text-sm text-slate-500">{method.description}</span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}
