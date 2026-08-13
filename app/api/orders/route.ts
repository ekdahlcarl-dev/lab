import { NextResponse } from "next/server";
import { orderService } from "@/services/order/orderService";
import type { PaymentProviderName } from "@/models/payment";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const idempotencyKey = request.headers.get("Idempotency-Key") ?? body.idempotencyKey;
    if (!idempotencyKey) {
      logger.warn("order.create.rejected", { reason: "missing_idempotency_key" });
      return NextResponse.json({ error: "Idempotency-Key is required" }, { status: 400 });
    }

    const result = await orderService.createOrderAndPayment({
      customer: body.customer,
      items: body.items ?? [],
      amount: Number(body.amount),
      currency: body.currency ?? "SEK",
      provider: String(body.provider ?? "SWISH").toUpperCase() as PaymentProviderName,
      idempotencyKey,
    });

    logger.info("order.create.succeeded", { orderId: result.orderId, paymentId: result.paymentId });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    logger.error("order.create.failed", { error: error instanceof Error ? error.message : "unknown_error" });
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not create order" }, { status: 500 });
  }
}
