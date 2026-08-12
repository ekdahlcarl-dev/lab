import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("LAB-9 orders and persistence", () => {
  it("defines durable PostgreSQL storage for products, customers, orders, items and payments", () => {
    const schema = read("db/schema.sql");
    for (const table of ["products", "customers", "orders", "order_items", "payments", "payment_events"]) {
      expect(schema).toContain(`CREATE TABLE IF NOT EXISTS ${table}`);
    }
    expect(read(".env.example")).toContain("DATABASE_URL=");
  });

  it("uses an idempotency key to prevent duplicate order/payment creation", () => {
    const schema = read("db/schema.sql");
    const orderService = read("services/order/orderService.ts");
    const route = read("app/api/orders/route.ts");
    expect(schema).toContain("idempotency_key text NOT NULL UNIQUE");
    expect(route).toContain('request.headers.get("Idempotency-Key")');
    expect(orderService).toContain("findCheckoutByIdempotencyKey");
  });

  it("creates order and payment inside an explicit transaction boundary", () => {
    const postgres = read("db/postgres.ts");
    const service = read("services/order/orderService.ts");
    expect(postgres).toContain('client.query("BEGIN")');
    expect(postgres).toContain('client.query("COMMIT")');
    expect(postgres).toContain('client.query("ROLLBACK")');
    expect(service).toContain("withTransaction(async (client)");
    expect(service).toContain("provider.createPayment");
  });

  it("makes callback processing idempotent and keeps order/payment status consistent", () => {
    const schema = read("db/schema.sql");
    const service = read("services/order/orderService.ts");
    expect(schema).toContain("provider_event_id text NOT NULL UNIQUE");
    expect(service).toContain("ON CONFLICT (provider_event_id) DO NOTHING");
    expect(service).toContain('if (status === "COMPLETED") return "paid"');
    expect(service).toContain('if (status === "FAILED") return "payment_failed"');
    expect(service).toContain('if (status === "CANCELLED") return "cancelled"');
  });

  it("routes checkout through the transactional order API", () => {
    const checkout = read("app/checkout/page.tsx");
    expect(checkout).toContain('fetch("/api/orders"');
    expect(checkout).toContain('"Idempotency-Key": idempotencyKey.current');
    expect(checkout).toContain("items,");
    expect(checkout).toContain("amount: orderTotal");
  });
});
