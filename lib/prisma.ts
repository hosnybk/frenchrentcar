import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// On Vercel the Neon integration was connected with the "FRC" prefix, so the
// connection string is exposed as FRC_DATABASE_URL. Locally it is DATABASE_URL.
// Prisma reads env("DATABASE_URL") from the schema; datasourceUrl below overrides it.
// Neon's pooled endpoint ("-pooler" host) runs PgBouncer: Prisma needs pgbouncer=true there,
// otherwise long series of queries can fail with P1017 "Server has closed the connection".
function withPgbouncer(raw?: string) {
  if (!raw) return raw;
  try {
    const url = new URL(raw);
    if (url.hostname.includes("-pooler") && !url.searchParams.has("pgbouncer")) {
      url.searchParams.set("pgbouncer", "true");
    }
    return url.toString();
  } catch {
    return raw;
  }
}

// FRC_DATABASE_URL (Neon) takes priority: another storage integration on the Vercel
// project also exposes a DATABASE_URL that must not be used.
const datasourceUrl = withPgbouncer(process.env.FRC_DATABASE_URL || process.env.DATABASE_URL);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(datasourceUrl ? { datasourceUrl } : {}),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
