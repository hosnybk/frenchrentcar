"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdmin, login, logout } from "@/lib/admin/session";
import { newPayToken } from "@/lib/payments";
import { refundQuote } from "@/lib/cancellation";
import { getStripe } from "@/lib/stripe";

const langSchema = z.enum(["en", "fr", "ar"]).catch("fr");
const statusFilterSchema = z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "ALL"]).catch("PENDING");

export type LoginState = { error: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const lang = langSchema.parse(formData.get("lang"));
  const parsed = z
    .object({ email: z.string().trim().min(3).max(254), password: z.string().min(1).max(200) })
    .safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: "E-mail ou mot de passe incorrect." };

  const result = await login(parsed.data.email, parsed.data.password);
  if (!result.ok) {
    return {
      error:
        result.reason === "LOCKED"
          ? "Trop de tentatives. Réessayez dans 15 minutes."
          : "E-mail ou mot de passe incorrect.",
    };
  }
  redirect(`/${lang}/admin`);
}

export async function logoutAction(formData: FormData) {
  const lang = langSchema.parse(formData.get("lang"));
  await logout();
  redirect(`/${lang}/admin`);
}

export async function updateReservationStatus(formData: FormData) {
  const lang = langSchema.parse(formData.get("lang"));
  const filter = statusFilterSchema.parse(formData.get("filter"));
  const back = (notice: string) => redirect(`/${lang}/admin?status=${filter}&notice=${notice}`);

  const admin = await getAdmin();
  if (!admin) redirect(`/${lang}/admin`);

  const input = z
    .object({ id: z.string().min(1).max(100), action: z.enum(["confirm", "cancel"]) })
    .safeParse({ id: formData.get("id"), action: formData.get("action") });
  if (!input.success) back("invalid");
  const { id, action } = input.data!;

  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: { payment: { select: { status: true } } },
  });
  if (!reservation || reservation.isDemo) back("not_found");

  if (action === "confirm") {
    if (reservation!.status !== "PENDING") back("not_pending");
    const conflict = await prisma.reservation.findFirst({
      where: {
        id: { not: id },
        vehicleId: reservation!.vehicleId,
        status: "CONFIRMED",
        pickupAt: { lt: reservation!.returnAt },
        returnAt: { gt: reservation!.pickupAt },
      },
      select: { reference: true },
    });
    if (conflict) back(`conflict_${conflict.reference}`);
    await prisma.reservation.update({
      where: { id },
      data: { status: "CONFIRMED", confirmedAt: new Date(), payToken: reservation!.payToken ?? newPayToken() },
    });
    back("confirmed");
  }

  // cancel
  if (reservation!.status !== "PENDING" && reservation!.status !== "CONFIRMED") back("not_cancellable");
  if (reservation!.payment?.status === "PAID") back("paid_refund_first");
  await prisma.reservation.update({ where: { id }, data: { status: "CANCELLED" } });
  back("cancelled");
}

/**
 * Cancels a PAID reservation and refunds the customer through Stripe.
 * mode "policy": amount from the cancellation policy (full / one day withheld / nothing after pick-up).
 * mode "full": full refund decided by staff (e.g. car unavailable, goodwill gesture).
 * The amount is always computed on the server; one refund at most per payment.
 */
export async function refundReservation(formData: FormData) {
  const lang = langSchema.parse(formData.get("lang"));
  const filter = statusFilterSchema.parse(formData.get("filter"));
  const back = (notice: string) => redirect(`/${lang}/admin?status=${filter}&notice=${notice}`);

  const admin = await getAdmin();
  if (!admin) redirect(`/${lang}/admin`);

  const input = z
    .object({ id: z.string().min(1).max(100), mode: z.enum(["policy", "full"]) })
    .safeParse({ id: formData.get("id"), mode: formData.get("mode") });
  if (!input.success) back("invalid");
  const { id, mode } = input.data!;

  const reservation = await prisma.reservation.findUnique({ where: { id }, include: { payment: true } });
  if (!reservation || reservation.isDemo) back("not_found");
  const payment = reservation!.payment;
  if (reservation!.status !== "CONFIRMED" || payment?.status !== "PAID" || !payment.stripePaymentId) {
    back("not_refundable");
  }

  const quote = refundQuote(reservation!, payment!.amountAED);
  const refundAED = mode === "full" ? payment!.amountAED : quote.refundAED;

  // Nothing to refund (no-show): cancel the booking, the payment stays with the company.
  if (refundAED === 0) {
    await prisma.reservation.update({ where: { id }, data: { status: "CANCELLED" } });
    back("cancelled_no_refund");
  }

  let stripeSetup: ReturnType<typeof getStripe>;
  try {
    stripeSetup = getStripe();
  } catch {
    back("stripe_unavailable");
  }
  const { stripe, livemode } = stripeSetup!;
  if (payment!.isTest === livemode) back("stripe_mode_mismatch");

  let refundId: string | null = null;
  try {
    const refund = await stripe.refunds.create(
      {
        payment_intent: payment!.stripePaymentId!,
        amount: refundAED * 100,
        reason: "requested_by_customer",
        metadata: { reservationId: id, paymentId: payment!.id, reference: reservation!.reference, mode },
      },
      // Same key for every attempt: a double click or a retry can never refund twice.
      { idempotencyKey: `refund-${payment!.id}` },
    );
    if (refund.status === "succeeded" || refund.status === "pending") refundId = refund.id;
    else console.error("[refund] Stripe refund status", refund.status);
  } catch (error) {
    const e = error as { type?: string; code?: string; statusCode?: number };
    console.error("[refund] Stripe error", e?.type ?? "unknown", e?.code ?? "", e?.statusCode ?? "");
  }
  if (!refundId) back("refund_failed");

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment!.id },
      data: {
        status: refundAED >= payment!.amountAED ? "REFUNDED" : "PARTIALLY_REFUNDED",
        refundedAED: refundAED,
        stripeRefundId: refundId,
        refundedAt: new Date(),
      },
    }),
    prisma.reservation.update({ where: { id }, data: { status: "CANCELLED" } }),
  ]);
  back("refunded");
}
