import { randomUUID } from "node:crypto";
import type { PaymentProviderName, PaymentStatus } from "@/models/payment";
import { getPaymentProvider } from "@/services/payment/PaymentFactory";
import { findCheckoutByIdempotencyKey, pool, withTransaction, type CheckoutCustomer, type CheckoutItem, type PersistedCheckout } from "@/db/postgres";

export type CreateOrderInput = {
  customer: CheckoutCustomer;
  items: CheckoutItem[];
  amount: number;
  currency: string;
  provider: PaymentProviderName;
  idempotencyKey: string;
};

export type OrderConfirmation = PersistedCheckout & {
  orderStatus: "pending_payment" | "paid" | "payment_failed" | "cancelled";
  amount?: number;
  currency?: string;
  customerEmail?: string;
};

const memoryOrders = new Map<string, OrderConfirmation>();

function orderStatusForPayment(status: PaymentStatus): OrderConfirmation["orderStatus"] {
  if (status === "COMPLETED") return "paid";
  if (status === "FAILED") return "payment_failed";
  if (status === "CANCELLED") return "cancelled";
  return "pending_payment";
}

export class OrderService {
  async createOrderAndPayment(input: CreateOrderInput): Promise<PersistedCheckout> {
    if (!input.idempotencyKey) throw new Error("Idempotency key is required");
    if (!input.items.length) throw new Error("Order must contain at least one item");

    if (!pool) return this.createInMemory(input);

    return withTransaction(async (client) => {
      const existing = await findCheckoutByIdempotencyKey(client, input.idempotencyKey);
      if (existing) return existing;

      const customerId = randomUUID();
      const orderId = randomUUID();
      await client.query(
        `INSERT INTO customers (id,name,email,phone,address,postal_code,city) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [customerId, input.customer.name, input.customer.email, input.customer.phone, input.customer.address, input.customer.postalCode, input.customer.city]
      );
      await client.query(
        `INSERT INTO orders (id,customer_id,amount,currency,status,idempotency_key) VALUES ($1,$2,$3,$4,'pending_payment',$5)`,
        [orderId, customerId, input.amount, input.currency, input.idempotencyKey]
      );
      for (const item of input.items) {
        await client.query(
          `INSERT INTO order_items (order_id,product_id,product_name,quantity,unit_price,currency) VALUES ($1,$2,$3,$4,$5,$6)`,
          [orderId, item.id, item.name, item.quantity, item.price, item.currency]
        );
      }

      const provider = getPaymentProvider(input.provider);
      const payment = await provider.createPayment({ amount: input.amount, currency: input.currency, provider: input.provider });
      await client.query(
        `INSERT INTO payments (id,order_id,provider,provider_transaction_id,amount,currency,status) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [payment.id, orderId, payment.provider, payment.transactionId ?? null, payment.amount, payment.currency, payment.status]
      );

      return { orderId, paymentId: payment.id, paymentStatus: payment.status, transactionId: payment.transactionId };
    });
  }

  private async createInMemory(input: CreateOrderInput): Promise<PersistedCheckout> {
    const existing = memoryOrders.get(input.idempotencyKey);
    if (existing) return existing;
    const payment = await getPaymentProvider(input.provider).createPayment({ amount: input.amount, currency: input.currency, provider: input.provider });
    const result: OrderConfirmation = {
      orderId: randomUUID(),
      paymentId: payment.id,
      paymentStatus: payment.status,
      transactionId: payment.transactionId,
      orderStatus: orderStatusForPayment(payment.status),
      amount: input.amount,
      currency: input.currency,
      customerEmail: input.customer.email,
    };
    memoryOrders.set(input.idempotencyKey, result);
    return result;
  }

  async getOrderConfirmation(orderId: string): Promise<OrderConfirmation | null> {
    if (!pool) {
      for (const order of memoryOrders.values()) if (order.orderId === orderId) return order;
      return null;
    }

    const result = await pool.query(
      `SELECT o.id AS order_id, o.status AS order_status, o.amount, o.currency,
              c.email AS customer_email, p.id AS payment_id, p.status AS payment_status,
              p.provider_transaction_id
         FROM orders o
         JOIN customers c ON c.id = o.customer_id
         JOIN payments p ON p.order_id = o.id
        WHERE o.id = $1`,
      [orderId]
    );
    if (!result.rowCount) return null;
    const row = result.rows[0];
    return {
      orderId: row.order_id,
      orderStatus: row.order_status,
      amount: Number(row.amount),
      currency: row.currency,
      customerEmail: row.customer_email,
      paymentId: row.payment_id,
      paymentStatus: row.payment_status,
      transactionId: row.provider_transaction_id ?? undefined,
    };
  }

  async applyPaymentStatus(paymentReference: string, status: PaymentStatus, providerEventId: string): Promise<PersistedCheckout | null> {
    if (!pool) {
      for (const value of memoryOrders.values()) {
        if (value.paymentId === paymentReference || value.transactionId === paymentReference) {
          value.paymentStatus = status;
          value.orderStatus = orderStatusForPayment(status);
          return value;
        }
      }
      return null;
    }

    return withTransaction(async (client) => {
      const paymentResult = await client.query(
        `SELECT p.id, p.order_id, p.status, p.provider_transaction_id FROM payments p WHERE p.id::text = $1 OR p.provider_transaction_id = $1 FOR UPDATE`,
        [paymentReference]
      );
      if (!paymentResult.rowCount) return null;
      const payment = paymentResult.rows[0];
      const event = await client.query(
        `INSERT INTO payment_events (payment_id,provider_event_id,provider_status) VALUES ($1,$2,$3) ON CONFLICT (provider_event_id) DO NOTHING RETURNING id`,
        [payment.id, providerEventId, status]
      );
      if (event.rowCount) {
        await client.query(`UPDATE payments SET status=$2,updated_at=now() WHERE id=$1`, [payment.id, status]);
        await client.query(`UPDATE orders SET status=$2,updated_at=now() WHERE id=$1`, [payment.order_id, orderStatusForPayment(status)]);
      }
      return { orderId: payment.order_id, paymentId: payment.id, paymentStatus: status, transactionId: payment.provider_transaction_id ?? undefined };
    });
  }
}

export const orderService = new OrderService();
