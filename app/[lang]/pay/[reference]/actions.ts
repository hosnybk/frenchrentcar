"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { findReservationForPayment, siteOrigin } from "@/lib/payments";
import { getStripe } from "@/lib/stripe";

const inputSchema = z.object({
  reference: z.string().regex(/^FRC-[A-Z0-9]{8}$/),
  token: z.string().min(20).max(100),
  lang: z.enum(["en", "fr", "ar"]),
});

const dubaiDay = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dubai", dateStyle: "medium", timeStyle: "short" });

/** Starts (or resumes) a Stripe Checkout Session for a confirmed, unpaid reservation. */
export async function startCheckout(formData: FormData) {
  const parsed = inputSchema.safeParse({
    reference: formData.get("reference"),
    token: formData.get("token"),
    lang: formData.get("lang"),
  });
  if (!parsed.success) redirect("/");
  const { reference, token, lang } = parsed.data;
  const payPage = `/${lang}/pay/${reference}?t=${encodeURIComponent(token)}`;

  const reservation = await findReservationForPayment(reference, token);
  if (!reservation || reservation.status !== "CONFIRMED" || reservation.payment?.status === "PAID") {
    redirect(payPage);
  }

  let stripeSetup: ReturnType<typeof getStripe>;
  try {
    stripeSetup = getStripe();
  } catch {
    redirect(`${payPage}&error=unavailable`);
  }
  const { stripe, livemode } = stripeSetup;

  // Reuse an open Checkout Session so a customer cannot pay twice for the same booking.
  if (reservation.payment?.stripeSessionId) {
    let reuseUrl: string | null = null;
    let alreadyComplete = false;
    try {
      const existing = await stripe.checkout.sessions.retrieve(reservation.payment.stripeSessionId);
      if (existing.status === "open" && existing.url && existing.amount_total === reservation.estimatedAED * 100) {
        reuseUrl = existing.url;
      }
      alreadyComplete = existing.status === "complete";
    } catch {
      // Unknown or expired session: create a new one below.
    }
    if (reuseUrl) redirect(reuseUrl);
    if (alreadyComplete) redirect(payPage);
  }

  const payment = await prisma.payment.upsert({
    where: { reservationId: reservation.id },
    create: {
      reservationId: reservation.id,
      amountAED: reservation.estimatedAED,
      currency: "aed",
      status: "PENDING",
      isTest: !livemode,
    },
    update: { amountAED: reservation.estimatedAED, currency: "aed", status: "PENDING", isTest: !livemode },
  });

  const origin = siteOrigin((await headers()).get("host"));
  const period = `${dubaiDay.format(reservation.pickupAt)} → ${dubaiDay.format(reservation.returnAt)} (Dubai time)`;
  let checkoutUrl: string | null = null;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "aed",
            unit_amount: reservation.estimatedAED * 100,
            product_data: {
              name: `${reservation.vehicle.name} — ${reservation.reference}`,
              description: period,
            },
          },
        },
      ],
      customer_email: reservation.email,
      client_reference_id: reservation.reference,
      metadata: { reservationId: reservation.id, paymentId: payment.id, reference: reservation.reference },
      payment_intent_data: {
        description: `French Rent Car ${reservation.reference}`,
        metadata: { reservationId: reservation.id, paymentId: payment.id, reference: reservation.reference },
      },
      success_url: `${origin}/${lang}/payment/success?ref=${reservation.reference}`,
      cancel_url: `${origin}${payPage}`,
    });
    await prisma.payment.update({ where: { id: payment.id }, data: { stripeSessionId: session.id } });
    checkoutUrl = session.url;
  } catch (error) {
    console.error("[checkout] Stripe error", error instanceof Error ? error.name : "unknown");
  }
  if (!checkoutUrl) redirect(`${payPage}&error=unavailable`);
  redirect(checkoutUrl);
}
