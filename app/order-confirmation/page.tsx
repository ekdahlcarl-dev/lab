"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type Confirmation = {
  orderId: string;
  orderStatus: "pending_payment" | "paid" | "payment_failed" | "cancelled";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  amount?: number;
  currency?: string;
  customerEmail?: string;
};

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<StateCard title="Checking payment status…" detail="Loading your order." />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}

function OrderConfirmationContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const [order, setOrder] = useState<Confirmation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders/${orderId}`)
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error ?? "Could not load order");
        return body;
      })
      .then(setOrder)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load order"));
  }, [orderId]);

  if (!orderId) return <StateCard title="Order reference missing" detail="Return to your cart and try again." actionHref="/cart" actionLabel="Back to cart" />;
  if (error) return <StateCard title="We could not load your order" detail={error} actionHref="/cart" actionLabel="Back to cart" />;
  if (!order) return <StateCard title="Checking payment status…" detail={`Order ${orderId}`} />;

  if (order.paymentStatus === "COMPLETED" && order.orderStatus === "paid") {
    return <StateCard title="Payment successful" detail={`Thank you. Your order ${order.orderId} is confirmed.${order.customerEmail ? ` A receipt can be sent to ${order.customerEmail}.` : ""}`} order={order} actionHref="/products" actionLabel="Continue shopping" />;
  }

  if (order.paymentStatus === "FAILED" || order.orderStatus === "payment_failed") {
    return <StateCard title="Payment failed" detail={`Order ${order.orderId} has not been paid. No paid order has been recorded.`} order={order} actionHref="/checkout" actionLabel="Retry payment" />;
  }

  if (order.paymentStatus === "CANCELLED" || order.orderStatus === "cancelled") {
    return <StateCard title="Payment cancelled" detail={`Order ${order.orderId} was cancelled and is not marked as paid.`} order={order} actionHref="/checkout" actionLabel="Try again" />;
  }

  return <StateCard title="Payment pending" detail={`Order ${order.orderId} is waiting for payment confirmation. Refresh this page to check again.`} order={order} actionHref={`/order-confirmation?orderId=${order.orderId}`} actionLabel="Refresh status" />;
}

function StateCard({ title, detail, order, actionHref, actionLabel }: { title: string; detail: string; order?: Confirmation; actionHref?: string; actionLabel?: string }) {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <section className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Order confirmation</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">{title}</h1>
        <p className="mt-4 text-slate-600">{detail}</p>
        {order && (
          <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm">
            <div className="flex justify-between"><span>Order reference</span><strong>{order.orderId}</strong></div>
            {order.amount !== undefined && <div className="mt-2 flex justify-between"><span>Total</span><strong>{order.amount} {order.currency ?? "SEK"}</strong></div>}
            <div className="mt-2 flex justify-between"><span>Payment status</span><strong>{order.paymentStatus}</strong></div>
          </div>
        )}
        {actionHref && actionLabel && <Link href={actionHref} className="mt-6 inline-block rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white">{actionLabel}</Link>}
      </section>
    </main>
  );
}
