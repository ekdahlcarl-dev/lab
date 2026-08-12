import type { Payment, PaymentRequest } from "@/models/payment";
import type { PaymentProvider } from "./PaymentProvider";
import { mapProviderStatus } from "./paymentStatus";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required when PAYMENT_MODE=swish`);
  return value;
}

export class SwishProvider implements PaymentProvider {
  async createPayment(request: PaymentRequest): Promise<Payment> {
    const apiUrl = requireEnv("SWISH_API_URL");
    const callbackUrl = requireEnv("SWISH_CALLBACK_URL");
    const payeeAlias = requireEnv("SWISH_PAYEE_ALIAS");
    const id = crypto.randomUUID().replace(/-/g, "").toUpperCase();

    const response = await fetch(`${apiUrl}/paymentrequests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payeePaymentReference: id.slice(0, 20),
        callbackUrl,
        payeeAlias,
        amount: request.amount.toFixed(2),
        currency: request.currency,
        message: "Lab Webshop order",
      }),
    });

    if (!response.ok) {
      throw new Error(`Swish payment creation failed (${response.status})`);
    }

    return {
      id,
      amount: request.amount,
      currency: request.currency,
      provider: "SWISH",
      status: "PENDING",
      transactionId: id,
    };
  }

  async checkStatus(id: string): Promise<Payment> {
    const apiUrl = requireEnv("SWISH_API_URL");
    const response = await fetch(`${apiUrl}/paymentrequests/${id}`);
    if (!response.ok) throw new Error(`Swish status lookup failed (${response.status})`);
    const body = await response.json();

    return {
      id,
      amount: Number(body.amount ?? 0),
      currency: body.currency ?? "SEK",
      provider: "SWISH",
      status: mapProviderStatus(body.status ?? "PENDING"),
      transactionId: body.paymentReference ?? id,
    };
  }
}
