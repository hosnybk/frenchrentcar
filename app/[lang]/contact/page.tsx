import type { Metadata } from "next";
import { ContactPage } from "@/components/ContentPages";
import { getLocale } from "@/lib/translations";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = getLocale(lang);
  return {
    title: locale === "fr" ? "Contact" : locale === "ar" ? "اتصل بنا" : "Contact",
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { en: "/en/contact", fr: "/fr/contact", ar: "/ar/contact" },
    },
  };
}

export default async function Contact({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <ContactPage locale={getLocale(lang)} />;
}
