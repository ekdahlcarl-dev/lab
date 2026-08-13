import { NextResponse } from "next/server";
import { mapProviderStatus } from "@/services/payment/paymentStatus";
import { orderService } from "@/services/order/orderService";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reference = body.id ?? body.payeePaymentReference ?? body.paymentReference;
    const providerEventId = body.eventId ?? body.callbackId ?? `${reference}:${body.status ?? "PENDING"}`;

    if (!reference) {
      logger.warn("payment.callback.rejected", { reason: "missing_payment_id" });
      return NextResponse.json({ error: "Payment id is required" }, { status: 400 });
    }

    const status = mapProviderStatus(body.status ?? "PENDING");
    const result = await orderService.applyPaymentStatus(String(reference), status, String(providerEventId));

    if (!result) {
      logger.warn("payment.callback.not_found", { paymentId: String(reference), providerEventId: String(providerEventId) });
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    logger.info("payment.callback.applied", { paymentId: String(reference), providerEventId: String(providerEventId), status });
    return NextResponse.json(result);
  } catch (error) {
    logger.error("payment.callback.failed", { error: error instanceof Error ? error.message : "unknown_error" });
    return NextResponse.json({ error: "Could not process payment callback" }, { status: 500 });
  }
}
