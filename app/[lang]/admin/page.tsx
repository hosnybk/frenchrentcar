import { AdminPlaceholder } from "@/components/ContentPages";
import { getLocale } from "@/lib/translations";

export default async function Admin({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <AdminPlaceholder locale={getLocale(lang)} />;
}
