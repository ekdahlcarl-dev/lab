import { NextResponse } from "next/server";
import { paymentRepository } from "@/services/payment/paymentRepository";
import { mapProviderStatus } from "@/services/payment/paymentStatus";

export async function POST(request: Request) {
  const body = await request.json();
  const id = body.id ?? body.payeePaymentReference ?? body.paymentReference;

  if (!id) {
    return NextResponse.json({ error: "Payment id is required" }, { status: 400 });
  }

  const payment = paymentRepository.updateStatus(id, mapProviderStatus(body.status ?? "PENDING"));

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  return NextResponse.json(payment);
}
