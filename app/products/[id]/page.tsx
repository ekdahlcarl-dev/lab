import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import TrustStrip from "@/components/TrustStrip";
import { getCategory, getProduct, products } from "@/data/catalog";

export function generateStaticParams() { return products.map((product) => ({ id: product.id })); }
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const product = getProduct(id); if (!product) notFound(); const category = getCategory(product.categoryId);
  return <main>
    <section className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-14">
      <nav className="mb-7 text-sm text-stone-500" aria-label="Breadcrumb"><Link href="/products" className="hover:text-[#173f35]">Shop</Link> <span className="mx-2">/</span> <span>{category?.name}</span> <span className="mx-2">/</span> <span className="text-stone-900">{product.name}</span></nav>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="grid gap-3 sm:grid-cols-[90px_1fr]"><div className="order-2 flex gap-2 sm:order-1 sm:flex-col"><button aria-label="View main product image" className="h-20 w-20 overflow-hidden rounded-xl border-2 border-[#173f35]"><img src={product.image} alt="" className="h-full w-full object-cover" /></button></div><div className="order-1 aspect-[4/5] overflow-hidden rounded-[24px] bg-[#efeee8] sm:order-2"><img src={product.image} alt={product.name} className="h-full w-full object-cover" /></div></div>
        <div className="lg:pt-5"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#47655d]">{category?.name ?? "Product"}</p><h1 className="mt-3 text-4xl font-medium tracking-[-0.03em] text-stone-950 md:text-5xl">{product.name}</h1><div className="mt-4 flex items-center gap-3 text-sm"><span aria-label="5 out of 5 stars">★★★★★</span><span className="text-stone-500">4.9 · 42 reviews</span></div><p className="mt-6 text-2xl font-semibold">{product.price} {product.currency}</p><p className="mt-6 max-w-xl text-base leading-7 text-stone-600">{product.description}</p>
          <div className="mt-8 border-y border-stone-200 py-5"><p className="text-sm font-semibold">Quantity</p><div className="mt-3 inline-flex items-center rounded-full border border-stone-300 bg-white"><button aria-label="Decrease quantity" className="px-4 py-2">−</button><span className="px-3 text-sm">1</span><button aria-label="Increase quantity" className="px-4 py-2">+</button></div></div>
          <AddToCartButton product={product} /><button className="mt-3 w-full rounded-full border border-stone-300 px-7 py-3.5 text-sm font-semibold">♡ Save to wishlist</button>
          <p className="mt-5 flex items-center gap-2 text-sm text-stone-600"><span className="h-2 w-2 rounded-full bg-[#507f65]" />{product.available ? "In stock · ready to ship" : "Currently unavailable"}</p>
        </div>
      </div>
    </section><TrustStrip />
  </main>;
}
