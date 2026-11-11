import { getLocale } from "@/lib/translations";

const COPY = {
  fr: {
    title: "Merci pour votre paiement",
    body: "Votre paiement est en cours de confirmation par Stripe. Notre équipe vous contactera sur WhatsApp pour organiser la remise du véhicule.",
  },
  en: {
    title: "Thank you for your payment",
    body: "Your payment is being confirmed by Stripe. Our team will contact you on WhatsApp to arrange the vehicle handover.",
  },
  ar: {
    title: "شكراً على الدفع",
    body: "يتم الآن تأكيد الدفع عبر Stripe. سيتواصل معك فريقنا عبر واتساب لترتيب تسليم السيارة.",
  },
} as const;

export default async function PaymentSuccess({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = getLocale(lang);
  const copy = COPY[locale];
  return (
    <section className="page-wrap admin-placeholder">
      <span className="eyebrow">FRENCH FOR CAR RENTAL CO.</span>
      <h1>{copy.title}</h1>
      <p>{copy.body}</p>
      <a className="text-link" href={`/${locale}`}>French Rent Car ↗</a>
    </section>
  );
}
