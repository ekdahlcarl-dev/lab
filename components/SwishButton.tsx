"use client";

interface SwishButtonProps {
  amount: number;
}

export default function SwishButton({ amount }: SwishButtonProps) {
  const handlePayment = async () => {
    const response = await fetch("/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "SEK",
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error ?? "Payment could not be started.");
      return;
    }

    alert(`Payment ${result.status}: ${result.transactionId}`);
  };

  return (
    <button
      onClick={handlePayment}
      disabled={amount <= 0}
      className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      Pay {amount} SEK with Swish
    </button>
  );
}
