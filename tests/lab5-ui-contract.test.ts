import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function read(path: string) {
  return readFileSync(path, "utf8");
}

describe("LAB-5 UI acceptance contract", () => {
  it("routes the application entry point to the product catalog", () => {
    const home = read("app/page.tsx");
    expect(home).toContain('redirect("/products")');
  });

  it("renders the catalog from shared product data", () => {
    const catalogPage = read("app/products/page.tsx");
    expect(catalogPage).toContain('from "@/data/catalog"');
    expect(catalogPage).toContain("products.map");
    expect(catalogPage).toContain("ProductCard");
  });

  it("supports opening a product detail route from catalog data", () => {
    const productCard = read("components/ProductCard.tsx");
    const productPage = read("app/products/[id]/page.tsx");
    expect(productCard).toContain("/products/${product.id}");
    expect(productPage).toContain("getProduct");
    expect(productPage).toContain("notFound");
  });
});
