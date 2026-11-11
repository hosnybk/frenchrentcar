import type { MetadataRoute } from "next";
import { vehicles } from "@/lib/vehicles";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://frenchrentcar.com";
const locales = ["en", "fr", "ar"];
const pages = ["", "/cars", "/services", "/about", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const localizedPages = locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: page === "" ? 1 : 0.7,
    })),
  );
  const vehiclePages = locales.flatMap((locale) =>
    vehicles.map((vehicle) => ({
      url: `${baseUrl}/${locale}/cars/${vehicle.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );
  return [...localizedPages, ...vehiclePages];
}
