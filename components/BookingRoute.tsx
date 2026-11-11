"use client";

import { useSearchParams } from "next/navigation";
import { BookingPage } from "@/components/ContentPages";
import { Locale } from "@/lib/translations";

export default function BookingRoute({ locale }: { locale: Locale }) {
  const query = useSearchParams();
  return (
    <BookingPage
      locale={locale}
      initialVehicle={query.get("vehicle") ?? ""}
      initialPickupDate={query.get("pickupDate") ?? ""}
      initialReturnDate={query.get("returnDate") ?? ""}
      initialPickupTime={query.get("pickupTime") ?? ""}
      initialReturnTime={query.get("returnTime") ?? ""}
    />
  );
}
