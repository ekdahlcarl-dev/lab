"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function Header() {
  const { itemCount } = useCart();

  return (
    <header className="border-b bg-white px-6 py-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-xl font-bold">Lab Webshop</Link>
        <div className="flex gap-6">
          <Link href="/products">Products</Link>
          <Link href="/cart">🛒 Cart ({itemCount})</Link>
        </div>
      </nav>
    </header>
  );
}
