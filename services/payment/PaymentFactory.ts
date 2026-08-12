import type { PaymentProvider } from "./PaymentProvider";
import { MockSwishProvider } from "./MockSwishProvider";
import { SwishProvider } from "./SwishProvider";

export function getPaymentProvider(type: string): PaymentProvider {
  switch (type.toUpperCase()) {
    case "SWISH":
      return process.env.PAYMENT_MODE === "swish"
        ? new SwishProvider()
        : new MockSwishProvider();
    default:
      throw new Error(`Unsupported payment provider: ${type}`);
  }
}
