import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { AdminIdentity } from "@/lib/admin/session";
import { payLink, siteOrigin } from "@/lib/payments";
import { logoutAction, updateReservationStatus } from "./actions";

function paymentMessage(locale: string, reference: string, vehicle: string, amount: number, link: string) {
  const total = `${amount.toLocaleString("en-US")} AED`;
  if (locale === "ar") {
    return `French Rent Car: تم تأكيد حجزك ${reference} (${vehicle}). المبلغ: ${total}. للدفع بأمان عبر Stripe: ${link}`;
  }
  if (locale === "en") {
    return `French Rent Car: your booking ${reference} (${vehicle}) is confirmed. Amount: ${total}. Pay securely with Stripe: ${link}`;
  }
  return `French Rent Car : votre réservation ${reference} (${vehicle}) est confirmée. Montant : ${total}. Paiement sécurisé par Stripe : ${link}`;
}

const FILTERS = [
  ["PENDING", "En attente"],
  ["CONFIRMED", "Confirmées"],
  ["CANCELLED", "Annulées"],
  ["ALL", "Toutes"],
] as const;

type Filter = (typeof FILTERS)[number][0];

const STATUS_LABEL: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  CANCELLED: "Annulée",
  COMPLETED: "Terminée",
};

const PAYMENT_LABEL: Record<string, string> = {
  UNPAID: "Non payée",
  PENDING: "Paiement en cours",
  PAID: "Payée",
  FAILED: "Paiement échoué",
  REFUNDED: "Remboursée",
};

function noticeText(notice?: string) {
  if (!notice) return null;
  if (notice.startsWith("conflict_")) {
    return { ok: false, text: `Impossible de confirmer : la voiture est déjà confirmée sur ces dates (réservation ${notice.slice(9)}).` };
  }
  const map: Record<string, { ok: boolean; text: string }> = {
    confirmed: { ok: true, text: "Réservation confirmée." },
    cancelled: { ok: true, text: "Réservation annulée." },
    not_pending: { ok: false, text: "Seule une réservation en attente peut être confirmée." },
    not_cancellable: { ok: false, text: "Cette réservation ne peut pas être annulée." },
    paid_refund_first: { ok: false, text: "Réservation payée : remboursez-la avant de l’annuler." },
    not_found: { ok: false, text: "Réservation introuvable." },
    invalid: { ok: false, text: "Action invalide." },
  };
  return map[notice] ?? null;
}

const dubai = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Asia/Dubai",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminDashboard({
  lang,
  admin,
  status,
  notice,
}: {
  lang: string;
  admin: AdminIdentity;
  status?: string;
  notice?: string;
}) {
  const filter: Filter = FILTERS.some(([value]) => value === status) ? (status as Filter) : "PENDING";

  const reservations = await prisma.reservation.findMany({
    where: { isDemo: false, ...(filter === "ALL" ? {} : { status: filter }) },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      vehicle: { select: { name: true, slug: true } },
      payment: { select: { status: true } },
    },
  });

  // Overlap warnings: other active (pending/confirmed) requests for the same car and dates.
  const active = await prisma.reservation.findMany({
    where: {
      isDemo: false,
      status: { in: ["PENDING", "CONFIRMED"] },
      vehicleId: { in: [...new Set(reservations.map((r) => r.vehicleId))] },
    },
    select: { id: true, reference: true, vehicleId: true, pickupAt: true, returnAt: true, status: true },
  });
  const overlaps = (r: (typeof reservations)[number]) =>
    active.filter(
      (o) => o.id !== r.id && o.vehicleId === r.vehicleId && o.pickupAt < r.returnAt && o.returnAt > r.pickupAt,
    );

  const counts = await prisma.reservation.groupBy({
    by: ["status"],
    where: { isDemo: false },
    _count: true,
  });
  const countOf = (value: Filter) =>
    value === "ALL"
      ? counts.reduce((sum, c) => sum + c._count, 0)
      : (counts.find((c) => c.status === value)?._count ?? 0);

  const message = noticeText(notice);
  const origin = siteOrigin((await headers()).get("host"));

  return (
    <section className="page-wrap admin-dashboard">
      <div className="admin-head">
        <div>
          <span className="eyebrow">FRENCH FOR CAR RENTAL CO. · ADMIN</span>
          <h1>Réservations</h1>
        </div>
        <form action={logoutAction} className="admin-user">
          <input type="hidden" name="lang" value={lang} />
          <span>{admin.email}</span>
          <button type="submit" className="text-link">Se déconnecter</button>
        </form>
      </div>

      <nav className="admin-tabs" aria-label="Filtrer les réservations">
        {FILTERS.map(([value, label]) => (
          <a key={value} href={`/${lang}/admin?status=${value}`} aria-current={filter === value ? "page" : undefined}>
            {label} <span>{countOf(value)}</span>
          </a>
        ))}
      </nav>

      {message && (
        <p className={message.ok ? "admin-notice" : "admin-notice is-error"} role="status">
          {message.text}
        </p>
      )}

      {reservations.length === 0 ? (
        <p className="admin-empty">Aucune réservation dans cette liste.</p>
      ) : (
        <div className="admin-list">
          {reservations.map((r) => {
            const conflicts = overlaps(r);
            const phoneDigits = r.phone.replace(/\D/g, "");
            return (
              <article key={r.id} className="admin-card">
                <header>
                  <strong>{r.reference}</strong>
                  <span className={`admin-badge status-${r.status.toLowerCase()}`}>{STATUS_LABEL[r.status]}</span>
                  <span className="admin-badge">{PAYMENT_LABEL[r.payment?.status ?? "UNPAID"]}</span>
                </header>
                <dl>
                  <div><dt>Voiture</dt><dd><a href={`/${lang}/cars/${r.vehicle.slug}`} target="_blank" rel="noreferrer">{r.vehicle.name}</a></dd></div>
                  <div><dt>Départ</dt><dd>{dubai.format(r.pickupAt)}</dd></div>
                  <div><dt>Retour</dt><dd>{dubai.format(r.returnAt)}</dd></div>
                  <div><dt>Montant estimé</dt><dd>{r.estimatedAED.toLocaleString("fr-FR")} AED</dd></div>
                  <div><dt>Client</dt><dd>{r.fullName}</dd></div>
                  <div>
                    <dt>Téléphone</dt>
                    <dd>
                      {phoneDigits.length >= 6 ? (
                        <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noreferrer" dir="ltr">{r.phone}</a>
                      ) : (
                        <span dir="ltr">{r.phone}</span>
                      )}
                    </dd>
                  </div>
                  <div><dt>E-mail</dt><dd><a href={`mailto:${r.email}`}>{r.email}</a></dd></div>
                  <div><dt>Langue</dt><dd>{r.locale.toUpperCase()}</dd></div>
                  <div><dt>Reçue le</dt><dd>{dubai.format(r.createdAt)}</dd></div>
                </dl>
                {r.message && <p className="admin-message">{r.message}</p>}
                {conflicts.length > 0 && (
                  <p className="admin-notice is-error">
                    Dates en conflit avec : {conflicts.map((c) => `${c.reference} (${STATUS_LABEL[c.status]})`).join(", ")}
                  </p>
                )}
                {r.status === "CONFIRMED" && r.payToken && r.payment?.status !== "PAID" && (() => {
                  const link = payLink(origin, r.locale, r.reference, r.payToken);
                  const text = paymentMessage(r.locale, r.reference, r.vehicle.name, r.estimatedAED, link);
                  return (
                    <div className="admin-paylink">
                      <span>Lien de paiement à envoyer au client :</span>
                      <code>{link}</code>
                      <div className="admin-actions">
                        {phoneDigits.length >= 6 && (
                          <a
                            className="button button-red button-small"
                            href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(text)}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Envoyer au client par WhatsApp
                          </a>
                        )}
                        <a className="button button-outline button-small" href={link} target="_blank" rel="noreferrer">
                          Ouvrir la page de paiement
                        </a>
                      </div>
                    </div>
                  );
                })()}
                {(r.status === "PENDING" || r.status === "CONFIRMED") && (
                  <form action={updateReservationStatus} className="admin-actions">
                    <input type="hidden" name="lang" value={lang} />
                    <input type="hidden" name="filter" value={filter} />
                    <input type="hidden" name="id" value={r.id} />
                    {r.status === "PENDING" && (
                      <button type="submit" name="action" value="confirm" className="button button-red button-small">
                        Confirmer
                      </button>
                    )}
                    <button type="submit" name="action" value="cancel" className="button button-outline button-small">
                      Annuler
                    </button>
                  </form>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
