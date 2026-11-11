# French Rent Car Dubai

Premium, multilingual car-rental website built with Next.js App Router, React, TypeScript and CSS. The current release is a production-oriented demonstration: vehicle inventory and AED rates are fictional; public enquiries are stored in the visitor's browser only; rental availability, company contact details, online payment and the admin area are not presented as live services.

## Run locally

Requirements: Node.js 20.9+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000` (redirects to `/en`). Localized routes are `/en`, `/fr` and `/ar`.

Useful commands:

```bash
npm run lint
npm run build
npm run start
```

## Deploy to Vercel

The project builds on Vercel with no database or payment keys required; the public pages and the browser-only enquiry flow work out of the box.

1. Push the repository to GitHub, then import it in Vercel (**Add New → Project**). The Next.js preset and `next build` are detected automatically; `postinstall` runs `prisma generate`.
2. Add environment variables under **Settings → Environment Variables** (see `.env.example`):
   - `NEXT_PUBLIC_SITE_URL` — production origin used by `sitemap.xml`, `robots.txt`, `metadataBase` and Stripe redirect URLs.
   - Optional branding/contact values: `NEXT_PUBLIC_COMPANY_*`, `NEXT_PUBLIC_OPENING_HOURS`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL`.
   - `DATABASE_URL` — only if you use the persistent reservation API.
   - `STRIPE_*` — only if you enable TEST checkout (see the Stripe section).
3. Deploy.

`vercel.json` adds baseline security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS) and long-lived caching for `/fonts` and `/images`. No Content-Security-Policy is shipped yet: a safe CSP must be introduced with nonces and validated against the Google Maps embed, so add it only after testing. `NEXT_PUBLIC_*` variables are exposed to the browser, so never put secrets in them. Without `DATABASE_URL`, `POST /api/reservations` and `POST /api/checkout` return `503` while the rest of the site keeps working.

## Languages and routes

Translations live in `lib/translations.ts`. The locale prefix is retained across navigation. The `app/[lang]/layout.tsx` file is the root layout and renders the `<html lang>` and `dir` attributes per locale on the server (Arabic is `dir="rtl"`); the `/` root path is redirected to `/en` in `next.config.ts`. Site pages are provided in all three locales:

- `/{lang}` home
- `/{lang}/cars` fleet
- `/{lang}/cars/{slug}` vehicle details
- `/{lang}/booking` rental enquiry
- `/{lang}/services`, `/{lang}/about`, `/{lang}/contact`
- `/{lang}/terms`, `/{lang}/privacy`, `/{lang}/legal`

`app/sitemap.ts` and `app/robots.ts` provide search-engine metadata. Set `NEXT_PUBLIC_SITE_URL` to the verified production origin before deploying.

## Brand and content configuration

Edit `config/company.ts` or set public values in `.env.local`:

- `NEXT_PUBLIC_COMPANY_NAME`, `NEXT_PUBLIC_COMPANY_LOCATION`, `NEXT_PUBLIC_COMPANY_ADDRESS`
- `NEXT_PUBLIC_COMPANY_LATITUDE`, `NEXT_PUBLIC_COMPANY_LONGITUDE`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_COMPANY_PHONE`, `NEXT_PUBLIC_COMPANY_EMAIL`
- `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL`, `NEXT_PUBLIC_OPENING_HOURS`

The WhatsApp call-to-action falls back to the Contact page when the number is blank. The provided Google Maps share link resolves to the French car-rental listing in Dubai. The Contact page uses a query-based Maps embed for that listing and retains the original share URL as its directions target. No coordinates or exact street address are inferred.

Phone and email details mentioned in the supplied brief are kept in `company.brochureEmailsToConfirm` as unverified references and are not shown as confirmed contact channels.

The header mark is an inline vector interpretation of the logo visible in the brief. Replace `components/BrandLogo.tsx` with the approved original source asset if the company provides a production-ready SVG or image file.

## Demo fleet and enquiries

The eight fictional vehicle records are centralized in `lib/vehicles.ts`. Each is explicitly demo data with indicative AED amounts. Replace these records and generated photographs with approved company inventory before publication. Do not use sample prices as a commercial offer.

The browser demo supports category, seating and price filters, sorting, date validation, and an indicative duration calculation. The enquiry form creates a `FRC-D-*` reference and stores a pending request in `localStorage` under `frc-demo-requests`; contact form data is stored in `frc-demo-messages`. This is local to that browser and is not delivered to the company. The success state says so explicitly. Clear these keys to remove browser demo data.

`POST /api/reservations` is the future persistent path. It accepts only active, non-demo inventory stored in PostgreSQL and creates a pending reservation with server-calculated rates. Sample inventory is rejected. Before using it for public traffic, configure abuse protection/rate limits, privacy retention, email notifications, operational staff access, monitoring, and robust database-level date-overlap guarantees.

## Database

PostgreSQL schema is in `prisma/schema.prisma`. It defines vehicles, reservations, payments, Stripe event idempotency and administrator roles. Configure `DATABASE_URL`, then:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

For production, use reviewed migrations (`npx prisma migrate deploy`) and a managed PostgreSQL service. No production database or demo PII is included in this repository. The admin route is intentionally disabled; the role schema alone is not an authentication system.

## Stripe TEST

No payment is enabled in the website UI. `/checkout` explains this, and success/cancel pages never claim a payment succeeded. Demo inventory and browser-only enquiries cannot be charged.

The server-side Checkout endpoint (`POST /api/checkout`) is guarded and requires all of the following:

- `STRIPE_MODE=TEST`
- `DEMO_DATA=false`
- `ALLOW_TEST_PAYMENTS=true`
- `STRIPE_SECRET_KEY` beginning with `sk_test_`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` beginning with `pk_test_`
- `STRIPE_WEBHOOK_SECRET` from a Stripe test webhook
- A pending reservation linked to an active, non-demo database vehicle

The secret key is read only on the server. The webhook at `/api/stripe/webhook` verifies the Stripe signature against the raw request body, checks the test-payment amount and AED currency against the stored reservation, and processes event IDs idempotently. A successful payment updates the payment record only; the rental remains pending until an authorized operator confirms it.

Use Stripe's test dashboard and test cards only. There is no LIVE-key path in this release. Never switch test keys to live keys without a separate security, legal, operational and financial review.

## Google Maps and WhatsApp

The share URL in `config/company.ts` is `https://share.google/LuyL1LUyiRsHyMKTO`. A query-based Maps iframe is provided for the resolved business listing; `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` can override it with the company's verified embed URL. The original directions link remains available.

Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to digits including country code, without `+`, spaces or punctuation. Until configured, buttons link to Contact rather than generating an invalid `wa.me` link.

## Administrator and production readiness

`/{lang}/admin` deliberately displays that access is not enabled. Before building an admin dashboard, add and independently review authentication, secure session cookies, role-based authorization on every admin API, account recovery, audit logs, rate limits and CSRF protections. Never treat an obscure URL or the Prisma role enum as access control.

Before launch:

1. Confirm and publish the legal company details, official address, licence information, contact channels, hours and rental terms.
2. Replace all demonstration vehicles, rates and imagery; set `DEMO_DATA=false` only after removing or rejecting all demo inventory.
3. Add authentication and admin workflows, mail delivery, database-backed enquiry submission, observability and abuse protection.
4. Verify the Maps listing/embed and configure the WhatsApp number; test all EN/FR/AR routes and Arabic RTL on real devices.
5. Run migrations, `npm run lint`, `npm run build`, accessibility checks, mobile/browser tests and a security review.
6. Configure test Stripe credentials and webhook, test success/failure/duplicate events, and verify the reservation remains pending after payment.

No airport collection or vehicle delivery service, customer review, certification or partnership is claimed by this site.
