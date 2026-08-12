import { Pool, type PoolClient } from "pg";
import type { PaymentStatus } from "@/models/payment";

export type CheckoutItem = { id: string; name: string; quantity: number; price: number; currency: string };
export type CheckoutCustomer = { name: string; email: string; phone: string; address: string; postalCode: string; city: string };
export type PersistedCheckout = { orderId: string; paymentId: string; paymentStatus: PaymentStatus; transactionId?: string };

const connectionString = process.env.DATABASE_URL;
export const pool = connectionString ? new Pool({ connectionString }) : null;

export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  if (!pool) throw new Error("DATABASE_URL is required for durable persistence");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function findCheckoutByIdempotencyKey(client: PoolClient, key: string): Promise<PersistedCheckout | null> {
  const result = await client.query(
    `SELECT o.id AS order_id, p.id AS payment_id, p.status, p.provider_transaction_id
       FROM orders o JOIN payments p ON p.order_id = o.id WHERE o.idempotency_key = $1`,
    [key]
  );
  if (!result.rowCount) return null;
  const row = result.rows[0];
  return { orderId: row.order_id, paymentId: row.payment_id, paymentStatus: row.status, transactionId: row.provider_transaction_id ?? undefined };
}
