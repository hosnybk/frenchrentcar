import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { findReservationForPayment } from "@/lib/payments";
import { getLocale, type Locale } from "@/lib/translations";
import { startCheckout } from "./actions";

export const instant = false;

export const metadata: Metadata = {
  title: "Payment",
  robots: { index: false, follow: false },
};

const COPY = {
  fr: {
    title: "Paiement de votre location",
    invalid: "Ce lien de paiement n’est pas valide. Vérifiez le lien reçu ou contactez-nous sur WhatsApp.",
    pending: "Votre demande n’est pas encore confirmée par notre équipe. Vous recevrez le lien de paiement après confirmation.",
    cancelled: "Cette réservation a été annulée. Contactez-nous pour toute question.",
    paid: "Merci ! Cette réservation est déjà payée.",
    vehicle: "Véhicule",
    pickup: "Départ",
    return: "Retour",
    total: "Montant à payer",
    pay: "Payer par carte",
    secure: "Paiement sécurisé par Stripe. Vos données de carte ne transitent pas par notre site.",
    deposit: "La caution est demandée séparément, à la remise du véhicule.",
    policy: "Politique d’annulation et de remboursement",
    unavailable: "Le paiement en ligne est momentanément indisponible. Réessayez plus tard ou contactez-nous sur WhatsApp.",
  },
  en: {
    title: "Pay for your rental",
    invalid: "This payment link is not valid. Check the link you received or contact us on WhatsApp.",
    pending: "Your request has not been confirmed by our team yet. You will receive the payment link once it is confirmed.",
    cancelled: "This booking has been cancelled. Contact us if you have any question.",
    paid: "Thank you! This booking is already paid.",
    vehicle: "Vehicle",
    pickup: "Pick-up",
    return: "Return",
    total: "Amount to pay",
    pay: "Pay by card",
    secure: "Secure payment by Stripe. Your card details never go through our website.",
    deposit: "The security deposit is collected separately, when the vehicle is handed over.",
    policy: "Cancellation and refund policy",
    unavailable: "Online payment is temporarily unavailable. Please try again later or contact us on WhatsApp.",
  },
  ar: {
    title: "دفع قيمة التأجير",
    invalid: "رابط الدفع هذا غير صالح. تحقق من الرابط أو تواصل معنا عبر واتساب.",
    pending: "لم يؤكد فريقنا طلبك بعد. ستتلقى رابط الدفع بعد التأكيد.",
    cancelled: "تم إلغاء هذا الحجز. تواصل معنا لأي استفسار.",
    paid: "شكراً! تم دفع هذا الحجز بالفعل.",
    vehicle: "السيارة",
    pickup: "الاستلام",
    return: "الإرجاع",
    total: "المبلغ المستحق",
    pay: "الدفع بالبطاقة",
    secure: "دفع آمن عبر Stripe. لا تمر بيانات بطاقتك عبر موقعنا.",
    deposit: "يُطلب مبلغ التأمين بشكل منفصل عند تسليم السيارة.",
    policy: "سياسة الإلغاء والاسترداد",
    unavailable: "الدفع عبر الإنترنت غير متاح مؤقتاً. حاول لاحقاً أو تواصل معنا عبر واتساب.",
  },
} as const;

type Params = Promise<{ lang: string; reference: string }>;
type Search = Promise<{ t?: string; error?: string }>;

export default async function PayPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const { lang, reference } = await params;
  const locale = getLocale(lang);
  return (
    <Suspense fallback={<section className="page-wrap pay-page" />}>
      <PayContent locale={locale} reference={reference} searchParams={searchParams} />
    </Suspense>
  );
}

async function PayContent({ locale, reference, searchParams }: { locale: Locale; reference: string; searchParams: Search }) {
  const { t = "", error } = await searchParams;
  const copy = COPY[locale];
  const reservation = await findReservationForPayment(reference, t);
  const format = new Intl.DateTimeFormat(locale === "ar" ? "ar-AE" : locale === "fr" ? "fr-FR" : "en-GB", {
    timeZone: "Asia/Dubai",
    dateStyle: "full",
    timeStyle: "short",
  });

  let state: keyof typeof copy | "payable" = "payable";
  if (!reservation) state = "invalid";
  else if (reservation.payment?.status === "PAID") state = "paid";
  else if (reservation.status === "CANCELLED") state = "cancelled";
  else if (reservation.status !== "CONFIRMED") state = "pending";

  return (
    <section className="page-wrap pay-page">
      <span className="eyebrow">FRENCH FOR CAR RENTAL CO.</span>
      <h1>{copy.title}</h1>
      {state !== "payable" || !reservation ? (
        <p className={state === "paid" ? "admin-notice" : "admin-notice is-error"}>{copy[state === "payable" ? "invalid" : state]}</p>
      ) : (
        <div className="pay-card">
          {reservation.vehicle.imageUrls[0] && (
            <Image src={reservation.vehicle.imageUrls[0]} alt={reservation.vehicle.name} width={640} height={400} className="pay-image" />
          )}
          <dl>
            <div><dt>Référence / Reference</dt><dd dir="ltr">{reservation.reference}</dd></div>
            <div><dt>{copy.vehicle}</dt><dd>{reservation.vehicle.name}</dd></div>
            <div><dt>{copy.pickup}</dt><dd>{format.format(reservation.pickupAt)}</dd></div>
            <div><dt>{copy.return}</dt><dd>{format.format(reservation.returnAt)}</dd></div>
            <div className="pay-total"><dt>{copy.total}</dt><dd dir="ltr">{reservation.estimatedAED.toLocaleString("en-US")} AED</dd></div>
          </dl>
          {error === "unavailable" && <p className="admin-notice is-error">{copy.unavailable}</p>}
          <form action={startCheckout}>
            <input type="hidden" name="reference" value={reservation.reference} />
            <input type="hidden" name="token" value={t} />
            <input type="hidden" name="lang" value={locale} />
            <button type="submit" className="button button-red button-full">{copy.pay} ↗</button>
          </form>
          <p className="pay-note">{copy.secure}</p>
          <p className="pay-note">{copy.deposit}</p>
          <a className="text-link" href={`/${locale}/cancellation`} target="_blank" rel="noreferrer">{copy.policy} ↗</a>
        </div>
      )}
    </section>
  );
}
