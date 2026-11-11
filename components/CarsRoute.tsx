"use client";

import { useSearchParams } from "next/navigation";
import CarsCatalog from "@/components/CarsCatalog";
import { Locale } from "@/lib/translations";

export default function CarsRoute({ locale }: { locale: Locale }) {
  const query = useSearchParams();
  const category = query.get("category") ?? "";
  const pickup = query.get("pickup") ?? "";
  const dropoff = query.get("dropoff") ?? "";
  const pickupDate = query.get("pickupDate") ?? "";
  const returnDate = query.get("returnDate") ?? "";
  const pickupTime = query.get("pickupTime") ?? "";
  const returnTime = query.get("returnTime") ?? "";
  const locations = pickup && dropoff ? `${pickup} → ${dropoff}` : pickup || dropoff;
  const dates =
    pickupDate && returnDate
      ? `${pickupDate}${pickupTime ? ` ${pickupTime}` : ""} — ${returnDate}${returnTime ? ` ${returnTime}` : ""}`
      : "";
  const searchSummary = [locations, dates].filter(Boolean).join(" · ");

  return (
    <CarsCatalog
      locale={locale}
      startingCategory={category}
      searchSummary={searchSummary}
    />
  );
}
