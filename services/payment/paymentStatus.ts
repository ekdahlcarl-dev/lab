import type { PaymentStatus } from "@/models/payment";

const completedStatuses = new Set(["PAID", "COMPLETED"]);
const failedStatuses = new Set(["DECLINED", "ERROR", "FAILED"]);
const cancelledStatuses = new Set(["CANCELLED", "CANCELED"]);

export function mapProviderStatus(status: string): PaymentStatus {
  const normalized = status.toUpperCase();
  if (completedStatuses.has(normalized)) return "COMPLETED";
  if (failedStatuses.has(normalized)) return "FAILED";
  if (cancelledStatuses.has(normalized)) return "CANCELLED";
  return "PENDING";
}
