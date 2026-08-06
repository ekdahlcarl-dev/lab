import { PaymentProvider } from './PaymentProvider';
import { Order } from '../../models/Order';
import { Payment } from '../../models/Payment';

export class SwishProvider implements PaymentProvider {
  async createPayment(order: Order): Promise<Payment> {
    // Placeholder for Swish API integration
    return {
      id: crypto.randomUUID(),
      amount: order.amount,
      currency: order.currency,
      status: 'PENDING',
      provider: 'SWISH'
    };
  }

  async checkStatus(id: string): Promise<Payment> {
    // Placeholder for Swish callback/status lookup
    return {
      id,
      amount: 0,
      currency: 'SEK',
      status: 'PENDING',
      provider: 'SWISH'
    };
  }
}
