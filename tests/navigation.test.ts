import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("storefront navigation", () => {
  it("has pages for all primary hard-coded storefront routes", () => {
    expect(read("app/page.tsx")).toContain('href="/products"');
    expect(read("components/Header.tsx")).toContain('href="/cart"');
    expect(read("app/cart/page.tsx")).toContain('href="/checkout"');
    expect(read("app/checkout/page.tsx")).toContain('href="/cart"');
  });

  it("uses the current cart total when starting payment", () => {
    expect(read("app/checkout/page.tsx")).toContain("<SwishButton amount={total} />");
    expect(read("components/SwishButton.tsx")).toContain("amount,");
  });
});
