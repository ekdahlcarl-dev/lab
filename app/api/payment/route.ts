import { NextResponse } from "next/server";
import { SwishPaymentService } from "@/services/payment/swishService";
import { PaymentRepository } from "@/services/payment/paymentRepository";

const repository = new PaymentRepository();

export async function POST(request: Request) {
  const body = await request.json();

  const service = new SwishPaymentService();

  const result = await service.initiatePayment({
    amount: body.amount,
    currency: body.currency ?? "SEK",
    provider: "SWISH",
  });

  const storedPayment = repository.save({
    ...result,
    id: crypto.randomUUID(),
    amount: body.amount,
    currency: body.currency ?? "SEK",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json(storedPayment);
}
