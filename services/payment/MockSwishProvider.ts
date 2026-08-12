import type { Payment, PaymentRequest } from "@/models/payment";
import type { PaymentProvider } from "./PaymentProvider";
import { paymentRepository } from "./paymentRepository";

export class MockSwishProvider implements PaymentProvider {
  async createPayment(request: PaymentRequest): Promise<Payment> {
    return {
      id: crypto.randomUUID(),
      amount: request.amount,
      currency: request.currency,
      provider: "SWISH",
      status: "PENDING",
      transactionId: `MOCK-SWISH-${Date.now()}`,
    };
  }

  async checkStatus(id: string): Promise<Payment> {
    const payment = paymentRepository.findById(id);
    if (!payment) throw new Error("Payment not found");
    return payment;
  }
}
