"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Locale, translate } from "@/lib/translations";
import { vehicles, VehicleCategory } from "@/lib/vehicles";
import { vehicleCategory } from "@/lib/vehicle-copy";

const categoryValues: VehicleCategory[] = [
  "Economy",
  "Sedan",
  "SUV",
  "Luxury",
  "Sports",
];

export function VehicleCard({
  locale,
  vehicle,
}: {
  locale: Locale;
  vehicle: (typeof vehicles)[number];
}) {
  return (
    <article className="car-card">
      <a
        className="car-photo"
        href={`/${locale}/cars/${vehicle.slug}`}
        aria-label={`${translate(locale, "viewDetails")}: ${vehicle.name}`}
      >
        <Image
          src={vehicle.image}
          alt={`${vehicle.name}, demonstration vehicle`}
          fill
          sizes="(max-width: 760px) 90vw, 33vw"
        />
        <span className="demo-pill">{translate(locale, "demo")}</span>
        <span className="photo-arrow" aria-hidden="true">↗</span>
      </a>
      <div className="car-card-info">
        <div>
          <span className="car-category">
            {vehicleCategory(locale, vehicle.category)} · {vehicle.year}
          </span>
          <h3>{vehicle.name}</h3>
        </div>
        <div className="card-price">
          <strong>{vehicle.daily.toLocaleString(locale)} <small>AED</small></strong>
          <span>{translate(locale, "perDay")}</span>
        </div>
      </div>
      <div className="car-card-meta">
        <span>♧ &nbsp;{vehicle.seats} {translate(locale, "seats").toLowerCase()}</span>
        <span>◌ &nbsp;{translate(locale, "automatic")}</span>
        <a href={`/${locale}/cars/${vehicle.slug}`}>{translate(locale, "viewDetails")} ↗</a>
      </div>
      <div className="availability-label">
        <span className="small-dot" />
        {translate(locale, "availabilityDemo")}
      </div>
    </article>
  );
}

export default function CarsCatalog({
  locale,
  startingCategory = "",
  searchSummary = "",
}: {
  locale: Locale;
  startingCategory?: string;
  searchSummary?: string;
}) {
  const [category, setCategory] = useState(startingCategory);
  const [seats, setSeats] = useState("");
  const [maxPrice, setMaxPrice] = useState(2_000);
  const [sort, setSort] = useState("popular");

  const filtered = useMemo(() => {
    const result = vehicles.filter((vehicle) => {
      return (
        (!category || vehicle.category === category) &&
        (!seats || vehicle.seats >= Number(seats)) &&
        vehicle.daily <= maxPrice
      );
    });
    if (sort === "low") result.sort((a, b) => a.daily - b.daily);
    if (sort === "high") result.sort((a, b) => b.daily - a.daily);
    if (sort === "popular") result.sort((a, b) => a.popular - b.popular);
    return result;
  }, [category, seats, maxPrice, sort]);

  return (
    <>
      <section className="page-hero page-wrap">
        <span className="eyebrow">{translate(locale, "demoBannerShort")}</span>
        <h1 className="display-heading">{translate(locale, "carPageTitle")}</h1>
        <p>{translate(locale, "carPageSubtitle")}</p>
      </section>
      <div className="page-wrap catalog-wrap">
        {searchSummary && (
          <div className="search-summary">
            <span className="small-dot" />
            <strong>{translate(locale, "searchSummary")}</strong>
            <span>{searchSummary}</span>
            <a href={`/${locale}/booking`}>{translate(locale, "bookNow")} ↗</a>
          </div>
        )}
        <div className="catalog-toolbar">
          <div className="filter-controls">
            <label>
              <span>{translate(locale, "category")}</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">{translate(locale, "allCategories")}</option>
                {categoryValues.map((value) => (
                  <option value={value} key={value}>{vehicleCategory(locale, value)}</option>
                ))}
              </select>
            </label>
            <label>
              <span>{translate(locale, "seats")}</span>
              <select value={seats} onChange={(e) => setSeats(e.target.value)}>
                <option value="">—</option>
                <option value="2">2+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
                <option value="7">7+</option>
              </select>
            </label>
            <label className="price-range">
              <span>{translate(locale, "filter")} · AED {maxPrice.toLocaleString(locale)}</span>
              <input
                type="range"
                min="200"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
            </label>
          </div>
          <label className="sort-control">
            <span>{translate(locale, "sort")}</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="popular">{translate(locale, "sortPopular")}</option>
              <option value="low">{translate(locale, "sortLow")}</option>
              <option value="high">{translate(locale, "sortHigh")}</option>
            </select>
          </label>
        </div>
        <div className="catalog-count">
          <span>{String(filtered.length).padStart(2, "0")} / {vehicles.length.toString().padStart(2, "0")} {translate(locale, "navCars")}</span>
          <span>{translate(locale, "demoNotice")}</span>
        </div>
        {filtered.length ? (
          <div className="car-grid catalog-grid">
            {filtered.map((vehicle) => (
              <VehicleCard locale={locale} vehicle={vehicle} key={vehicle.slug} />
            ))}
          </div>
        ) : (
          <div className="empty-state">{translate(locale, "noResults")}</div>
        )}
      </div>
    </>
  );
}
