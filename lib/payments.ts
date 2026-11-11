// Customer payment links: /<locale>/pay/<reference>?t=<token>
// Server-only helpers (database access).
import { randomBytes, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

export function newPayToken() {
  return randomBytes(24).toString("base64url");
}

function sameToken(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/** Loads a reservation for its payment page; null unless reference AND token match. */
export async function findReservationForPayment(reference: string, token: string) {
  if (!/^FRC-[A-Z0-9]{8}$/.test(reference) || token.length < 20 || token.length > 100) return null;
  const reservation = await prisma.reservation.findUnique({
    where: { reference },
    include: {
      vehicle: { select: { name: true, slug: true, imageUrls: true } },
      payment: { select: { status: true, stripeSessionId: true, isTest: true } },
    },
  });
  if (!reservation?.payToken || reservation.isDemo || !sameToken(reservation.payToken, token)) return null;
  return reservation;
}

export function siteOrigin(fallbackHost?: string | null) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) {
    try {
      return new URL(configured).origin;
    } catch {
      // fall through
    }
  }
  if (!fallbackHost) return "https://frenchrentcar.vercel.app";
  const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(fallbackHost);
  return `${local ? "http" : "https"}://${fallbackHost}`;
}

export function payLink(origin: string, locale: string, reference: string, token: string) {
  return `${origin}/${locale}/pay/${reference}?t=${encodeURIComponent(token)}`;
}
