import type { Metadata } from "next";
import { ServicesPage } from "@/components/ContentPages";
import { getLocale } from "@/lib/translations";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = getLocale(lang);
  return {
    title: locale === "fr" ? "Nos services de location" : locale === "ar" ? "خدماتنا" : "Car Rental Services",
    alternates: {
      canonical: `/${locale}/services`,
      languages: { en: "/en/services", fr: "/fr/services", ar: "/ar/services" },
    },
  };
}

export default async function Services({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <ServicesPage locale={getLocale(lang)} />;
}
