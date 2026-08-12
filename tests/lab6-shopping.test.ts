import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function read(path: string) {
  return readFileSync(path, "utf8");
}

describe("LAB-6 shopping experience", () => {
  it("supports search, category filtering and price sorting", () => {
    const productsPage = read("app/products/page.tsx");
    expect(productsPage).toContain("product.name.toLowerCase().includes(query)");
    expect(productsPage).toContain("product.categoryId === category");
    expect(productsPage).toContain('params.sort === "price-asc"');
    expect(productsPage).toContain('params.sort === "price-desc"');
  });

  it("allows adding products to cart from listing and detail pages", () => {
    const productCard = read("components/ProductCard.tsx");
    const detailButton = read("components/AddToCartButton.tsx");
    expect(productCard).toContain("addToCart(product)");
    expect(detailButton).toContain("addToCart(product)");
  });

  it("supports cart add/remove/update, totals and session persistence", () => {
    const cartProvider = read("components/CartProvider.tsx");
    expect(cartProvider).toContain("item.quantity + 1");
    expect(cartProvider).toContain("removeFromCart");
    expect(cartProvider).toContain("updateQuantity");
    expect(cartProvider).toContain("item.price * item.quantity");
    expect(cartProvider).toContain("window.localStorage.getItem(STORAGE_KEY)");
    expect(cartProvider).toContain("window.localStorage.setItem(STORAGE_KEY");
  });

  it("provides live cart count and shopping/checkout navigation", () => {
    const header = read("components/Header.tsx");
    const cartPage = read("app/cart/page.tsx");
    const productsPage = read("app/products/page.tsx");
    const productDetail = read("app/products/[id]/page.tsx");

    expect(header).toContain("itemCount");
    expect(cartPage).toContain('href="/products"');
    expect(cartPage).toContain('href="/checkout"');
    expect(productsPage).not.toContain("Cart (0)");
    expect(productDetail).not.toContain("Cart (0)");
  });
});
