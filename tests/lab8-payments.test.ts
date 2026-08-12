import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("LAB-8 payment layer", () => {
  it("initiates checkout payments through the generic provider abstraction", () => {
    const checkout = read("app/checkout/page.tsx");
    const route = read("app/api/payment/route.ts");
    const service = read("services/payment/paymentService.ts");

    expect(checkout).toContain('provider: "SWISH"');
    expect(route).toContain("GenericPaymentService");
    expect(service).toContain("getPaymentProvider(request.provider)");
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

  it("persists payment creation and asynchronous callback transitions", () => {
    const service = read("services/payment/paymentService.ts");
    const callback = read("app/api/payment/callback/route.ts");
    const repository = read("services/payment/paymentRepository.ts");
    expect(service).toContain("paymentRepository.save(payment)");
    expect(callback).toContain("mapProviderStatus");
    expect(callback).toContain("paymentRepository.updateStatus");
    expect(repository).toContain("updatedAt");
  });

  it("supports failure and cancellation without coupling checkout to Swish callbacks", () => {
    const callback = read("app/api/payment/callback/route.ts");
    const checkout = read("app/checkout/page.tsx");
    expect(callback).not.toContain('"COMPLETED"');
    expect(checkout).not.toContain("SwishProvider");
    expect(checkout).not.toContain("mapProviderStatus");
  });
});
