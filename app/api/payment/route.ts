import { NextResponse } from "next/server";
import type { PaymentProviderName } from "@/models/payment";
import { GenericPaymentService } from "@/services/payment/paymentService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const provider = String(body.provider ?? "SWISH").toUpperCase() as PaymentProviderName;
    const amount = Number(body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "A positive payment amount is required" }, { status: 400 });
    }

    const service = new GenericPaymentService();
    const payment = await service.initiatePayment({
      amount,
      currency: body.currency ?? "SEK",
      provider,
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not initiate payment" },
      { status: 502 }
    );
  }
}
