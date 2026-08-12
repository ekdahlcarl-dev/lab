"use client";

import type { Product } from "@/models/Product";
import { useCart } from "@/components/CartProvider";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <button
      type="button"
      disabled={!product.available}
      onClick={() => addToCart(product)}
      className="mt-8 w-full rounded-xl bg-slate-950 px-6 py-4 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
    >
      Add to cart
    </button>
  );
}
