"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { company } from "@/config/company";
import { todayInDubai } from "@/lib/dates";
import { Locale, translate } from "@/lib/translations";
import { Vehicle } from "@/lib/vehicles";
import { vehicleCategory, vehicleDescription, vehicleFeatures } from "@/lib/vehicle-copy";

function priceFor(vehicle: Vehicle, days: number) {
  const weekly = vehicle.weekly ?? vehicle.daily * 7;
  const monthly = vehicle.monthly ?? vehicle.daily * 30;
  if (days >= 30) {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    return months * monthly + Math.floor(remainingDays / 7) * weekly + (remainingDays % 7) * vehicle.daily;
  }
  if (days >= 7) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    return weeks * weekly + remainingDays * vehicle.daily;
  }
  return days * vehicle.daily;
}

export default function VehicleDetail({
  locale,
  vehicle,
}: {
  locale: Locale;
  vehicle: Vehicle;
}) {
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [pickupTime, setPickupTime] = useState("09:00");
  const [returnTime, setReturnTime] = useState("09:00");
  const pickupDateRef = useRef<HTMLInputElement>(null);
  const returnDateRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const today = todayInDubai();
    if (pickupDateRef.current) pickupDateRef.current.min = today;
    if (returnDateRef.current) returnDateRef.current.min = today;
  }, []);
  const days = useMemo(() => {
    if (!pickupDate || !returnDate) return 1;
    const start = new Date(`${pickupDate}T${pickupTime}:00+04:00`);
    const end = new Date(`${returnDate}T${returnTime}:00+04:00`);
    if (end <= start) return 1;
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86_400_000));
  }, [pickupDate, returnDate, pickupTime, returnTime]);
  const estimate = priceFor(vehicle, days);
  const number = company.whatsappNumber.replace(/\D/g, "");
  const whatsappHref = number
    ? `https://wa.me/${number}?text=${encodeURIComponent(`Hello, I am interested in renting the ${vehicle.name}. Could you please provide more information about availability and pricing?`)}`
    : `/${locale}/contact`;

  return (
    <>
      <div className="page-wrap detail-topline">
        <a href={`/${locale}/cars`}>← {translate(locale, "navCars")}</a>
        <span className="demo-pill">{translate(locale, "demo")}</span>
      </div>
      <section className="page-wrap vehicle-detail">
        <div className="vehicle-gallery">
          <div className="vehicle-main-image">
            <Image
              src={vehicle.image}
              alt={vehicle.name}
              fill
              priority
              sizes="(max-width: 760px) 100vw, 64vw"
            />
            <span className="image-caption">FRENCH RENT CAR · DUBAI</span>
          </div>
          <div className="gallery-caption">
            <span>
              {vehicleCategory(locale, vehicle.category)}
              {vehicle.year ? ` · ${vehicle.year}` : ""}
            </span>
            <span>{translate(locale, "availabilityDemo")}</span>
          </div>
          <div className="detail-description">
            <span className="eyebrow">{translate(locale, "details")}</span>
            <p>{vehicleDescription(locale, vehicle)}</p>
          </div>
          <div className="spec-block">
            <h2>{translate(locale, "specs")}</h2>
            <div className="spec-grid">
              <div><span>{translate(locale, "category")}</span><strong>{vehicleCategory(locale, vehicle.category)}</strong></div>
              {vehicle.year ? (
                <div><span>{locale === "fr" ? "Année" : locale === "ar" ? "السنة" : "Year"}</span><strong>{vehicle.year}</strong></div>
              ) : null}
              {vehicle.seats ? (
                <div><span>{translate(locale, "seats")}</span><strong>{vehicle.seats}</strong></div>
              ) : null}
              {vehicle.doors ? (
                <div><span>{locale === "fr" ? "Portes" : locale === "ar" ? "الأبواب" : "Doors"}</span><strong>{vehicle.doors}</strong></div>
              ) : null}
            </div>
          </div>
          {vehicleFeatures(locale, vehicle).length > 0 && (
            <div className="spec-block">
              <h2>{translate(locale, "features")}</h2>
              <div className="feature-list">
                {vehicleFeatures(locale, vehicle).map((feature) => (
                  <span key={feature}><i>+</i>{feature}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        <aside className="booking-card">
          <div className="booking-card-head">
            <div>
              <span className="eyebrow">{translate(locale, "demoBannerShort")}</span>
              <h1>{vehicle.name}</h1>
            </div>
            <span className="car-category">{vehicleCategory(locale, vehicle.category)}</span>
          </div>
          <div className="price-table">
            <div><span>{translate(locale, "dailyRate")}</span><strong>{vehicle.daily.toLocaleString(locale)} <small>AED</small></strong></div>
            {vehicle.weekly ? (
              <div><span>{translate(locale, "weeklyRate")}</span><strong>{vehicle.weekly.toLocaleString(locale)} <small>AED</small></strong></div>
            ) : null}
            {vehicle.monthly ? (
              <div><span>{translate(locale, "monthlyRate")}</span><strong>{vehicle.monthly.toLocaleString(locale)} <small>AED</small></strong></div>
            ) : null}
          </div>
          <div className="estimate-inputs">
            <label>
              <span>{translate(locale, "pickupDate")}</span>
              <input
                ref={pickupDateRef}
                type="date"
                value={pickupDate}
                onChange={(event) => {
                  const value = event.target.value;
                  setPickupDate(value);
                  if (returnDateRef.current) {
                    returnDateRef.current.min = value || todayInDubai();
                  }
                }}
              />
            </label>
            <label>
              <span>{translate(locale, "pickupTime")}</span>
              <input
                type="time"
                value={pickupTime}
                onChange={(event) => setPickupTime(event.target.value)}
              />
            </label>
            <label>
              <span>{translate(locale, "returnDate")}</span>
              <input
                ref={returnDateRef}
                type="date"
                value={returnDate}
                onChange={(event) => setReturnDate(event.target.value)}
              />
            </label>
            <label>
              <span>{translate(locale, "returnTime")}</span>
              <input
                type="time"
                value={returnTime}
                onChange={(event) => setReturnTime(event.target.value)}
              />
            </label>
          </div>
          <div className="estimate-line">
            <span>{translate(locale, "duration")}</span>
            <strong>{days} {locale === "fr" ? (days > 1 ? "jours" : "jour") : locale === "ar" ? "يوم" : (days > 1 ? "days" : "day")}</strong>
          </div>
          <div className="estimate-total">
            <span>{translate(locale, "estimatedTotal")}</span>
            <strong>{estimate.toLocaleString(locale)} <small>AED</small></strong>
          </div>
          <p className="estimate-note">{translate(locale, "estimateNote")}</p>
          <a
            className="button button-red button-full"
            href={`/${locale}/booking?vehicle=${vehicle.slug}${pickupDate ? `&pickupDate=${pickupDate}` : ""}${returnDate ? `&returnDate=${returnDate}` : ""}&pickupTime=${pickupTime}&returnTime=${returnTime}`}
          >
            {translate(locale, "requestBooking")} <span aria-hidden="true">↗</span>
          </a>
          <a
            className="button button-outline button-full"
            href={whatsappHref}
            target={number ? "_blank" : undefined}
            rel={number ? "noreferrer" : undefined}
          >
            {translate(locale, "whatsappUs")} <span aria-hidden="true">↗</span>
          </a>
          <p className="pending-micro">{translate(locale, "pendingNotice")}</p>
        </aside>
      </section>
    </>
  );
}
