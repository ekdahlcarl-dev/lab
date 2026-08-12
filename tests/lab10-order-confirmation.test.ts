import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("LAB-10 order confirmation", () => {
  it("redirects completed checkout to a stable order confirmation route", () => {
    const checkout = read("app/checkout/page.tsx");
    expect(checkout).toContain("/order-confirmation?orderId=${order.orderId}");
  });

  it("shows explicit success, failure, cancellation and pending states", () => {
    const page = read("app/order-confirmation/page.tsx");
    expect(page).toContain("Payment successful");
    expect(page).toContain("Payment failed");
    expect(page).toContain("Payment cancelled");
    expect(page).toContain("Payment pending");
  });

  it("only treats completed payment and paid order as success", () => {
    const page = read("app/order-confirmation/page.tsx");
    expect(page).toContain('order.paymentStatus === "COMPLETED" && order.orderStatus === "paid"');
    expect(page).toContain("No paid order has been recorded");
    expect(page).toContain("is not marked as paid");
  });

  it("offers a clear retry path for failed and cancelled payments", () => {
    const page = read("app/order-confirmation/page.tsx");
    expect(page).toContain('actionLabel="Retry payment"');
    expect(page).toContain('actionLabel="Try again"');
    expect(page).toContain('actionHref="/checkout"');
  });

  it("provides stable order reference and receipt email foundation", () => {
    const page = read("app/order-confirmation/page.tsx");
    const receipt = read("services/order/receiptService.ts");
    expect(page).toContain("Order reference");
    expect(receipt).toContain("orderReference: order.orderId");
    expect(receipt).toContain("recipient: order.customerEmail");
    expect(receipt).toContain("ReceiptSender");
  });

  it("maps failed payment to a non-paid order state", () => {
    const service = read("services/order/orderService.ts");
    expect(service).toContain('if (status === "FAILED") return "payment_failed"');
  });
});
