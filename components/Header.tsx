"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-[#fbfaf6]/95 backdrop-blur">
      <nav className="mx-auto flex min-h-20 max-w-7xl items-center gap-8 px-5 md:px-8" aria-label="Main navigation">
        <Link href="/" className="shrink-0 py-3 text-lg font-semibold tracking-tight text-stone-950">STORE</Link>
        <div className="hidden items-center gap-2 text-sm text-stone-700 md:flex lg:gap-3">
          <Link href="/products" className="rounded-full px-3.5 py-2.5 leading-none hover:bg-stone-100 hover:text-[#173f35]">Shop</Link>
          <Link href="/products?category=coffee" className="rounded-full px-3.5 py-2.5 leading-none hover:bg-stone-100 hover:text-[#173f35]">Coffee</Link>
          <Link href="/products?category=tea" className="rounded-full px-3.5 py-2.5 leading-none hover:bg-stone-100 hover:text-[#173f35]">Tea</Link>
          <Link href="/products?category=accessories" className="rounded-full px-3.5 py-2.5 leading-none hover:bg-stone-100 hover:text-[#173f35]">Accessories</Link>
        </div>
        <form action="/products" className="ml-auto hidden w-full max-w-xs md:block">
          <label className="sr-only" htmlFor="header-search">Search products</label>
          <input id="header-search" name="q" placeholder="Search products" className="w-full rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm placeholder:text-stone-400" />
        </form>
        <Link href="/products" className="rounded-full px-3 py-2.5 text-sm md:hidden">Shop</Link>
        <Link href="/cart" aria-label={`Cart with ${itemCount} items`} className="relative flex shrink-0 items-center gap-2 rounded-full px-3 py-2.5 text-sm font-medium text-stone-900 hover:bg-stone-100">
          <span aria-hidden="true">Bag</span>
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#173f35] px-1.5 text-xs text-white">{itemCount}</span>
        </Link>
      </nav>
    </header>
  );
}
