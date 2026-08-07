import { NextResponse } from "next/server";
import { PaymentRepository } from "@/services/payment/paymentRepository";

const repository = new PaymentRepository();

export async function POST(request: Request) {
  const body = await request.json();

  const payment = repository.updateStatus(body.id, "COMPLETED");

  if (!payment) {
    return NextResponse.json(
      { error: "Payment not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(payment);
}
