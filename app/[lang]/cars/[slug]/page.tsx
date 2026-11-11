import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VehicleDetail from "@/components/VehicleDetail";
import { getLocale } from "@/lib/translations";
import { getVehicle, vehicles } from "@/lib/vehicles";
import { vehicleCategory } from "@/lib/vehicle-copy";

export function generateStaticParams() {
  return vehicles.map((vehicle) => ({ slug: vehicle.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) return { title: "Vehicle" };
  const locale = getLocale(lang);
  return {
    title: `${vehicle.name} · ${vehicleCategory(locale, vehicle.category)}`,
    description:
      "Demonstration vehicle details and indicative rental estimates. Availability and all commercial terms are subject to confirmation.",
    alternates: {
      canonical: `/${locale}/cars/${vehicle.slug}`,
      languages: {
        en: `/en/cars/${vehicle.slug}`,
        fr: `/fr/cars/${vehicle.slug}`,
        ar: `/ar/cars/${vehicle.slug}`,
      },
    },
  };
}

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) notFound();
  return <VehicleDetail locale={getLocale(lang)} vehicle={vehicle} />;
}
