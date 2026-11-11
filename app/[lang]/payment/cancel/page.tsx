import { getLocale, translate } from "@/lib/translations";

export default async function PaymentCancel({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = getLocale(lang);
  return (
    <section className="page-wrap admin-placeholder">
      <span className="eyebrow">FRC / PAYMENT</span>
      <h1>{locale === "fr" ? "Aucun paiement effectué" : locale === "ar" ? "لم يتم إجراء أي دفع" : "No payment taken"}</h1>
      <p>{translate(locale, "paymentDisabled")}</p>
      <span className="status-chip">CHECKOUT NOT STARTED</span>
      <a className="text-link" href={`/${locale}/booking`}>{translate(locale, "backHome")} ↗</a>
    </section>
  );
}
