export type PaymentStatus = "pending" | "completed" | "failed";

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
}
