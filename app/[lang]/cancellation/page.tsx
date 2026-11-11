import { LegalPage } from "@/components/ContentPages";
import { getLocale } from "@/lib/translations";

export default async function Cancellation({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <LegalPage locale={getLocale(lang)} kind="cancellation" />;
}
