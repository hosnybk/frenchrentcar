import { getLocale, translate } from "@/lib/translations";

export default async function Checkout({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = getLocale(lang);
  const paymentNotAvailable = translate(locale, "paymentDisabled");

  return (
    <section className="page-wrap admin-placeholder">
      <span className="eyebrow">FRC / STRIPE TEST</span>
      <h1>{translate(locale, "paymentTitle")}</h1>
      <p>{paymentNotAvailable}</p>
      <span className="status-chip">CHECKOUT DISABLED · DEMO PRICES</span>
      <a className="text-link" href={`/${locale}/booking`}>{translate(locale, "requestBooking")} ↗</a>
    </section>
  );
}
