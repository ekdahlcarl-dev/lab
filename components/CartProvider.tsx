"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Product } from "@/models/Product";

type CartItem = Product & { quantity: number };

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const value = useMemo(() => ({
    items,
    addToCart: (product: Product) => {
      setItems((current) => {
        const existing = current.find((item) => item.id === product.id);
        if (existing) {
          return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...current, { ...product, quantity: 1 }];
      });
    },
    removeFromCart: (id: string) => setItems((current) => current.filter((item) => item.id !== id)),
    updateQuantity: (id: string, quantity: number) => setItems((current) => current.map((item) => item.id === id ? { ...item, quantity } : item)),
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
