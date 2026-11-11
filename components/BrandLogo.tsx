export default function BrandLogo({
  compact = false,
  locale = "en",
}: {
  compact?: boolean;
  locale?: string;
}) {
  return (
    <a
      className={`brand-lockup${compact ? " brand-lockup-compact" : ""}`}
      href={`/${locale}`}
      aria-label="French Rent Car home"
    >
      <svg
        aria-hidden="true"
        className="brand-mark"
        viewBox="0 0 74 58"
        fill="none"
      >
        <path
          d="M11 37 20 28l9-19 3 19 5-15 4 15 8 9 8 8M20 28h31M16 38c6-8 12-12 21-12 8 0 14 4 20 12"
          stroke="#c72d40"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 48c10-3 17-4 26-3l9 2c7 2 13 1 19 0 4-1 7 0 10 3l-2 3H9c-3 0-5-2-4-5Z"
          stroke="#f7f6f2"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="52" r="2.5" stroke="#f7f6f2" strokeWidth="1.5" />
        <circle cx="54" cy="52" r="2.5" stroke="#f7f6f2" strokeWidth="1.5" />
      </svg>
      <span className="brand-wordmark">
        FRENCH RENT <span>CAR</span>
      </span>
    </a>
  );
}
