import { Order } from "@/models/Order";
import { Payment } from "@/models/Payment";

export interface PaymentProvider {
  createPayment(order: Order): Promise<Payment>;
  checkStatus(id: string): Promise<Payment>;
}
