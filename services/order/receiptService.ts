import type { OrderConfirmation } from "./orderService";

export type Receipt = {
  orderReference: string;
  amount?: number;
  currency?: string;
  recipient?: string;
  paymentStatus: OrderConfirmation["paymentStatus"];
};

export interface ReceiptSender {
  send(receipt: Receipt): Promise<void>;
}

export class ReceiptService {
  create(order: OrderConfirmation): Receipt {
    return {
      orderReference: order.orderId,
      amount: order.amount,
      currency: order.currency,
      recipient: order.customerEmail,
      paymentStatus: order.paymentStatus,
    };
  }
}

export const receiptService = new ReceiptService();
