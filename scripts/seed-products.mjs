import pg from "pg";

const { Client } = pg;
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");

const products = [
  ["ethiopia-single-origin", "Ethiopia Single Origin", "Bright, floral coffee with citrus notes and a clean finish.", 149, "SEK", "coffee", "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800"],
  ["house-blend", "House Blend", "A balanced everyday blend with chocolate and caramel notes.", 129, "SEK", "coffee", "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800"],
  ["earl-grey", "Earl Grey", "Classic black tea with bergamot and a fresh citrus aroma.", 89, "SEK", "tea", "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800"],
  ["ceramic-mug", "Ceramic Mug", "Minimal ceramic mug designed for your daily coffee or tea.", 99, "SEK", "accessories", "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=800"],
];

const client = new Client({ connectionString });
await client.connect();
try {
  for (const product of products) {
    await client.query(
      `INSERT INTO products (id,name,description,price,currency,category_id,image)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, description=EXCLUDED.description, price=EXCLUDED.price, currency=EXCLUDED.currency, category_id=EXCLUDED.category_id, image=EXCLUDED.image, updated_at=now()`,
      product
    );
  }
  console.log(`Seeded ${products.length} products.`);
} finally {
  await client.end();
}
