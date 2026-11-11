import { z } from "zod";
import { prisma } from "@/lib/prisma";

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

function estimateAed(days: number, rates: { dailyAED: number; weeklyAED: number; monthlyAED: number }) {
  if (days >= 30) {
    return Math.floor(days / 30) * rates.monthlyAED + Math.ceil((days % 30) / 7) * rates.weeklyAED;
  }
  if (days >= 7) {
    return Math.floor(days / 7) * rates.weeklyAED + (days % 7) * rates.dailyAED;
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

        const overlap = await tx.reservation.findFirst({
          where: {
            vehicleId: vehicle.id,
            status: { in: ["PENDING", "CONFIRMED"] },
            pickupAt: { lt: returnAt },
            returnAt: { gt: pickupAt },
          },
          select: { id: true },
        });
        if (overlap) return { error: "DATES_REQUIRE_CONFIRMATION" as const };

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
          },
          select: { id: true, reference: true, estimatedAED: true, status: true },
        });
        return { reservation };
      },
      { isolationLevel: "Serializable" },
    );

    if ("error" in result) {
      return Response.json({ error: result.error }, { status: 409 });
    }
    return Response.json(result.reservation, {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({ error: "RESERVATION_SERVICE_UNAVAILABLE" }, { status: 503 });
  }
}
