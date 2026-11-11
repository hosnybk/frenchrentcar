import { getLocale, translate } from "@/lib/translations";

export default async function PaymentSuccess({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = getLocale(lang);
  return (
    <section className="page-wrap admin-placeholder">
      <span className="eyebrow">FRC / PAYMENT</span>
      <h1>{locale === "fr" ? "Paiement non vérifié" : locale === "ar" ? "لم يتم التحقق من الدفع" : "Payment not verified"}</h1>
      <p>{translate(locale, "paymentDisabled")}</p>
      <span className="status-chip">NO PAYMENT RECORDED</span>
      <a className="text-link" href={`/${locale}/booking`}>{translate(locale, "backHome")} ↗</a>
    </section>
  );
}
