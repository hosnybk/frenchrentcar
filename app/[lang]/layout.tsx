import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@fontsource/noto-naskh-arabic/arabic-400.css";
import "@fontsource/noto-sans-arabic/arabic-400.css";
import "../globals.css";
import { SiteLayout } from "@/components/SiteChrome";
import { Locale, getLocale, locales } from "@/lib/translations";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = getLocale(lang);
  const titles: Record<Locale, string> = {
    en: "French Rent Car | Premium Car Rental in Dubai",
    fr: "French Rent Car | Location de voitures premium à Dubaï",
    ar: "فرنش رنت كار | تأجير سيارات متميز في دبي",
  };
  const descriptions: Record<Locale, string> = {
    en: "Discover Dubai your way with French Rent Car. Explore our fleet and send a rental enquiry.",
    fr: "Découvrez Dubaï à votre façon avec French Rent Car. Explorez notre flotte et envoyez votre demande de location.",
    ar: "اكتشف دبي بأسلوبك مع فرنش رنت كار. اطّلع على أسطولنا وأرسل طلب التأجير.",
  };
  const openGraphLocales: Record<Locale, string> = {
    en: "en_AE",
    fr: "fr_AE",
    ar: "ar_AE",
  };
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://frenchrentcar.com",
    ),
    title: {
      default: titles[locale],
      template: "%s | French Rent Car Dubai",
    },
    description: descriptions[locale],
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      siteName: "French Rent Car",
      locale: openGraphLocales[locale],
      type: "website",
      images: ["/images/dubai-hero.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!locales.includes(lang as (typeof locales)[number])) notFound();
  const locale = getLocale(lang);

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <SiteLayout locale={locale}>{children}</SiteLayout>
      </body>
    </html>
  );
}
