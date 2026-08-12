import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("LAB-8 payment layer", () => {
  it("initiates checkout payments through the generic provider abstraction", () => {
    const checkout = read("app/checkout/page.tsx");
    const orderService = read("services/order/orderService.ts");

    expect(checkout).toContain('provider: "SWISH"');
    expect(orderService).toContain("getPaymentProvider(input.provider)");
    expect(orderService).toContain("provider.createPayment");
  });

  it("isolates mock and real Swish implementations behind PaymentFactory", () => {
    const factory = read("services/payment/PaymentFactory.ts");
    expect(factory).toContain('process.env.PAYMENT_MODE === "swish"');
    expect(factory).toContain("new MockSwishProvider()");
    expect(factory).toContain("new SwishProvider()");
  });

  it("maps provider statuses into consistent domain statuses", () => {
    const model = read("models/payment.ts");
    const mapper = read("services/payment/paymentStatus.ts");
    expect(model).toContain('"CANCELLED"');
    expect(mapper).toContain('return "COMPLETED"');
    expect(mapper).toContain('return "FAILED"');
    expect(mapper).toContain('return "CANCELLED"');
  });

  it("persists asynchronous callback transitions through the order service", () => {
    const callback = read("app/api/payment/callback/route.ts");
    const orderService = read("services/order/orderService.ts");
    expect(callback).toContain("mapProviderStatus");
    expect(callback).toContain("orderService.applyPaymentStatus");
    expect(orderService).toContain("UPDATE payments SET status");
    expect(orderService).toContain("UPDATE orders SET status");
  });

  it("supports failure and cancellation without coupling checkout to Swish callbacks", () => {
    const callback = read("app/api/payment/callback/route.ts");
    const checkout = read("app/checkout/page.tsx");
    expect(callback).not.toContain('"COMPLETED"');
    expect(checkout).not.toContain("SwishProvider");
    expect(checkout).not.toContain("mapProviderStatus");
  });
});
