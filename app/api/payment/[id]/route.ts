import { NextResponse } from "next/server";
import { paymentRepository } from "@/services/payment/paymentRepository";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payment = paymentRepository.findById(id);

  if (!payment) {
    return NextResponse.json(
      { error: "Payment not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(payment);
}
