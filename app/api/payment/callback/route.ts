import { NextResponse } from "next/server";
import { paymentRepository } from "@/services/payment/paymentRepository";

export async function POST(request: Request) {
  const body = await request.json();

  const payment = paymentRepository.updateStatus(body.id, "COMPLETED");

  if (!payment) {
    return NextResponse.json(
      { error: "Payment not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(payment);
}
