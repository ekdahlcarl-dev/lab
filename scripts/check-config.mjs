const mode = process.env.PAYMENT_MODE ?? "mock";

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set: runtime will use non-durable storage.");
}

if (mode === "swish") {
  const required = ["SWISH_API_URL", "SWISH_CALLBACK_URL", "SWISH_PAYEE_ALIAS"];
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length) {
    console.error(`Missing required Swish configuration: ${missing.join(", ")}`);
    process.exit(1);
  }
}

if (!['mock', 'swish'].includes(mode)) {
  console.error(`Unsupported PAYMENT_MODE: ${mode}`);
  process.exit(1);
}

console.log(`Configuration check passed for PAYMENT_MODE=${mode}.`);
