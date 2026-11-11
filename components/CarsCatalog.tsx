"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Locale, translate } from "@/lib/translations";
import { vehicles } from "@/lib/vehicles";
import { categoryOrder, vehicleCategory } from "@/lib/vehicle-copy";

const priceLimits = [500, 1_000, 2_000, 5_000];

function maxPriceLabel(locale: Locale) {
  return locale === "fr" ? "Prix max / jour" : locale === "ar" ? "السعر الأقصى / يوم" : "Max price / day";
}

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
          alt={vehicle.name}
          fill
          sizes="(max-width: 760px) 90vw, 33vw"
        />
        <span className="demo-pill">{translate(locale, "demo")}</span>
        <span className="photo-arrow" aria-hidden="true">↗</span>
      </a>
      <div className="car-card-info">
        <div>
          <span className="car-category">
            {vehicleCategory(locale, vehicle.category)}
            {vehicle.year ? ` · ${vehicle.year}` : ""}
          </span>
          <h3>{vehicle.name}</h3>
        </div>
        <div className="card-price">
          <strong>{vehicle.daily.toLocaleString(locale)} <small>AED</small></strong>
          <span>{translate(locale, "perDay")}</span>
        </div>
      </div>
      <div className="car-card-meta">
        {vehicle.seats ? (
          <span>♧ &nbsp;{vehicle.seats} {translate(locale, "seats").toLowerCase()}</span>
        ) : null}
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
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("popular");

  const filtered = useMemo(() => {
    const result = vehicles.filter((vehicle) => {
      return (
        (!category || vehicle.categories.some((value) => value === category)) &&
        (!maxPrice || vehicle.daily <= Number(maxPrice))
      );
    });
    if (sort === "low") result.sort((a, b) => a.daily - b.daily);
    if (sort === "high") result.sort((a, b) => b.daily - a.daily);
    if (sort === "popular") result.sort((a, b) => a.popular - b.popular);
    return result;
  }, [category, maxPrice, sort]);

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
                {categoryOrder.map((value) => (
                  <option value={value} key={value}>{vehicleCategory(locale, value)}</option>
                ))}
              </select>
            </label>
            <label>
              <span>{maxPriceLabel(locale)}</span>
              <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
                <option value="">—</option>
                {priceLimits.map((limit) => (
                  <option value={limit} key={limit}>≤ {limit.toLocaleString(locale)} AED</option>
                ))}
              </select>
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
