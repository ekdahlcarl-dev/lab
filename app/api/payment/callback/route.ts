import { NextResponse } from "next/server";
import { mapProviderStatus } from "@/services/payment/paymentStatus";
import { orderService } from "@/services/order/orderService";

export async function POST(request: Request) {
  const body = await request.json();
  const reference = body.id ?? body.payeePaymentReference ?? body.paymentReference;
  const providerEventId = body.eventId ?? body.callbackId ?? `${reference}:${body.status ?? "PENDING"}`;

  if (!reference) {
    return NextResponse.json({ error: "Payment id is required" }, { status: 400 });
  }

  const result = await orderService.applyPaymentStatus(
    String(reference),
    mapProviderStatus(body.status ?? "PENDING"),
    String(providerEventId)
  );

  if (!result) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
