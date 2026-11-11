import { getLocale } from "@/lib/translations";

const COPY = {
  fr: { title: "Paiement non effectué", body: "Aucun montant n’a été débité. Vous pouvez reprendre le paiement à tout moment avec le lien reçu sur WhatsApp." },
  en: { title: "Payment not completed", body: "No amount has been charged. You can resume the payment at any time with the link you received on WhatsApp." },
  ar: { title: "لم تتم عملية الدفع", body: "لم يتم خصم أي مبلغ. يمكنك استكمال الدفع في أي وقت عبر الرابط الذي استلمته على واتساب." },
} as const;

export default async function PaymentCancel({ params }: { params: Promise<{ lang: string }> }) {
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
