import type { Category } from "@/models/Category";
import type { Product } from "@/models/Product";

export const categories: Category[] = [
  { id: "coffee", name: "Coffee", description: "Freshly roasted coffee for everyday brewing." },
  { id: "tea", name: "Tea", description: "Loose-leaf and classic teas." },
  { id: "accessories", name: "Accessories", description: "Simple products to improve your coffee ritual." },
];

export const products: Product[] = [
  {
    id: "ethiopia-single-origin",
    name: "Ethiopia Single Origin",
    description: "Bright, floral coffee with citrus notes and a clean finish.",
    price: 149,
    currency: "SEK",
    categoryId: "coffee",
    image: "☕",
    available: true,
  },
  {
    id: "house-blend",
    name: "House Blend",
    description: "A balanced everyday blend with chocolate and caramel notes.",
    price: 129,
    currency: "SEK",
    categoryId: "coffee",
    image: "🫘",
    available: true,
  },
  {
    id: "earl-grey",
    name: "Earl Grey",
    description: "Classic black tea with bergamot and a fresh citrus aroma.",
    price: 89,
    currency: "SEK",
    categoryId: "tea",
    image: "🍵",
    available: true,
  },
  {
    id: "ceramic-mug",
    name: "Ceramic Mug",
    description: "Minimal ceramic mug designed for your daily coffee or tea.",
    price: 99,
    currency: "SEK",
    categoryId: "accessories",
    image: "🥤",
    available: true,
  },
];

export function getProduct(id: string) {
  return products.find((product) => product.id === id);
}

export function getCategory(id: string) {
  return categories.find((category) => category.id === id);
}
