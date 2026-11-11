// Admin authentication: database-backed sessions + login rate limiting.
// Server-only: imported from Server Components and Server Actions, never from client code.
import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { dummyHash, verifyPassword } from "@/lib/admin/password";

const COOKIE_NAME = "frc_admin_session";
const SESSION_HOURS = 12;
const WINDOW_MINUTES = 15;
const MAX_FAILS_PER_EMAIL = 5;
const MAX_FAILS_PER_IP = 20;

export type AdminIdentity = { id: string; email: string; role: "OWNER" | "ADMIN" | "STAFF" };

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

async function clientIpHash() {
  const forwarded = (await headers()).get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return sha256(`frc-admin:${ip}`);
}

/** Returns the signed-in admin, or null. Always reads the database (no caching). */
export async function getAdmin(): Promise<AdminIdentity | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token || token.length < 32) return null;
  const session = await prisma.adminSession.findUnique({
    where: { tokenHash: sha256(token) },
    include: { adminUser: { select: { id: true, email: true, role: true, active: true } } },
  });
  if (!session || session.expiresAt <= new Date() || !session.adminUser.active) return null;
  const { id, email, role } = session.adminUser;
  return { id, email, role };
}

export type LoginResult = { ok: true } | { ok: false; reason: "INVALID" | "LOCKED" };

export async function login(emailInput: string, password: string): Promise<LoginResult> {
  const email = emailInput.trim().toLowerCase().slice(0, 254);
  const ipHash = await clientIpHash();
  const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);

  const [failsForEmail, failsForIp] = await Promise.all([
    prisma.adminLoginAttempt.count({ where: { email, success: false, createdAt: { gte: since } } }),
    prisma.adminLoginAttempt.count({ where: { ipHash, success: false, createdAt: { gte: since } } }),
  ]);
  if (failsForEmail >= MAX_FAILS_PER_EMAIL || failsForIp >= MAX_FAILS_PER_IP) {
    return { ok: false, reason: "LOCKED" };
  }

  const user = await prisma.adminUser.findUnique({ where: { email } });
  // Always run scrypt so response time does not reveal whether the e-mail exists.
  const valid = await verifyPassword(password, user?.passwordHash ?? (await dummyHash()));
  const success = Boolean(user && user.active && valid);

  await prisma.adminLoginAttempt.create({ data: { email, ipHash, success } });
  if (!success || !user) return { ok: false, reason: "INVALID" };

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  await prisma.$transaction([
    prisma.adminSession.create({ data: { tokenHash: sha256(token), adminUserId: user.id, expiresAt } }),
    prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }),
    // Housekeeping: expired sessions and old attempts.
    prisma.adminSession.deleteMany({ where: { expiresAt: { lt: new Date() } } }),
    prisma.adminLoginAttempt.deleteMany({
      where: { createdAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    }),
  ]);

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
  });
  return { ok: true };
}

export async function logout() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token) {
    await prisma.adminSession.deleteMany({ where: { tokenHash: sha256(token) } });
  }
  store.delete(COOKIE_NAME);
}
