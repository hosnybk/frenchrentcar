// Runs before `next build` on Vercel (npm run vercel-build):
// 1. applies pending Prisma migrations to the database of this environment,
// 2. syncs the fleet from lib/vehicles.ts (idempotent upsert).
// On Vercel the Neon integration exposes FRC_DATABASE_URL / FRC_DATABASE_URL_UNPOOLED;
// locally the names are DATABASE_URL / DATABASE_URL_UNPOOLED.
import { execSync } from "node:child_process";

const url = process.env.DATABASE_URL || process.env.FRC_DATABASE_URL;
const direct = process.env.DATABASE_URL_UNPOOLED || process.env.FRC_DATABASE_URL_UNPOOLED || url;

if (!url) {
  console.log("[db-deploy] No database URL in this environment: migrations and seed skipped.");
  process.exit(0);
}

const env = { ...process.env, DATABASE_URL: url, DATABASE_URL_UNPOOLED: direct };
console.log("[db-deploy] Applying migrations…");
execSync("npx prisma migrate deploy", { stdio: "inherit", env });
console.log("[db-deploy] Syncing vehicles…");
execSync("node --no-warnings prisma/seed.mjs", { stdio: "inherit", env });
