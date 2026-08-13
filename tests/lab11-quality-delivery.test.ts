import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { OrderService } from "@/services/order/orderService";

function read(path: string) { return readFileSync(path, "utf8"); }

describe("LAB-11 quality and delivery", () => {
  it("covers the checkout/payment lifecycle through the order service", async () => {
    const service = new OrderService();
    const input = {
      customer: { name: "Test Customer", email: "test@example.com", phone: "0700000000", address: "Test street 1", postalCode: "11111", city: "Stockholm" },
      items: [{ id: "test-product", name: "Test product", quantity: 1, price: 149, currency: "SEK" }],
      amount: 188,
      currency: "SEK",
      provider: "SWISH" as const,
      idempotencyKey: `lab11-${crypto.randomUUID()}`,
    };

    const created = await service.createOrderAndPayment(input);
    expect(created.paymentStatus).toBe("PENDING");

    const duplicate = await service.createOrderAndPayment(input);
    expect(duplicate.orderId).toBe(created.orderId);
    expect(duplicate.paymentId).toBe(created.paymentId);

    await service.applyPaymentStatus(created.paymentId, "COMPLETED", `event-${crypto.randomUUID()}`);
    const confirmation = await service.getOrderConfirmation(created.orderId);
    expect(confirmation?.paymentStatus).toBe("COMPLETED");
    expect(confirmation?.orderStatus).toBe("paid");
  });

  it("runs automated PR quality gates", () => {
    const ci = read(".github/workflows/ci.yml");
    expect(ci).toContain("pull_request:");
    expect(ci).toContain("npm run check:config");
    expect(ci).toContain("npm test");
    expect(ci).toContain("npm run build");
    expect(ci).toContain("Reject committed secret files");
  });

  it("keeps runtime secrets and certificate material out of source control", () => {
    const ignore = read(".gitignore");
    expect(ignore).toContain(".env.local");
    expect(ignore).toContain("*.pem");
    expect(ignore).toContain("*.key");
    expect(ignore).toContain("*.p12");
    expect(ignore).toContain("secrets/");
  });

  it("documents deployment, rollback and security practices", () => {
    const deployment = read("docs/DEPLOYMENT.md");
    const security = read("docs/SECURITY.md");
    expect(deployment).toContain("## Rollback");
    expect(deployment).toContain("/api/health");
    expect(deployment).toContain("previous known-good commit/build artifact");
    expect(security).toContain("Runtime secrets must be supplied by the deployment platform");
    expect(security).toContain("structured logger");
  });

  it("provides structured operational logging and health checks", () => {
    const logger = read("lib/logger.ts");
    const health = read("app/api/health/route.ts");
    const orderRoute = read("app/api/orders/route.ts");
    const callbackRoute = read("app/api/payment/callback/route.ts");
    expect(logger).toContain("JSON.stringify(entry)");
    expect(health).toContain('status: "ok"');
    expect(orderRoute).toContain('logger.error("order.create.failed"');
    expect(callbackRoute).toContain('logger.info("payment.callback.applied"');
  });
});
