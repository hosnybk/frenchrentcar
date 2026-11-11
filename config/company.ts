export const company = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME ?? "French Rent Car",
  location: process.env.NEXT_PUBLIC_COMPANY_LOCATION ?? "Dubai, UAE",
  address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS ?? "TO_BE_CONFIRMED",
  latitude: process.env.NEXT_PUBLIC_COMPANY_LATITUDE ?? "TO_BE_CONFIRMED",
  longitude: process.env.NEXT_PUBLIC_COMPANY_LONGITUDE ?? "TO_BE_CONFIRMED",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE ?? "TO_BE_CONFIRMED",
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? "TO_BE_CONFIRMED",
  brochureEmailsToConfirm: [
    "zaoui.bechir@frenchrentcar.com",
    "info@frenchrentcar.com",
  ],
  mapsShareUrl: "https://share.google/LuyL1LUyiRsHyMKTO",
  mapsEmbedUrl:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ??
    "https://www.google.com/maps?output=embed&q=French+car+rental+Dubai",
  openingHours: process.env.NEXT_PUBLIC_OPENING_HOURS ?? "TO_BE_CONFIGURED",
  socialLinks: {
    instagram: "",
    facebook: "",
    linkedin: "",
  },
  stripeMode: "TEST",
  demoData: process.env.DEMO_DATA !== "false",
} as const;
