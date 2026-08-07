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

  findById(id: string): StoredPayment | undefined {
    return payments.find((payment) => payment.id === id);
  }

  updateStatus(id: string, status: PaymentResult["status"]): StoredPayment | undefined {
    const payment = this.findById(id);

    if (!payment) {
      return undefined;
    }

    payment.status = status;
    return payment;
  }

  findAll(): StoredPayment[] {
    return payments;
  }
}

export const paymentRepository = new PaymentRepository();
