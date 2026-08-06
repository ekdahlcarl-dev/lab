import { PaymentProvider } from './PaymentProvider';
import { SwishProvider } from './SwishProvider';

export function getPaymentProvider(type: string): PaymentProvider {
  switch (type.toUpperCase()) {
    case 'SWISH':
      return new SwishProvider();
    default:
      throw new Error(`Unsupported payment provider: ${type}`);
  }
}
