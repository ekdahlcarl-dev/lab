export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export type PaymentProviderName = "SWISH" | "CARD";

export interface PaymentRequest {
  amount: number;
  currency: string;
  provider: PaymentProviderName;
}

export interface PaymentResult {
  status: PaymentStatus;
  provider: PaymentProviderName;
  transactionId?: string;
}
