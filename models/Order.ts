import type { Customer } from "./Customer";

export type OrderStatus = "draft" | "pending_payment" | "paid" | "cancelled";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}

export interface Order {
  id: string;
  customer?: Customer;
  items: OrderItem[];
  amount: number;
  currency: string;
  status: OrderStatus;
}
