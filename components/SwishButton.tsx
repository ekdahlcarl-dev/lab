"use client";

import { SwishPaymentService } from "@/services/payment/swishService";

export default function SwishButton() {
  const handlePayment = async () => {
    const service = new SwishPaymentService();

    const result = await service.initiatePayment({
      amount: 100,
      currency: "SEK",
      provider: "SWISH",
    });

    alert(`Payment ${result.status}: ${result.transactionId}`);
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-green-600 text-white rounded-xl py-3 font-semibold"
    >
      Pay with Swish
    </button>
  );
}
