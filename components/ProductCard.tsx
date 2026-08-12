"use client";

import Link from "next/link";
import type { Product } from "@/models/Product";
import { useCart } from "@/components/CartProvider";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  return (
    <article className="group relative">
      <div className="relative overflow-hidden rounded-[18px] bg-[#efeee8]">
        <Link href={`/products/${product.id}`} className="block aspect-[4/5]">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" loading="lazy" />
        </Link>
        <button type="button" aria-label={`Save ${product.name} to wishlist`} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm hover:bg-white">♡</button>
        <button type="button" onClick={() => addToCart(product)} className="absolute inset-x-3 bottom-3 translate-y-14 rounded-full bg-[#173f35] px-4 py-2.5 text-sm font-semibold text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100">Add to cart</button>
      </div>
      <Link href={`/products/${product.id}`} className="mt-4 block">
        <div className="flex items-start justify-between gap-3">
          <div><h2 className="font-medium text-stone-950">{product.name}</h2><p className="mt-1 text-sm text-stone-500">★★★★★ <span className="sr-only">5 out of 5 stars</span></p></div>
          <p className="whitespace-nowrap font-semibold text-stone-900">{product.price} {product.currency}</p>
        </div>
      </Link>
    </article>
  );
}
