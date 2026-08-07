import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { categories, products } from "@/data/catalog";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/products" className="text-xl font-bold tracking-tight text-slate-950">
            Lab Store
          </Link>
          <Link
            href="/cart"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
          >
            Cart (0)
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Shop</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Products for your daily ritual
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Browse the current collection. Product data is already separated from the UI so it can be moved to a database in the next stage.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">All products</span>
          {categories.map((category) => (
            <span key={category.id} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700">
              {category.name}
            </span>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
