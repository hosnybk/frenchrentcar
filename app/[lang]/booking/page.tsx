import type { Metadata } from "next";
import { Suspense } from "react";
import BookingRoute from "@/components/BookingRoute";
import { getLocale } from "@/lib/translations";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = getLocale(lang);
  return {
    title: locale === "fr" ? "Demande de réservation" : locale === "ar" ? "طلب حجز" : "Rental Enquiry",
    robots: { index: false, follow: true },
  };
}

export default async function Booking({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return (
    <Suspense fallback={<div className="page-wrap page-hero" />}>
      <BookingRoute locale={getLocale(lang)} />
    </Suspense>
  );
}
