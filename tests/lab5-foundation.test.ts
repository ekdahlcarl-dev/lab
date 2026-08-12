import { describe, expect, it } from "vitest";
import { categories, getCategory, getProduct, products } from "@/data/catalog";

describe("LAB-5 webshop foundation", () => {
  it("provides a non-empty product catalog separated from UI code", () => {
    expect(products.length).toBeGreaterThan(0);
    expect(categories.length).toBeGreaterThan(0);
  });

  it("resolves every product and its category", () => {
    for (const product of products) {
      expect(getProduct(product.id)).toEqual(product);
      expect(getCategory(product.categoryId)).toBeDefined();
    }
  });

  it("contains the domain data required by catalog and product detail views", () => {
    for (const product of products) {
      expect(product.id).toBeTruthy();
      expect(product.name).toBeTruthy();
      expect(product.description).toBeTruthy();
      expect(product.price).toBeGreaterThan(0);
      expect(product.currency).toBe("SEK");
      expect(product.image).toBeTruthy();
      expect(typeof product.available).toBe("boolean");
    }
  });

  it("returns undefined for unknown products and categories", () => {
    expect(getProduct("does-not-exist")).toBeUndefined();
    expect(getCategory("does-not-exist")).toBeUndefined();
  });
});
