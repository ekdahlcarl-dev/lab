import { PaymentRequest, PaymentResult } from "@/models/payment";

export interface PaymentService {
  initiatePayment(request: PaymentRequest): Promise<PaymentResult>;
}
