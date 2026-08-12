"use client";

import Link from "next/link";
import type { Product } from "@/models/Product";
import { useCart } from "@/components/CartProvider";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/products/${product.id}`} className="block">
        <div className="aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-5">
          <h2 className="font-semibold text-slate-900">{product.name}</h2>
          <p className="mt-2 font-semibold">{product.price} {product.currency}</p>
        </div>
      </Link>
      <div className="px-5 pb-5">
        <button onClick={() => addToCart(product)} className="w-full rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          Add to cart
        </button>
      </div>
    </article>
  );
}
