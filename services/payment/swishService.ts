import type { Payment, PaymentRequest } from "@/models/payment";
import { GenericPaymentService, type PaymentService } from "./paymentService";

export class SwishPaymentService implements PaymentService {
  private readonly service = new GenericPaymentService();

  async initiatePayment(request: PaymentRequest): Promise<Payment> {
    return this.service.initiatePayment({ ...request, provider: "SWISH" });
  }
}
