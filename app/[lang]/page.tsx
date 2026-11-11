import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { Locale, getLocale, locales, translate } from "@/lib/translations";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = getLocale(lang);
  const titles: Record<Locale, string> = {
    en: "Premium Car Rental in Dubai",
    fr: "Location de voitures premium à Dubaï",
    ar: "تأجير سيارات متميز في دبي",
  };
  const descriptions: Record<Locale, string> = {
    en: "Explore the French Rent Car fleet and send a rental enquiry in Dubai.",
    fr: "Découvrez la flotte French Rent Car et envoyez votre demande de location à Dubaï.",
    ar: "اكتشف أسطول فرنش رنت كار وأرسل طلب تأجير في دبي.",
  };
  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((item) => [item, `/${item}`])),
    },
  };
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = getLocale(lang);
  const companySchema = {
    "@context": "https://schema.org",
    "@type": "CarRental",
    name: "French Rent Car",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
    areaServed: "Dubai, United Arab Emirates",
    description: translate(locale, "heroBody"),
    url: `https://frenchrentcar.com/${locale}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(companySchema) }}
      />
      <HomePage locale={locale} />
    </>
  );
}
