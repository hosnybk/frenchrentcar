"use client";

import { useEffect, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import { company } from "@/config/company";
import { Locale, translate } from "@/lib/translations";

const navItems = [
  ["navHome", ""],
  ["navCars", "/cars"],
  ["navServices", "/services"],
  ["navAbout", "/about"],
  ["navContact", "/contact"],
] as const;

export function LocaleDirection({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);
  return null;
}

export function SiteHeader({ locale }: { locale: Locale }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function switchLocale(nextLocale: Locale) {
    const parts = window.location.pathname.split("/");
    parts[1] = nextLocale;
    window.location.assign(parts.join("/") || `/${nextLocale}`);
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <BrandLogo locale={locale} />
        <nav className={`primary-nav${menuOpen ? " is-open" : ""}`}>
          {navItems.map(([key, href]) => (
            <a
              key={key}
              href={`/${locale}${href}`}
              onClick={() => setMenuOpen(false)}
            >
              {translate(locale, key)}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <label className="language-select">
            <span className="sr-only">Language</span>
            <select
              value={locale}
              onChange={(event) => switchLocale(event.target.value as Locale)}
              aria-label="Language"
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="ar">AR</option>
            </select>
            <span aria-hidden="true">⌄</span>
          </label>
          <a className="button button-small button-red" href={`/${locale}/booking`}>
            {translate(locale, "bookNow")}
            <span aria-hidden="true">↗</span>
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-label={translate(locale, "menuOpen")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const whatsappNumber = company.whatsappNumber.replace(/\D/g, "");
  const hasAddress = company.address.trim() !== "" && company.address !== "TO_BE_CONFIRMED";
  const hasEmail = company.email.includes("@");

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <BrandLogo locale={locale} compact />
          <p>{translate(locale, "footerText")}</p>
          <span className="footer-location">
            <span className="small-dot" />
            {translate(locale, "location")}
          </span>
        </div>
        <div className="footer-column">
          <h3>{translate(locale, "footerExplore")}</h3>
          <a href={`/${locale}/cars`}>{translate(locale, "navCars")}</a>
          <a href={`/${locale}/services`}>{translate(locale, "navServices")}</a>
          <a href={`/${locale}/booking`}>{translate(locale, "bookNow")}</a>
        </div>
        <div className="footer-column">
          <h3>{translate(locale, "footerCompany")}</h3>
          <a href={`/${locale}/about`}>{translate(locale, "navAbout")}</a>
          <a href={`/${locale}/contact`}>{translate(locale, "navContact")}</a>
          <a href={`/${locale}/legal`}>{translate(locale, "legal")}</a>
        </div>
        <div className="footer-column footer-contact">
          <h3>{translate(locale, "footerContact")}</h3>
          {hasAddress && <span dir="auto">{company.address}</span>}
          {whatsappNumber && (
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
              WhatsApp <span dir="ltr">+{whatsappNumber}</span> ↗
            </a>
          )}
          <a href={`/${locale}/contact`}>{translate(locale, "navContact")} ↗</a>
          <a href={company.mapsShareUrl} target="_blank" rel="noreferrer">
            {translate(locale, "directions")} ↗
          </a>
          {hasEmail ? (
            <a href={`mailto:${company.email}`} dir="ltr">{company.email}</a>
          ) : (
            <span>{translate(locale, "emailUnavailable")}</span>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 French Rent Car · Dubai</span>
        <div>
          <a href={`/${locale}/privacy`}>{translate(locale, "privacy")}</a>
          <a href={`/${locale}/terms`}>{translate(locale, "terms")}</a>
        </div>      </div>
    </footer>
  );
}

export function FloatingContact({ locale }: { locale: Locale }) {
  const number = company.whatsappNumber.replace(/\D/g, "");
  const href = number
    ? `https://wa.me/${number}?text=${encodeURIComponent("Hello, I would like to know more about your cars in Dubai.")}`
    : `/${locale}/contact`;

  return (
    <a
      className={`floating-contact${number ? " is-whatsapp" : ""}`}
      href={href}
      target={number ? "_blank" : undefined}
      rel={number ? "noreferrer" : undefined}
      aria-label={number ? "WhatsApp" : translate(locale, "navContact")}
      title={number ? "WhatsApp" : translate(locale, "navContact")}
    >
      {number ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .4 5.2.4 11.7c0 2.1.6 4.1 1.6 5.9L0 24l6.6-1.7a11.7 11.7 0 0 0 5.6 1.4h.1c6.4 0 11.7-5.2 11.7-11.7 0-3.1-1.2-6.1-3.5-8.5Zm-8.4 18.2h-.1a9.7 9.7 0 0 1-4.9-1.3l-.4-.2-3.9 1 1-3.8-.3-.4a9.7 9.7 0 0 1-1.5-5.2c0-5.4 4.4-9.8 9.8-9.8a9.8 9.8 0 0 1 9.8 9.8c0 5.4-4.4 9.9-9.8 9.9Zm5.4-7.4c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1l-.9 1.1c-.2.2-.3.2-.6.1-1.5-.7-2.5-1.3-3.5-3-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5l-.9-2.1c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.8.4s-1 1-1 2.4 1 2.8 1.2 3c.1.2 2 3.1 4.8 4.3 1.8.8 2.5.9 3.4.8.5-.1 1.6-.7 1.8-1.4.2-.7.2-1.2.1-1.4-.1-.1-.3-.2-.6-.4Z" />
        </svg>
      ) : (
        <span aria-hidden="true">↗</span>
      )}
    </a>
  );
}

export function SiteLayout({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <>
      <LocaleDirection locale={locale} />
      <SiteHeader locale={locale} />
      <main>{children}</main>
      <SiteFooter locale={locale} />
      <FloatingContact locale={locale} />
    </>
  );
}
