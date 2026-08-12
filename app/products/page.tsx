import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { categories, products } from "@/data/catalog";

interface ProductsPageProps { searchParams: Promise<{ q?: string; category?: string; sort?: string }> }

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const query = params.q?.toLowerCase() ?? "";
  const category = params.category ?? "";
  const filteredProducts = products.filter((product) => (!query || product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query)) && (!category || product.categoryId === category)).sort((a,b) => params.sort === "price-asc" ? a.price-b.price : params.sort === "price-desc" ? b.price-a.price : 0);

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-16">
      <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#47655d]">The collection</p><h1 className="mt-3 text-4xl font-medium tracking-[-0.03em] text-stone-950 md:text-5xl">Objects for everyday rituals</h1><p className="mt-4 leading-7 text-stone-600">Simple, useful products selected to make daily routines a little better.</p></div>
      <div className="mt-12 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside>
          <p className="mb-4 text-sm font-semibold text-stone-950">Categories</p>
          <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col" aria-label="Product categories">
            <Link href="/products" className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${!category ? "bg-[#173f35] text-white" : "border border-stone-300"}`}>All products</Link>
            {categories.map((item) => <Link key={item.id} href={`/products?category=${item.id}`} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${category === item.id ? "bg-[#173f35] text-white" : "border border-stone-300"}`}>{item.name}</Link>)}
          </nav>
        </aside>
        <section>
          <form className="mb-8 flex flex-col gap-3 border-b border-stone-200 pb-6 sm:flex-row sm:items-center">
            <input type="hidden" name="category" value={category} />
            <label className="sr-only" htmlFor="catalog-search">Search products</label><input id="catalog-search" name="q" defaultValue={params.q} placeholder="Search the collection" className="min-w-0 flex-1 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm" />
            <label className="sr-only" htmlFor="catalog-sort">Sort products</label><select id="catalog-sort" name="sort" defaultValue={params.sort} className="rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm"><option value="">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select>
            <button className="rounded-full bg-[#173f35] px-5 py-2.5 text-sm font-semibold text-white">Apply</button>
          </form>
          <div className="mb-5 flex justify-between text-sm text-stone-500"><span>{filteredProducts.length} products</span><span>Curated essentials</span></div>
          <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          {filteredProducts.length === 0 && <div className="rounded-2xl border border-stone-200 p-10 text-center text-stone-600">No products match your search.</div>}
        </section>
      </div>
    </main>
  );
}
