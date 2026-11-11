// Cancellation & refund policy (see lib/legal-content.ts → cancellationPolicy):
// - cancelled ≥ 48 h before pick-up  → full refund;
// - cancelled < 48 h before pick-up  → one rental day withheld, the rest refunded;
// - pick-up time passed (no-show)     → no refund.
// "One rental day" = the average daily price actually paid (total ÷ booked days, rounded up),
// so weekly/monthly discounts are respected and the amount never exceeds what was paid.

const HOUR = 3_600_000;
export const FREE_CANCELLATION_HOURS = 48;

export type RefundRule = "FULL" | "LATE" | "NO_SHOW";

export type RefundQuote = {
  rule: RefundRule;
  hoursBeforePickup: number;
  paidAED: number;
  withheldAED: number;
  refundAED: number;
};

export function rentalDays(pickupAt: Date, returnAt: Date) {
  return Math.max(1, Math.ceil((returnAt.getTime() - pickupAt.getTime()) / 86_400_000));
}

export function refundQuote(
  booking: { pickupAt: Date; returnAt: Date },
  paidAED: number,
  now: Date = new Date(),
): RefundQuote {
  const hoursBeforePickup = (booking.pickupAt.getTime() - now.getTime()) / HOUR;
  if (hoursBeforePickup <= 0) {
    return { rule: "NO_SHOW", hoursBeforePickup, paidAED, withheldAED: paidAED, refundAED: 0 };
  }
  if (hoursBeforePickup >= FREE_CANCELLATION_HOURS) {
    return { rule: "FULL", hoursBeforePickup, paidAED, withheldAED: 0, refundAED: paidAED };
  }
  const oneDay = Math.min(paidAED, Math.ceil(paidAED / rentalDays(booking.pickupAt, booking.returnAt)));
  return { rule: "LATE", hoursBeforePickup, paidAED, withheldAED: oneDay, refundAED: paidAED - oneDay };
}
