import { PaymentRequest, PaymentResult } from "@/models/payment";
import { PaymentService } from "./paymentService";

export class SwishPaymentService implements PaymentService {
  async initiatePayment(request: PaymentRequest): Promise<PaymentResult> {
    return {
      status: "PENDING",
      provider: "SWISH",
      transactionId: `SWISH-${Date.now()}`,
    };
  }
}
