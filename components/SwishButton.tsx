"use client";

export default function SwishButton() {
  const handlePayment = async () => {
    const response = await fetch("/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 100,
        currency: "SEK",
      }),
    });

    const result = await response.json();

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
