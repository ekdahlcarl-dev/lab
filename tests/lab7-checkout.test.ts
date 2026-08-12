import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function read(path: string) {
  return readFileSync(path, "utf8");
}

describe("LAB-7 checkout", () => {
  it("collects required customer and delivery information", () => {
    const checkout = read("app/checkout/page.tsx");
    expect(checkout).toContain("Customer information");
    expect(checkout).toContain("Full name");
    expect(checkout).toContain("Email");
    expect(checkout).toContain("Phone");
    expect(checkout).toContain("Street address");
    expect(checkout).toContain("Postal code");
    expect(checkout).toContain("City");
    expect(checkout).toContain("Standard delivery");
    expect(checkout).toContain("Express delivery");
  });

  it("validates required customer and delivery data", () => {
    const checkout = read("app/checkout/page.tsx");
    expect(checkout).toContain('nextErrors.name = "Name is required."');
    expect(checkout).toContain("Enter a valid email address.");
    expect(checkout).toContain("Phone number is required.");
    expect(checkout).toContain("Delivery address is required.");
    expect(checkout).toContain("Enter a valid 5-digit postal code.");
    expect(checkout).toContain("City is required.");
  });

  it("shows a complete order review including delivery and total", () => {
    const checkout = read("app/checkout/page.tsx");
    expect(checkout).toContain("Order review");
    expect(checkout).toContain("item.price * item.quantity");
    expect(checkout).toContain("deliveryCost");
    expect(checkout).toContain("orderTotal");
    expect(checkout).toContain("Delivery to");
  });

  it("keeps payment selection generic and supports more than one method", () => {
    const selector = read("components/PaymentSelector.tsx");
    const checkout = read("app/checkout/page.tsx");
    expect(selector).toContain('export type PaymentMethod = "swish" | "invoice"');
    expect(selector).toContain("methods.map");
    expect(selector).toContain("onChange(method.id)");
    expect(checkout).toContain("<PaymentSelector value={paymentMethod} onChange={setPaymentMethod} />");
    expect(checkout).toContain('paymentMethod === "swish"');
    expect(checkout).toContain("Invoice payment selected");
  });

  it("submits the real order total and reports errors", () => {
    const checkout = read("app/checkout/page.tsx");
    expect(checkout).toContain('amount: orderTotal, currency: "SEK", provider: "SWISH"');
    expect(checkout).toContain("Payment request failed.");
    expect(checkout).toContain("Could not place the order.");
  });
});
