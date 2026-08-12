import type { Payment, PaymentRequest, PaymentStatus } from "@/models/payment";
import { getPaymentProvider } from "./PaymentFactory";
import { paymentRepository } from "./paymentRepository";

export interface PaymentService {
  initiatePayment(request: PaymentRequest): Promise<Payment>;
}

export class GenericPaymentService implements PaymentService {
  async initiatePayment(request: PaymentRequest): Promise<Payment> {
    const provider = getPaymentProvider(request.provider);
    const payment = await provider.createPayment(request);
    return paymentRepository.save(payment);
  }

  getPayment(id: string): Payment | undefined {
    return paymentRepository.findById(id);
  }

  updateStatus(id: string, status: PaymentStatus): Payment | undefined {
    return paymentRepository.updateStatus(id, status);
  }
}
