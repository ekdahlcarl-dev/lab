import Link from "next/link";
import { products } from "@/data/catalog";

export default function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-black px-8 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-5xl font-bold">Modern shopping experience</h1>
          <p className="mt-4 max-w-xl text-lg text-gray-300">
            Discover products, explore categories and enjoy a simple checkout experience.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-black"
          >
            Browse products
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-8 py-12">
        <h2 className="mb-6 text-3xl font-bold">Featured products</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg"
            >
              <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-gray-100 text-5xl">
                🛍️
              </div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="mt-2 text-gray-600">{product.price} SEK</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
