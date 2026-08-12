import type { Payment, PaymentStatus } from "@/models/payment";

export interface StoredPayment extends Payment {
  createdAt: string;
  updatedAt: string;
}

const payments: StoredPayment[] = [];

export class PaymentRepository {
  save(payment: Payment): StoredPayment {
    const now = new Date().toISOString();
    const existing = this.findById(payment.id);
    if (existing) {
      Object.assign(existing, payment, { updatedAt: now });
      return existing;
    }

    const stored = { ...payment, createdAt: now, updatedAt: now };
    payments.push(stored);
    return stored;
  }

  findById(id: string): StoredPayment | undefined {
    return payments.find((payment) => payment.id === id);
  }

  updateStatus(id: string, status: PaymentStatus): StoredPayment | undefined {
    const payment = this.findById(id);
    if (!payment) return undefined;
    payment.status = status;
    payment.updatedAt = new Date().toISOString();
    return payment;
  }

  findAll(): StoredPayment[] {
    return [...payments];
  }
}

export const paymentRepository = new PaymentRepository();
