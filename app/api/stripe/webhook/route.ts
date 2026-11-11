import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getTestStripe } from "@/lib/stripe";

function isUniqueConstraint(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
  if (!signature || !signingSecret.startsWith("whsec_")) {
    return Response.json({ error: "WEBHOOK_NOT_CONFIGURED" }, { status: 503 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getTestStripe();
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, signature, signingSecret);
  } catch {
    return Response.json({ error: "INVALID_WEBHOOK_SIGNATURE" }, { status: 400 });
  }

  const supported =
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_failed" ||
    event.type === "checkout.session.expired";
  if (!supported) return Response.json({ received: true });

  const session = event.data.object as Stripe.Checkout.Session;
  const paymentId = session.metadata?.paymentId;
  if (!paymentId) return Response.json({ error: "MISSING_PAYMENT_REFERENCE" }, { status: 400 });

  try {
    await prisma.$transaction(async (tx) => {
      await tx.stripeEvent.create({
        data: { id: event.id, type: event.type },
      });

      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: { reservation: true },
      });
      if (!payment || !payment.isTest || payment.reservation.isDemo) {
        throw new Error("PAYMENT_REFERENCE_INVALID");
      }

      if (event.type === "checkout.session.completed") {
        const amountMatches =
          session.currency === "aed" &&
          session.amount_total === payment.amountAED * 100 &&
          session.payment_status === "paid";
        if (!amountMatches) throw new Error("PAYMENT_AMOUNT_MISMATCH");

        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: "PAID",
            stripeSessionId: session.id,
            stripePaymentId:
              typeof session.payment_intent === "string" ? session.payment_intent : null,
          },
        });
        // A successful payment never confirms the rental; staff must review it.
      } else if (payment.status !== "PAID") {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: "FAILED",
            stripeSessionId: session.id,
          },
        });
      }
    });
  } catch (error) {
    if (isUniqueConstraint(error)) return Response.json({ received: true });
    return Response.json({ error: "WEBHOOK_PROCESSING_FAILED" }, { status: 400 });
  }

  return Response.json({ received: true });
}
