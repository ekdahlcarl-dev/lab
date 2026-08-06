import { NextResponse } from 'next/server';
import { SwishProvider } from '../../../services/payment/SwishProvider';

export async function POST(request: Request) {
  const order = await request.json();

  const provider = new SwishProvider();
  const payment = await provider.createPayment(order);

  return NextResponse.json(payment);
}
