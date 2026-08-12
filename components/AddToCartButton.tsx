"use client";

import type { Product } from "@/models/Product";
import { useCart } from "@/components/CartProvider";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  return <button type="button" disabled={!product.available} onClick={() => addToCart(product)} className="mt-7 w-full rounded-full bg-[#173f35] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#0f3028] disabled:cursor-not-allowed disabled:bg-stone-300">Add to cart</button>;
}
