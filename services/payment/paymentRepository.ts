import { PaymentResult } from "@/models/payment";

export interface StoredPayment extends PaymentResult {
  id: string;
  amount: number;
  currency: string;
  createdAt: string;
}

const payments: StoredPayment[] = [];

export class PaymentRepository {
  save(payment: StoredPayment): StoredPayment {
    payments.push(payment);
    return payment;
  }

  findAll(): StoredPayment[] {
    return payments;
  }
}
