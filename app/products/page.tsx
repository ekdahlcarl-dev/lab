import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { categories, products } from "@/data/catalog";

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const query = params.q?.toLowerCase() ?? "";
  const category = params.category ?? "";

  const filteredProducts = products
    .filter((product) => {
      const matchesQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      const matchesCategory = !category || product.categoryId === category;
      return matchesQuery && matchesCategory;
    })
    .sort((a, b) => {
      if (params.sort === "price-asc") return a.price - b.price;
      if (params.sort === "price-desc") return b.price - a.price;
      return 0;
    });

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/products" className="text-xl font-bold tracking-tight text-slate-950">
            Lab Store
          </Link>
          <Link href="/cart" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900">
            Cart (0)
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-4xl font-bold text-slate-950">Products for your daily ritual</h1>

        <form className="mt-8 grid gap-4 rounded-2xl bg-white p-5 shadow-sm sm:grid-cols-3">
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Search products..."
            className="rounded-lg border border-slate-300 px-4 py-2"
          />
          <select name="category" defaultValue={params.category} className="rounded-lg border border-slate-300 px-4 py-2">
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          <select name="sort" defaultValue={params.sort} className="rounded-lg border border-slate-300 px-4 py-2">
            <option value="">Sort</option>
            <option value="price-asc">Price low to high</option>
            <option value="price-desc">Price high to low</option>
          </select>
          <button className="rounded-lg bg-slate-950 px-4 py-2 text-white sm:col-span-3">Apply</button>
        </form>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
