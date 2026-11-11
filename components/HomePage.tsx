"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { company } from "@/config/company";
import { Locale, translate } from "@/lib/translations";
import { vehicles } from "@/lib/vehicles";

const serviceKeys = ["daily", "monthly", "yearly", "luxury", "categories"] as const;
const serviceBodyKeys = [
  "dailyBody",
  "monthlyBody",
  "yearlyBody",
  "luxuryBody",
  "categoriesBody",
] as const;

const categories = ["Economy", "Sedan", "SUV", "Luxury", "Sports"];

function ContactButton({
  locale,
  className,
  children,
}: {
  locale: Locale;
  className: string;
  children: React.ReactNode;
}) {
  const number = company.whatsappNumber.replace(/\D/g, "");
  const href = number
    ? `https://wa.me/${number}?text=${encodeURIComponent("Hello, I am interested in renting a car in Dubai. Could you please provide more information?")}`
    : `/${locale}/contact`;
  return (
    <a
      className={className}
      href={href}
      target={number ? "_blank" : undefined}
      rel={number ? "noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

function BookingSearch({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const pickupDate = String(form.get("pickupDate"));
    const returnDate = String(form.get("returnDate"));
    const pickupTime = String(form.get("pickupTime"));
    const returnTime = String(form.get("returnTime"));
    const pickupAt = new Date(`${pickupDate}T${pickupTime}:00+04:00`);
    const returnAt = new Date(`${returnDate}T${returnTime}:00+04:00`);
    if (
      !pickupDate ||
      !returnDate ||
      pickupAt < new Date() ||
      returnAt <= pickupAt
    ) {
      setError(
        locale === "fr"
          ? "La date de retour doit être postérieure à la date de départ."
          : locale === "ar"
            ? "يجب أن يكون تاريخ الإعادة بعد تاريخ الاستلام."
            : "Return date must be after pick-up date.",
      );
      return;
    }
    const params = new URLSearchParams({
      pickup: String(form.get("pickup")),
      dropoff: String(form.get("dropoff")),
      pickupDate,
      returnDate,
      pickupTime,
      returnTime,
      category: String(form.get("category")),
    });
    router.push(`/${locale}/cars?${params.toString()}`);
  }

  return (
    <section className="booking-strip" aria-labelledby="booking-title">
      <div className="booking-heading">
        <span className="eyebrow eyebrow-dark">01 / 03</span>
        <h2 id="booking-title">{translate(locale, "bookingTitle")}</h2>
      </div>
      <form className="booking-form" onSubmit={submit}>
        <label>
          <span>{translate(locale, "pickup")}</span>
          <input
            name="pickup"
            placeholder={translate(locale, "locationPlaceholder")}
            required
          />
        </label>
        <label>
          <span>{translate(locale, "dropoff")}</span>
          <input
            name="dropoff"
            placeholder={translate(locale, "locationPlaceholder")}
            required
          />
        </label>
        <label>
          <span>{translate(locale, "pickupDate")}</span>
          <input name="pickupDate" type="date" required />
        </label>
        <label>
          <span>{translate(locale, "pickupTime")}</span>
          <input name="pickupTime" type="time" defaultValue="09:00" required />
        </label>
        <label>
          <span>{translate(locale, "returnDate")}</span>
          <input name="returnDate" type="date" required />
        </label>
        <label>
          <span>{translate(locale, "returnTime")}</span>
          <input name="returnTime" type="time" defaultValue="09:00" required />
        </label>
        <label>
          <span>{translate(locale, "category")}</span>
          <select name="category" defaultValue="">
            <option value="">{translate(locale, "allCategories")}</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <button className="button button-dark" type="submit">
          {translate(locale, "searchCars")}
          <span aria-hidden="true">↗</span>
        </button>
      </form>
      {error && <p className="form-error" role="alert">{error}</p>}
    </section>
  );
}

export default function HomePage({ locale }: { locale: Locale }) {
  const featured = vehicles.slice(0, 3);
  const whyItems = [
    ["01", "why1", "why1Body"],
    ["02", "why2", "why2Body"],
    ["03", "why3", "why3Body"],
    ["04", "why4", "why4Body"],
  ] as const;

  return (
    <>
      <section className="hero">
        <Image
          src="/images/dubai-hero.jpg"
          alt="Voiture premium à Dubaï au crépuscule"
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-shade" />
        <div className="hero-content page-wrap">
          <span className="eyebrow hero-eyebrow">
            <span className="red-line" />
            {translate(locale, "heroEyebrow")}
          </span>
          <h1>{translate(locale, "heroTitle")}</h1>
          <p>{translate(locale, "heroBody")}</p>
          <div className="hero-actions">
            <a className="button button-red" href={`/${locale}/cars`}>
              {translate(locale, "exploreCars")}
              <span aria-hidden="true">↗</span>
            </a>
            <ContactButton locale={locale} className="text-link light-link">
              {translate(locale, "whatsappUs")}
              <span aria-hidden="true">↗</span>
            </ContactButton>
          </div>
        </div>
        <div className="hero-bottom page-wrap">
          <span>{translate(locale, "scrollExplore")}</span>
          <span className="hero-index">25° 12&apos; N&nbsp;&nbsp; 55° 16&apos; E</span>
        </div>
        <div className="hero-side-label">FRENCH RENT CAR&nbsp; / &nbsp;DUBAI</div>
      </section>

      <div className="page-wrap booking-wrap">
        <BookingSearch locale={locale} />
      </div>

      <section className="section section-fleet page-wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">{translate(locale, "featuredEyebrow")}</span>
            <h2 className="display-heading">
              {translate(locale, "featuredTitle")}
            </h2>
          </div>
          <div className="section-aside">
            <p>{translate(locale, "featuredBody")}</p>
            <a className="text-link" href={`/${locale}/cars`}>
              {translate(locale, "viewAllCars")}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className="car-grid car-grid-featured">
          {featured.map((car, index) => (
            <article className="car-card" key={car.slug}>
              <a
                className="car-photo"
                href={`/${locale}/cars/${car.slug}`}
                aria-label={`${translate(locale, "viewDetails")}: ${car.name}`}
              >
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  sizes="(max-width: 760px) 90vw, 33vw"
                />
                <span className="demo-pill">{translate(locale, "demo")}</span>
                {index === 0 && <span className="popular-pill">{translate(locale, "popular")}</span>}
                <span className="photo-arrow" aria-hidden="true">↗</span>
              </a>
              <div className="car-card-info">
                <div>
                  <span className="car-category">{car.category} · {car.year}</span>
                  <h3>{car.name}</h3>
                </div>
                <div className="card-price">
                  <strong>{car.daily.toLocaleString(locale)} <small>AED</small></strong>
                  <span>{translate(locale, "perDay")}</span>
                </div>
              </div>
              <div className="car-card-meta">
                <span>♧ &nbsp;{car.seats} {translate(locale, "seats").toLowerCase()}</span>
                <span>◌ &nbsp;{translate(locale, "automatic")}</span>
                <a href={`/${locale}/cars/${car.slug}`}>{translate(locale, "viewDetails")} ↗</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="why-section">
        <div className="page-wrap why-layout">
          <div className="why-intro">
            <span className="eyebrow">{translate(locale, "whyEyebrow")}</span>
            <h2 className="display-heading">{translate(locale, "whyTitle")}</h2>
            <p>{translate(locale, "whyBody")}</p>
            <span className="outline-number">FRC <i> / </i> 01</span>
          </div>
          <div className="why-grid">
            {whyItems.map(([number, title, body]) => (
              <article className="why-item" key={number}>
                <span>{number}</span>
                <div>
                  <h3>{translate(locale, title)}</h3>
                  <p>{translate(locale, body)}</p>
                </div>
                <span className="why-arrow" aria-hidden="true">↗</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section page-wrap service-section">
        <div className="section-head">
          <div>
            <span className="eyebrow">{translate(locale, "servicesEyebrow")}</span>
            <h2 className="display-heading">{translate(locale, "servicesTitle")}</h2>
          </div>
          <a className="text-link" href={`/${locale}/services`}>
            {translate(locale, "navServices")} <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="service-grid">
          {serviceKeys.map((key, index) => (
            <a className="service-card" href={`/${locale}/services`} key={key}>
              <span className="service-number">0{index + 1}</span>
              <div>
                <h3>{translate(locale, key)}</h3>
                <p>{translate(locale, serviceBodyKeys[index])}</p>
              </div>
              <span className="service-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="about-preview">
        <div className="about-image">
          <Image
            src="/images/car-suv.jpg"
            alt="SUV au bord de l'eau avec la silhouette de Dubaï"
            fill
            sizes="(max-width: 760px) 100vw, 48vw"
          />
          <span className="image-caption">DUBAI, UNITED ARAB EMIRATES</span>
        </div>
        <div className="about-preview-copy">
          <span className="eyebrow">{translate(locale, "aboutEyebrow")}</span>
          <h2 className="display-heading">{translate(locale, "aboutTitle")}</h2>
          <p>{translate(locale, "aboutBody")}</p>
          <a className="text-link" href={`/${locale}/about`}>
            {translate(locale, "aboutLink")} <span aria-hidden="true">↗</span>
          </a>
          <span className="about-signature">FRENCH RENT CAR</span>
        </div>
      </section>

      <section className="final-cta">
        <div className="cta-glow" />
        <div className="page-wrap cta-content">
          <span className="eyebrow">{translate(locale, "ctaEyebrow")}</span>
          <h2>{translate(locale, "ctaTitle")}</h2>
          <p>{translate(locale, "ctaBody")}</p>
          <div className="hero-actions">
            <ContactButton locale={locale} className="button button-light">
              {translate(locale, "whatsappUs")} <span aria-hidden="true">↗</span>
            </ContactButton>
            <a className="text-link light-link" href={`/${locale}/cars`}>
              {translate(locale, "fleetCta")} <span aria-hidden="true">↗</span>
            </a>
          </div>
          <span className="cta-monogram">FRC</span>
        </div>
      </section>
    </>
  );
}
