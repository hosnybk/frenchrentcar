import Stripe from "stripe";

let stripeClient: Stripe | undefined;

export function getTestStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY ?? "";
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
  const isTestOnly =
    process.env.STRIPE_MODE === "TEST" &&
    process.env.DEMO_DATA === "false" &&
    process.env.ALLOW_TEST_PAYMENTS === "true" &&
    secretKey.startsWith("sk_test_") &&
    publishableKey.startsWith("pk_test_");

  if (!isTestOnly) {
    throw new Error("TEST_CHECKOUT_NOT_CONFIGURED");
  }

  stripeClient ??= new Stripe(secretKey);
  return stripeClient;
}
