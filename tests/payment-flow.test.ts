import { describe, expect, it } from "vitest";
import { SwishPaymentService } from "@/services/payment/swishService";
import { PaymentRepository } from "@/services/payment/paymentRepository";

describe("payment lifecycle", () => {
  it("creates a pending payment", async () => {
    const service = new SwishPaymentService();

    const result = await service.initiatePayment({
      amount: 100,
      currency: "SEK",
      provider: "SWISH",
    });

    expect(result.status).toBe("PENDING");
    expect(result.provider).toBe("SWISH");
  });

  it("stores and completes a payment", () => {
    const repository = new PaymentRepository();

    const payment = repository.save({
      id: "test-payment",
      status: "PENDING",
      provider: "SWISH",
      transactionId: "SWISH-test",
      amount: 100,
      currency: "SEK",
    });

    expect(payment.status).toBe("PENDING");
    expect(payment.createdAt).toBeTruthy();

    const updated = repository.updateStatus("test-payment", "COMPLETED");

    expect(updated?.status).toBe("COMPLETED");
  });

  it("returns undefined for unknown payment", () => {
    const repository = new PaymentRepository();

    expect(repository.findById("missing")).toBeUndefined();
  });
});
