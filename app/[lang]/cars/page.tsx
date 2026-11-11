import type { Metadata } from "next";
import { Suspense } from "react";
import CarsRoute from "@/components/CarsRoute";
import { getLocale } from "@/lib/translations";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = getLocale(lang);
  const title = locale === "fr" ? "Notre flotte" : locale === "ar" ? "أسطول السيارات" : "Our fleet";
  return {
    title,
    description:
      "Browse the French Rent Car fleet in Dubai and send a rental enquiry. Availability and rates are confirmed by our team.",
    alternates: {
      canonical: `/${locale}/cars`,
      languages: { en: "/en/cars", fr: "/fr/cars", ar: "/ar/cars" },
    },
  };
}

export default async function CarsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return (
    <Suspense fallback={<div className="page-wrap page-hero" />}>
      <CarsRoute locale={getLocale(lang)} />
    </Suspense>
  );
}
