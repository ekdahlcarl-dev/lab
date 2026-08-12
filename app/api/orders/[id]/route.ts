import { NextResponse } from "next/server";
import { orderService } from "@/services/order/orderService";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const order = await orderService.getOrderConfirmation(id);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json(order);
}
