import { NextResponse } from "next/server";
import { paymentRepository } from "@/services/payment/paymentRepository";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const payment = paymentRepository.get(params.id);

  if (!payment) {
    return NextResponse.json(
      { error: "Payment not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(payment);
}
