"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { company } from "@/config/company";
import { todayInDubai } from "@/lib/dates";
import { Locale, translate } from "@/lib/translations";
import { companyLegalName, companyLegalNameAr, privacyFr, termsFr, tradeLicense } from "@/lib/legal-content";
import { vehicles } from "@/lib/vehicles";
import { vehicleCategory } from "@/lib/vehicle-copy";

function makeReference() {
  const stamp = new Date().toISOString().slice(2, 10).replaceAll("-", "");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `FRC-${stamp}-${suffix}`;
}

/** Builds a WhatsApp link with a prefilled message (falls back to e-mail). */
function buildMessageUrl(text: string) {
  const number = company.whatsappNumber.replace(/\D/g, "");
  if (number) return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  if (company.email.includes("@")) {
    return `mailto:${company.email}?subject=${encodeURIComponent("French Rent Car")}&body=${encodeURIComponent(text)}`;
  }
  return "";
}

function openMessageUrl(url: string) {
  const opened = window.open(url, "_blank");
  if (opened) {
    opened.opener = null;
  } else {
    window.location.href = url;
  }
}

function messageUnavailable(locale: Locale) {
  return locale === "fr"
    ? "Le contact WhatsApp n’est pas configuré. Merci de nous écrire depuis la page Contact."
    : locale === "ar"
      ? "لم يتم إعداد واتساب. يرجى مراسلتنا من صفحة الاتصال."
      : "WhatsApp contact is not configured. Please reach us from the Contact page.";
}

function vehicleLabel(locale: Locale) {
  return locale === "fr" ? "Véhicule" : locale === "ar" ? "السيارة" : "Vehicle";
}

function estimatedRentalTotal(days: number, rates: { daily: number; weekly?: number; monthly?: number }) {
  const weekly = rates.weekly ?? rates.daily * 7;
  const monthly = rates.monthly ?? rates.daily * 30;
  if (days >= 30) {
    const rest = days % 30;
    return Math.floor(days / 30) * monthly + Math.floor(rest / 7) * weekly + (rest % 7) * rates.daily;
  }
  if (days >= 7) {
    return Math.floor(days / 7) * weekly + (days % 7) * rates.daily;
  }
  return days * rates.daily;
}

function PageIntro({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <section className="page-hero page-wrap">
      <span className="eyebrow">{eyebrow}</span>
      <h1 className="display-heading">{title}</h1>
      <p>{body}</p>
    </section>
  );
}

export function BookingPage({
  locale,
  initialVehicle = "",
  initialPickupDate = "",
  initialReturnDate = "",
  initialPickupTime = "",
  initialReturnTime = "",
}: {
  locale: Locale;
  initialVehicle?: string;
  initialPickupDate?: string;
  initialReturnDate?: string;
  initialPickupTime?: string;
  initialReturnTime?: string;
}) {
  const [complete, setComplete] = useState("");
  const [messageUrl, setMessageUrl] = useState("");
  const [error, setError] = useState("");
  const selectedVehicle = vehicles.find((car) => car.slug === initialVehicle);
  const [pickupDate, setPickupDate] = useState(initialPickupDate);
  const [returnDate, setReturnDate] = useState(initialReturnDate);
  const [pickupTime, setPickupTime] = useState(initialPickupTime || "09:00");
  const [returnTime, setReturnTime] = useState(initialReturnTime || "09:00");
  const pickupDateRef = useRef<HTMLInputElement>(null);
  const returnDateRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const today = todayInDubai();
    if (pickupDateRef.current) pickupDateRef.current.min = today;
    if (returnDateRef.current) returnDateRef.current.min = pickupDate || today;
  }, [pickupDate]);
  const estimateDays = useMemo(() => {
    if (!pickupDate || !returnDate) return 0;
    const days = Math.ceil(
      (new Date(`${returnDate}T${returnTime}:00+04:00`).getTime() -
        new Date(`${pickupDate}T${pickupTime}:00+04:00`).getTime()) /
        86_400_000,
    );
    return Math.max(1, days);
  }, [pickupDate, returnDate, pickupTime, returnTime]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const requestedPickupDate = String(form.get("pickupDate"));
    const requestedReturnDate = String(form.get("returnDate"));
    const requestedPickupTime = String(form.get("pickupTime"));
    const requestedReturnTime = String(form.get("returnTime"));
    const pickupAt = new Date(`${requestedPickupDate}T${requestedPickupTime}:00+04:00`);
    const returnAt = new Date(`${requestedReturnDate}T${requestedReturnTime}:00+04:00`);
    if (pickupAt < new Date() || returnAt <= pickupAt) {
      setError(
        locale === "fr"
          ? "La date de retour doit être postérieure à la date de départ."
          : locale === "ar"
            ? "يجب أن يكون تاريخ الإعادة بعد تاريخ الاستلام."
            : "Return date must be after pick-up date.",
      );
      return;
    }
    const reference = makeReference();
    const vehicleSlug = String(form.get("vehicle"));
    const vehicleName = vehicles.find((car) => car.slug === vehicleSlug)?.name ?? vehicleSlug;
    const note = String(form.get("message") ?? "").trim();
    const text = [
      `French Rent Car · ${translate(locale, "requestBooking")}`,
      `${translate(locale, "requestRef")}: ${reference}`,
      `${translate(locale, "fullName")}: ${String(form.get("fullName")).trim()}`,
      `${translate(locale, "email")}: ${String(form.get("email")).trim()}`,
      `${translate(locale, "phoneLabel")}: ${String(form.get("phone")).trim()}`,
      `${vehicleLabel(locale)}: ${vehicleName}`,
      `${translate(locale, "pickupDate")}: ${requestedPickupDate} ${requestedPickupTime}`,
      `${translate(locale, "returnDate")}: ${requestedReturnDate} ${requestedReturnTime}`,
      note ? `${translate(locale, "message")}: ${note}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    const url = buildMessageUrl(text);
    if (!url) {
      setError(messageUnavailable(locale));
      return;
    }
    openMessageUrl(url);
    setMessageUrl(url);
    setComplete(reference);
  }

  return (
    <>
      <PageIntro
        eyebrow={translate(locale, "demoBannerShort")}
        title={translate(locale, "bookingTitlePage")}
        body={translate(locale, "bookingIntro")}
      />
      <section className="page-wrap booking-page-grid">
        <div className="form-card">
          {complete ? (
            <div className="success-panel" role="status">
              <span className="success-icon">✓</span>
              <span className="eyebrow">{translate(locale, "pending")}</span>
              <h2>{translate(locale, "requestSuccess")}</h2>
              <p>{translate(locale, "requestRef")}: <strong>{complete}</strong></p>
              <p>{translate(locale, "contactAlternative")}</p>
              <p>{translate(locale, "pendingNotice")}</p>
              <a className="text-link" href={messageUrl} target="_blank" rel="noreferrer">{translate(locale, "whatsappRetry")} ↗</a>
              <a className="text-link" href={`/${locale}/cars`}>{translate(locale, "viewAllCars")} ↗</a>
            </div>
          ) : (
            <form className="stacked-form" onSubmit={submit}>
              <div className="form-title-row">
                <h2>{translate(locale, "requestBooking")}</h2>
              </div>
              <label>
                <span>{translate(locale, "fullName")} *</span>
                <input name="fullName" autoComplete="name" required />
              </label>
              <div className="form-two-col">
                <label>
                  <span>{translate(locale, "email")} *</span>
                  <input name="email" type="email" autoComplete="email" required />
                </label>
                <label>
                  <span>{translate(locale, "phoneLabel")} *</span>
                  <input name="phone" type="tel" autoComplete="tel" required />
                </label>
              </div>
              <label>
                <span>{translate(locale, "chooseVehicle")} *</span>
                <select name="vehicle" defaultValue={initialVehicle} required>
                  <option value="" disabled>{translate(locale, "chooseVehicle")}</option>
                  {vehicles.map((vehicle) => (
                    <option value={vehicle.slug} key={vehicle.slug}>
                      {vehicle.name} · {vehicleCategory(locale, vehicle.category)}
                    </option>
                  ))}
                </select>
              </label>
              <div className="form-two-col">
                <label>
                  <span>{translate(locale, "pickupDate")} *</span>
                  <input
                    ref={pickupDateRef}
                    name="pickupDate"
                    type="date"
                    value={pickupDate}
                    onChange={(event) => {
                      const value = event.currentTarget.value;
                      setPickupDate(value);
                      if (returnDateRef.current) {
                        returnDateRef.current.min = value || todayInDubai();
                      }
                    }}
                    required
                  />
                </label>
                <label>
                  <span>{translate(locale, "pickupTime")} *</span>
                  <input name="pickupTime" type="time" value={pickupTime} onChange={(event) => setPickupTime(event.currentTarget.value)} required />
                </label>
                <label>
                  <span>{translate(locale, "returnDate")} *</span>
                  <input
                    ref={returnDateRef}
                    name="returnDate"
                    type="date"
                    value={returnDate}
                    onChange={(event) => setReturnDate(event.currentTarget.value)}
                    required
                  />
                </label>
                <label>
                  <span>{translate(locale, "returnTime")} *</span>
                  <input name="returnTime" type="time" value={returnTime} onChange={(event) => setReturnTime(event.currentTarget.value)} required />
                </label>
              </div>
              <label>
                <span>{translate(locale, "message")}</span>
                <textarea name="message" rows={4} />
              </label>
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="button button-red button-full" type="submit">
                {translate(locale, "sendRequest")} <span aria-hidden="true">↗</span>
              </button>
              <p className="form-footnote">{translate(locale, "pendingNotice")}</p>
            </form>
          )}
        </div>
        <aside className="booking-summary">
          <span className="eyebrow">FRENCH RENT CAR / DUBAI</span>
          <h2>{selectedVehicle?.name ?? translate(locale, "bookingTitle")}</h2>
          {selectedVehicle ? (
            <>
              <Image
                className="summary-image"
                src={selectedVehicle.image}
                alt={selectedVehicle.name}
                width={700}
                height={480}
              />
              <div className="summary-line">
                <span>{translate(locale, "dailyRate")}</span>
                <strong>{selectedVehicle.daily.toLocaleString(locale)} AED</strong>
              </div>
              {estimateDays > 0 && (
                <>
                  <div className="summary-line">
                    <span>{translate(locale, "duration")}</span>
                    <strong>{estimateDays} {locale === "fr" ? "jours" : locale === "ar" ? "يوم" : "days"}</strong>
                  </div>
                  <div className="summary-line">
                    <span>{translate(locale, "estimatedTotal")}</span>
                    <strong>{estimatedRentalTotal(estimateDays, selectedVehicle).toLocaleString(locale)} AED</strong>
                  </div>
                </>
              )}
            </>
          ) : (
            <p>{translate(locale, "bookingIntro")}</p>
          )}
          <div className="payment-unavailable">
            <span className="eyebrow">{translate(locale, "paymentTitle")}</span>
            <p>{translate(locale, "paymentDisabled")}</p>
            <span className="status-chip">{locale === "fr" ? "PAIEMENT INACTIF" : locale === "ar" ? "الدفع غير مفعّل" : "PAYMENTS DISABLED"}</span>
          </div>
        </aside>
      </section>
    </>
  );
}

export function ContactPage({ locale }: { locale: Locale }) {
  const [sent, setSent] = useState(false);
  const [messageUrl, setMessageUrl] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const phone = String(form.get("phone") ?? "").trim();
    const text = [
      `French Rent Car · ${translate(locale, "navContact")}`,
      `${translate(locale, "fullName")}: ${String(form.get("name")).trim()}`,
      `${translate(locale, "email")}: ${String(form.get("email")).trim()}`,
      phone ? `${translate(locale, "phoneLabel")}: ${phone}` : "",
      `${translate(locale, "subject")}: ${String(form.get("subject")).trim()}`,
      "",
      String(form.get("message")).trim(),
    ]
      .filter((line, index) => line !== "" || index === 5)
      .join("\n");
    const url = buildMessageUrl(text);
    if (!url) {
      setError(messageUnavailable(locale));
      return;
    }
    openMessageUrl(url);
    setMessageUrl(url);
    setSent(true);
    event.currentTarget.reset();
  }

  const mapReady = Boolean(company.mapsEmbedUrl);
  const whatsappNumber = company.whatsappNumber.replace(/\D/g, "");
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : `/${locale}/contact`;

  return (
    <>
      <PageIntro
        eyebrow={translate(locale, "navContact")}
        title={translate(locale, "contactTitle")}
        body={translate(locale, "contactIntro")}
      />
      <section className="page-wrap contact-layout">
        <div className="form-card">
          {sent ? (
            <div className="success-panel" role="status">
              <span className="success-icon">✓</span>
              <h2>{translate(locale, "messageSuccess")}</h2>
              <p>{translate(locale, "contactAlternative")}</p>
              <a className="text-link" href={messageUrl} target="_blank" rel="noreferrer">{translate(locale, "whatsappRetry")} ↗</a>
              <button className="text-link" type="button" onClick={() => setSent(false)}>
                {locale === "fr" ? "Envoyer un autre message" : locale === "ar" ? "إرسال رسالة أخرى" : "Send another message"}
              </button>
            </div>
          ) : (
            <form className="stacked-form" onSubmit={submit}>
              <div className="form-title-row">
                <h2>{translate(locale, "navContact")}</h2>
              </div>
              <label><span>{translate(locale, "fullName")} *</span><input name="name" required autoComplete="name" /></label>
              <div className="form-two-col">
                <label><span>{translate(locale, "email")} *</span><input name="email" type="email" required autoComplete="email" /></label>
                <label><span>{translate(locale, "phoneLabel")}</span><input name="phone" type="tel" autoComplete="tel" /></label>
              </div>
              <label><span>{translate(locale, "subject")} *</span><input name="subject" required /></label>
              <label><span>{translate(locale, "message")} *</span><textarea name="message" rows={5} required /></label>
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="button button-red button-full" type="submit">
                {translate(locale, "sendMessage")} <span aria-hidden="true">↗</span>
              </button>
              <p className="form-footnote">{translate(locale, "contactAlternative")}</p>
            </form>
          )}
        </div>
        <aside className="contact-side">
          <div className="contact-details">
            <span className="eyebrow">{translate(locale, "footerContact")}</span>
            <h2>{translate(locale, "location")}</h2>
            <div className="contact-detail-row">
              <span>01 / {translate(locale, "location")}</span>
              <strong>{company.address === "TO_BE_CONFIRMED" ? translate(locale, "location") : company.address}</strong>
            </div>
            <div className="contact-detail-row">
              <span>02 / {translate(locale, "phoneLabel")}</span>
              <strong>{company.phone === "TO_BE_CONFIRMED" ? translate(locale, "toConfirm") : company.phone}</strong>
            </div>
            <div className="contact-detail-row">
              <span>03 / {translate(locale, "email")}</span>
              <strong>{company.email === "TO_BE_CONFIRMED" ? translate(locale, "emailUnavailable") : company.email}</strong>
            </div>
            <div className="contact-detail-row">
              <span>04 / {locale === "fr" ? "Horaires" : locale === "ar" ? "ساعات العمل" : "Opening hours"}</span>
              <strong>{company.openingHours === "TO_BE_CONFIGURED" ? (locale === "fr" ? "À confirmer" : locale === "ar" ? "تُحدد لاحقاً" : "To be confirmed") : company.openingHours}</strong>
            </div>
            <a className="button button-outline button-full" href={whatsappHref} target={whatsappNumber ? "_blank" : undefined} rel={whatsappNumber ? "noreferrer" : undefined}>
              {translate(locale, "whatsappUs")} <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="map-panel">
            {mapReady ? (
              <iframe
                src={company.mapsEmbedUrl}
                title="French Rent Car location on Google Maps"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="map-placeholder">
                <span className="map-pin">+</span>
                <span>{translate(locale, "mapPending")}</span>
              </div>
            )}
            <a href={company.mapsShareUrl} target="_blank" rel="noreferrer">
              {translate(locale, "directions")} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </aside>
      </section>
    </>
  );
}

export function AboutPage({ locale }: { locale: Locale }) {
  const goals = ["goal1", "goal2", "goal3", "goal4", "goal5"] as const;
  return (
    <>
      <PageIntro
        eyebrow={translate(locale, "aboutEyebrow")}
        title={translate(locale, "aboutTitlePage")}
        body={translate(locale, "aboutStory")}
      />
      <section className="page-wrap about-values">
        <div className="about-value">
          <span className="eyebrow">01 / FRC</span>
          <h2>{translate(locale, "mission")}</h2>
          <p>{translate(locale, "missionBody")}</p>
        </div>
        <div className="about-value">
          <span className="eyebrow">02 / FRC</span>
          <h2>{translate(locale, "vision")}</h2>
          <p>{translate(locale, "visionBody")}</p>
        </div>
        <div className="about-value goals-value">
          <span className="eyebrow">03 / FRC</span>
          <h2>{translate(locale, "goals")}</h2>
          <ul>{goals.map((goal, index) => <li key={goal}><span>0{index + 1}</span>{translate(locale, goal)}</li>)}</ul>
        </div>
      </section>
      <section className="about-wide-image">
        <Image src="/images/dubai-hero.jpg" alt="Dubaï au crépuscule" fill sizes="100vw" />
        <span>FRENCH RENT CAR · DUBAI, UAE</span>
      </section>
    </>
  );
}

export function ServicesPage({ locale }: { locale: Locale }) {
  const serviceKeys = ["daily", "monthly", "yearly", "luxury", "categories"] as const;
  const bodyKeys = ["dailyBody", "monthlyBody", "yearlyBody", "luxuryBody", "categoriesBody"] as const;
  return (
    <>
      <PageIntro
        eyebrow={translate(locale, "servicesEyebrow")}
        title={translate(locale, "servicesTitlePage")}
        body={translate(locale, "servicesIntro")}
      />
      <section className="page-wrap service-page-grid">
        {serviceKeys.map((key, index) => (
          <article className="service-page-card" key={key}>
            <span className="eyebrow">0{index + 1} / FRENCH RENT CAR</span>
            <span className="service-outline-number">0{index + 1}</span>
            <div>
              <h2>{translate(locale, key)}</h2>
              <p>{translate(locale, bodyKeys[index])}</p>
            </div>
            <a className="text-link" href={`/${locale}/cars`}>{translate(locale, "viewAllCars")} ↗</a>
          </article>
        ))}
      </section>
      <div className="page-wrap service-note">{translate(locale, "serviceNote")}</div>
      <section className="simple-cta page-wrap">
        <h2>{translate(locale, "ctaTitle")}</h2>
        <a className="button button-red" href={`/${locale}/booking`}>{translate(locale, "bookNow")} ↗</a>
      </section>
    </>
  );
}

export function LegalPage({
  locale,
  kind,
}: {
  locale: Locale;
  kind: "legal" | "privacy" | "terms";
}) {
  const titleKey = kind === "legal" ? "legalTitle" : kind === "privacy" ? "privacyTitle" : "termsTitle";
  const legalDoc = kind === "privacy" ? privacyFr : kind === "terms" ? termsFr : null;
  if (legalDoc) {
    const whatsappDigits = company.whatsappNumber.replace(/\D/g, "");
    const fill = (text: string) =>
      text
        .replaceAll("{company}", companyLegalName)
        .replaceAll("{email}", company.email.includes("@") ? company.email : "—")
        .replaceAll("{whatsapp}", whatsappDigits ? `+${whatsappDigits}` : "—");
    const frenchOnly =
      locale === "ar"
        ? "هذه الوثيقة متاحة حالياً باللغة الفرنسية فقط."
        : locale === "en"
          ? "This document is currently available in French only."
          : "";
    return (
      <>
        <PageIntro
          eyebrow={companyLegalName}
          title={translate(locale, titleKey)}
          body={frenchOnly}
        />
        <article className="page-wrap legal-document" lang="fr" dir="ltr">
          {legalDoc.blocks.map((block, index) => (
            <section key={index}>
              {block.heading && <h2>{fill(block.heading)}</h2>}
              {block.subheading && <h3>{fill(block.subheading)}</h3>}
              {block.paragraphs?.map((text) => <p key={text}>{fill(text)}</p>)}
              {block.items && (
                <ul>
                  {block.items.map((text) => <li key={text}>{fill(text)}</li>)}
                </ul>
              )}
            </section>
          ))}
        </article>
      </>
    );
  }
  return <LegalNotice locale={locale} />;
}

const legalNoticeCopy = {
  fr: {
    intro: "Informations relatives à l’éditeur et à l’hébergeur du site.",
    publisher: "Éditeur du site",
    companyName: "Raison sociale",
    address: "Adresse",
    license: "Licence commerciale",
    contact: "Contact",
    email: "E-mail",
    hosting: "Hébergement",
    documents: "Documents",
    documentsBody: "L’utilisation du site et des services est régie par nos",
    and: "et notre",
  },
  en: {
    intro: "Information about the publisher and the host of this website.",
    publisher: "Website publisher",
    companyName: "Company name",
    address: "Address",
    license: "Trade licence",
    contact: "Contact",
    email: "E-mail",
    hosting: "Hosting",
    documents: "Documents",
    documentsBody: "Use of the website and services is governed by our",
    and: "and our",
  },
  ar: {
    intro: "معلومات عن ناشر الموقع والجهة المستضيفة له.",
    publisher: "ناشر الموقع",
    companyName: "اسم الشركة",
    address: "العنوان",
    license: "الرخصة التجارية",
    contact: "التواصل",
    email: "البريد الإلكتروني",
    hosting: "الاستضافة",
    documents: "المستندات",
    documentsBody: "يخضع استخدام الموقع والخدمات إلى",
    and: "و",
  },
} as const;

function LegalNotice({ locale }: { locale: Locale }) {
  const t = legalNoticeCopy[locale];
  const whatsappDigits = company.whatsappNumber.replace(/\D/g, "");
  const hasAddress = company.address.trim() !== "" && company.address !== "TO_BE_CONFIRMED";
  return (
    <>
      <PageIntro eyebrow={companyLegalName} title={translate(locale, "legalTitle")} body={t.intro} />
      <article className="page-wrap legal-document">
        <section>
          <h2>{t.publisher}</h2>
          <ul>
            <li>{t.companyName} : {companyLegalName} · <span lang="ar" dir="rtl">{companyLegalNameAr}</span></li>
            {hasAddress && <li>{t.address} : <span dir="auto">{company.address}</span></li>}
            {tradeLicense && <li>{t.license} : {tradeLicense}</li>}
          </ul>
        </section>
        <section>
          <h2>{t.contact}</h2>
          <ul>
            {company.email.includes("@") && (
              <li>{t.email} : <a href={`mailto:${company.email}`} dir="ltr">{company.email}</a></li>
            )}
            {whatsappDigits && (
              <li>WhatsApp : <a href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noreferrer" dir="ltr">+{whatsappDigits}</a></li>
            )}
          </ul>
        </section>
        <section>
          <h2>{t.hosting}</h2>
          <p dir="ltr">Vercel Inc. · 440 N Barranca Ave #4133, Covina, CA 91723, USA · vercel.com</p>
        </section>
        <section>
          <h2>{t.documents}</h2>
          <p>
            {t.documentsBody}{" "}
            <a href={`/${locale}/terms`}>{translate(locale, "termsTitle")}</a> {t.and}{" "}
            <a href={`/${locale}/privacy`}>{translate(locale, "privacyTitle")}</a>.
          </p>
        </section>
      </article>
    </>
  );
}

export function AdminPlaceholder({ locale }: { locale: Locale }) {
  const message = locale === "fr"
    ? "L’espace administrateur n’est pas activé. L’authentification, la base de données et les rôles doivent être configurés avant tout accès."
    : locale === "ar"
      ? "لوحة الإدارة غير مفعّلة. يجب إعداد المصادقة وقاعدة البيانات والأدوار قبل إتاحة الوصول."
      : "The admin area is not enabled. Authentication, database access and roles must be configured before access is available.";
  return (
    <section className="page-wrap admin-placeholder">
      <span className="eyebrow">FRC / ADMIN</span>
      <h1>Admin</h1>
      <p>{message}</p>
      <span className="status-chip">NOT ENABLED</span>
    </section>
  );
}

export function NotFoundPage({ locale }: { locale: Locale }) {
  return (
    <section className="page-wrap admin-placeholder">
      <span className="eyebrow">404 / FRC</span>
      <h1>404</h1>
      <p>{translate(locale, "notFound")}</p>
      <a className="text-link" href={`/${locale}`}>{translate(locale, "backHome")} ↗</a>
    </section>
  );
}
