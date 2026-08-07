import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/models/Product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="p-5">
          <p className="text-sm text-slate-500">{product.available ? "In stock" : "Out of stock"}</p>
          <div className="mt-1 flex items-start justify-between gap-4">
            <h2 className="font-semibold text-slate-900">{product.name}</h2>
            <p className="shrink-0 font-semibold text-slate-900">
              {product.price} {product.currency}
            </p>
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{product.description}</p>
          <span className="mt-4 inline-flex text-sm font-medium text-slate-900 group-hover:underline">
            View product →
          </span>
        </div>
      </Link>
    </article>
  );
}
