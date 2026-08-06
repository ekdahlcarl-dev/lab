import { NextResponse } from "next/server";
import { SwishPaymentService } from "@/services/payment/swishService";

export async function POST(request: Request) {
  const body = await request.json();

  const service = new SwishPaymentService();

  const result = await service.initiatePayment({
    amount: body.amount,
    currency: body.currency ?? "SEK",
    provider: "SWISH",
  });

  return NextResponse.json(result);
}
