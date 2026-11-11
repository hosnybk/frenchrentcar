import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// On Vercel the Neon integration was connected with the "FRC" prefix, so the
// connection string is exposed as FRC_DATABASE_URL. Locally it is DATABASE_URL.
const datasourceUrl = process.env.DATABASE_URL || process.env.FRC_DATABASE_URL;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(datasourceUrl ? { datasourceUrl } : {}),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
