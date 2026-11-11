import Stripe from "stripe";

let stripeClient: Stripe | undefined;

/**
 * Returns the Stripe client. Test keys (sk_test_) work out of the box; a live key
 * (sk_live_) is only accepted when STRIPE_MODE=LIVE is set explicitly.
 */
export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY ?? "";
  const isTest = secretKey.startsWith("sk_test_");
  const isLive = secretKey.startsWith("sk_live_") && process.env.STRIPE_MODE === "LIVE";
  if (!isTest && !isLive) {
    throw new Error("STRIPE_NOT_CONFIGURED");
  }
  stripeClient ??= new Stripe(secretKey);
  return { stripe: stripeClient, livemode: isLive };
}
