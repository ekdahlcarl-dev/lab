import type { Payment, PaymentRequest } from "@/models/payment";

export interface PaymentProvider {
  createPayment(request: PaymentRequest): Promise<Payment>;
  checkStatus(id: string): Promise<Payment>;
}
