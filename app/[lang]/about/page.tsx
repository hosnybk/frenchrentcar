import type { Metadata } from "next";
import { AboutPage } from "@/components/ContentPages";
import { getLocale } from "@/lib/translations";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = getLocale(lang);
  return {
    title: locale === "fr" ? "À propos" : locale === "ar" ? "من نحن" : "About French Rent Car",
    alternates: {
      canonical: `/${locale}/about`,
      languages: { en: "/en/about", fr: "/fr/about", ar: "/ar/about" },
    },
  };
}

export default async function About({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <AboutPage locale={getLocale(lang)} />;
}
