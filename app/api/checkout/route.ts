import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getTestStripe } from "@/lib/stripe";

const checkoutSchema = z.object({
  reservationId: z.string().min(1).max(100),
  locale: z.enum(["en", "fr", "ar"]).default("en"),
});

export async function POST(request: Request) {
  let payload: z.infer<typeof checkoutSchema>;
  try {
    payload = checkoutSchema.parse(await request.json());
  } catch {
    return Response.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    return Response.json({ error: "PAYMENT_CONFIGURATION_REQUIRED" }, { status: 503 });
  }

  let origin: string;
  try {
    origin = new URL(siteUrl).origin;
  } catch {
    return Response.json({ error: "PAYMENT_CONFIGURATION_REQUIRED" }, { status: 503 });
  }

  try {
    const stripe = getTestStripe();
    const reservation = await prisma.reservation.findUnique({
      where: { id: payload.reservationId },
      include: { vehicle: true, payment: true },
    });

    if (
      !reservation ||
      reservation.isDemo ||
      reservation.vehicle.isDemo ||
      !reservation.vehicle.isActive ||
      reservation.status !== "PENDING" ||
      reservation.estimatedAED < 1
    ) {
      return Response.json({ error: "PAYMENT_NOT_AVAILABLE" }, { status: 409 });
    }

    const payment = await prisma.payment.upsert({
      where: { reservationId: reservation.id },
      create: {
        reservationId: reservation.id,
        amountAED: reservation.estimatedAED,
        currency: "aed",
        status: "PENDING",
        isTest: true,
      },
      update: {
        amountAED: reservation.estimatedAED,
        currency: "aed",
        status: "PENDING",
        isTest: true,
      },
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "aed",
            unit_amount: reservation.estimatedAED * 100,
            product_data: {
              name: `${reservation.vehicle.name} rental request`,
              description: `Pending request ${reservation.reference}; final rental terms require confirmation.`,
            },
          },
        },
      ],
      metadata: {
        reservationId: reservation.id,
        paymentId: payment.id,
        demo: "false",
      },
      success_url: `${origin}/${payload.locale}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${payload.locale}/payment/cancel`,
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: { stripeSessionId: session.id },
    });

    return Response.json(
      { checkoutUrl: session.url },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "TEST_CHECKOUT_NOT_CONFIGURED") {
      return Response.json({ error: "TEST_CHECKOUT_NOT_CONFIGURED" }, { status: 503 });
    }
    return Response.json({ error: "CHECKOUT_UNAVAILABLE" }, { status: 503 });
  }
}
