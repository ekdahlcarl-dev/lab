import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import { getCategory, getProduct, products } from "@/data/catalog";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  const category = getCategory(product.categoryId);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-2 lg:py-20">
        <div className="flex min-h-[420px] items-center justify-center rounded-3xl bg-slate-100 text-9xl shadow-sm">
          <span aria-hidden="true">{product.image}</span>
        </div>

        <div className="flex flex-col justify-center">
          <Link href="/products" className="text-sm font-medium text-slate-500 hover:text-slate-900">
            ← Back to products
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            {category?.name ?? "Product"}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">{product.name}</h1>
          <p className="mt-5 text-2xl font-semibold text-slate-950">
            {product.price} {product.currency}
          </p>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">{product.description}</p>

          <div className="mt-8 flex items-center gap-3 text-sm text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
            {product.available ? "In stock" : "Currently unavailable"}
          </div>

          <AddToCartButton product={product} />
        </div>
      </section>
    </main>
  );
}
