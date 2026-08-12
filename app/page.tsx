import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import TrustStrip from "@/components/TrustStrip";
import { products } from "@/data/catalog";

export default function Home() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-5 py-5 md:px-8 md:py-8">
        <div className="grid min-h-[620px] overflow-hidden rounded-[26px] bg-[#e9e4d8] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-center px-7 py-14 md:px-14 lg:px-16">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#47655d]">Thoughtful everyday goods</p>
            <h1 className="mt-5 max-w-xl text-5xl font-medium leading-[0.98] tracking-[-0.04em] text-stone-950 md:text-7xl">Make the everyday feel considered.</h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-stone-600 md:text-lg">Coffee, tea and useful objects selected for simple rituals, calm homes and better daily moments.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="rounded-full bg-[#173f35] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0f3028]">Shop the collection</Link>
              <Link href="/products?category=coffee" className="rounded-full border border-stone-400 px-6 py-3.5 text-sm font-semibold text-stone-900 hover:bg-white/50">Explore coffee</Link>
            </div>
          </div>
          <div className="min-h-[420px] lg:min-h-full">
            <img src={products[0].image} alt="Coffee prepared as part of a calm everyday ritual" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <TrustStrip />

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="mb-9 flex items-end justify-between gap-6">
          <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#47655d]">Popular now</p><h2 className="mt-3 text-3xl font-medium tracking-tight text-stone-950 md:text-4xl">Everyday favourites</h2></div>
          <Link href="/products" className="hidden text-sm font-semibold text-[#173f35] underline-offset-4 hover:underline sm:block">View all products →</Link>
        </div>
        <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>
    </main>
  );
}
