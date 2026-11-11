"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdmin, login, logout } from "@/lib/admin/session";
import { newPayToken } from "@/lib/payments";

const langSchema = z.enum(["en", "fr", "ar"]).catch("fr");
const statusFilterSchema = z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "ALL"]).catch("PENDING");

export type LoginState = { error: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const lang = langSchema.parse(formData.get("lang"));
  const parsed = z
    .object({ email: z.string().trim().min(3).max(254), password: z.string().min(1).max(200) })
    .safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: "E-mail ou mot de passe incorrect." };

  const result = await login(parsed.data.email, parsed.data.password);
  if (!result.ok) {
    return {
      error:
        result.reason === "LOCKED"
          ? "Trop de tentatives. Réessayez dans 15 minutes."
          : "E-mail ou mot de passe incorrect.",
    };
  }
  redirect(`/${lang}/admin`);
}

export async function logoutAction(formData: FormData) {
  const lang = langSchema.parse(formData.get("lang"));
  await logout();
  redirect(`/${lang}/admin`);
}

export async function updateReservationStatus(formData: FormData) {
  const lang = langSchema.parse(formData.get("lang"));
  const filter = statusFilterSchema.parse(formData.get("filter"));
  const back = (notice: string) => redirect(`/${lang}/admin?status=${filter}&notice=${notice}`);

  const admin = await getAdmin();
  if (!admin) redirect(`/${lang}/admin`);

  const input = z
    .object({ id: z.string().min(1).max(100), action: z.enum(["confirm", "cancel"]) })
    .safeParse({ id: formData.get("id"), action: formData.get("action") });
  if (!input.success) back("invalid");
  const { id, action } = input.data!;

  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: { payment: { select: { status: true } } },
  });
  if (!reservation || reservation.isDemo) back("not_found");

  if (action === "confirm") {
    if (reservation!.status !== "PENDING") back("not_pending");
    const conflict = await prisma.reservation.findFirst({
      where: {
        id: { not: id },
        vehicleId: reservation!.vehicleId,
        status: "CONFIRMED",
        pickupAt: { lt: reservation!.returnAt },
        returnAt: { gt: reservation!.pickupAt },
      },
      select: { reference: true },
    });
    if (conflict) back(`conflict_${conflict.reference}`);
    await prisma.reservation.update({
      where: { id },
      data: { status: "CONFIRMED", confirmedAt: new Date(), payToken: reservation!.payToken ?? newPayToken() },
    });
    back("confirmed");
  }

  // cancel
  if (reservation!.status !== "PENDING" && reservation!.status !== "CONFIRMED") back("not_cancellable");
  if (reservation!.payment?.status === "PAID") back("paid_refund_first");
  await prisma.reservation.update({ where: { id }, data: { status: "CANCELLED" } });
  back("cancelled");
}
