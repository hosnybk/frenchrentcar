import { createHash } from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const LIMIT_PER_IP_PER_HOUR = 5;
const LIMIT_PER_PHONE_PER_DAY = 5;
const LIMIT_GLOBAL_PER_HOUR = 60;

const reservationSchema = z
  .object({
    vehicleSlug: z.string().min(1).max(100),
    fullName: z.string().trim().min(2).max(120),
    email: z.email().max(254),
    phone: z.string().trim().min(6).max(40),
    pickupDate: z.iso.date(),
    returnDate: z.iso.date(),
    pickupTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    returnTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    message: z.string().trim().max(2000).optional().default(""),
    locale: z.enum(["en", "fr", "ar"]).default("en"),
    /** Honeypot field, must stay empty. */
    website: z.string().max(200).optional().default(""),
  })
  .strict();

function rentalDays(start: Date, end: Date) {
  return Math.ceil((end.getTime() - start.getTime()) / 86_400_000);
}

function dubaiDate(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour - 4, minute));
}

// Same rule as the website estimate: weekly/monthly rates fall back to the daily rate.
function estimateAed(
  days: number,
  rates: { dailyAED: number; weeklyAED: number | null; monthlyAED: number | null },
) {
  const weekly = rates.weeklyAED ?? rates.dailyAED * 7;
  const monthly = rates.monthlyAED ?? rates.dailyAED * 30;
  if (days >= 30) {
    const rest = days % 30;
    return Math.floor(days / 30) * monthly + Math.floor(rest / 7) * weekly + (rest % 7) * rates.dailyAED;
  }
  if (days >= 7) {
    return Math.floor(days / 7) * weekly + (days % 7) * rates.dailyAED;
  }
  return days * rates.dailyAED;
}

export async function POST(request: Request) {
  let payload: z.infer<typeof reservationSchema>;
  try {
    payload = reservationSchema.parse(await request.json());
  } catch {
    return Response.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  // Honeypot: real visitors never fill this hidden field. Pretend success, save nothing.
  if (payload.website) {
    return Response.json(
      { reference: `FRC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, status: "PENDING" },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  }

  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const clientIpHash = createHash("sha256").update(`frc:${clientIp}`).digest("hex");

  const pickupAt = dubaiDate(payload.pickupDate, payload.pickupTime);
  const returnAt = dubaiDate(payload.returnDate, payload.returnTime);
  const days = rentalDays(pickupAt, returnAt);
  if (days < 1 || pickupAt < new Date()) {
    return Response.json({ error: "INVALID_RENTAL_DATES" }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const vehicle = await tx.vehicle.findFirst({
          where: {
            slug: payload.vehicleSlug,
            isActive: true,
            isDemo: false,
          },
        });
        if (!vehicle) return { error: "VEHICLE_NOT_AVAILABLE" as const };

        // Anti-abuse limits. Availability (overlapping dates) is checked by staff
        // when they confirm the request in the admin area, not here.
        const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const [fromIp, fromPhone, lastHour] = await Promise.all([
          tx.reservation.count({ where: { clientIpHash, createdAt: { gte: hourAgo } } }),
          tx.reservation.count({ where: { phone: payload.phone, createdAt: { gte: dayAgo } } }),
          tx.reservation.count({ where: { createdAt: { gte: hourAgo } } }),
        ]);
        if (fromIp >= LIMIT_PER_IP_PER_HOUR || fromPhone >= LIMIT_PER_PHONE_PER_DAY || lastHour >= LIMIT_GLOBAL_PER_HOUR) {
          return { error: "TOO_MANY_REQUESTS" as const };
        }

        const reference = `FRC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
        const reservation = await tx.reservation.create({
          data: {
            reference,
            vehicleId: vehicle.id,
            fullName: payload.fullName,
            email: payload.email,
            phone: payload.phone,
            pickupAt,
            returnAt,
            message: payload.message || null,
            estimatedAED: estimateAed(days, vehicle),
            status: "PENDING",
            isDemo: false,
            locale: payload.locale,
            clientIpHash,
          },
          select: { reference: true, estimatedAED: true, status: true },
        });
        return { reservation };
      },
      { isolationLevel: "Serializable" },
    );

    if ("error" in result) {
      return Response.json(
        { error: result.error },
        { status: result.error === "TOO_MANY_REQUESTS" ? 429 : 409 },
      );
    }
    return Response.json(result.reservation, {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({ error: "RESERVATION_SERVICE_UNAVAILABLE" }, { status: 503 });
  }
}
