// Loads the website fleet (lib/vehicles.ts) into the database.
// Usage: npm run db:seed   (requires DATABASE_URL; Node 22.18+ for .ts imports)
// Safe to run several times: vehicles are upserted by slug. Vehicles that are
// no longer in lib/vehicles.ts are deactivated, never deleted (reservations keep
// their history).
import { PrismaClient } from "@prisma/client";
import { vehicles } from "../lib/vehicles.ts";

const prisma = new PrismaClient();

async function main() {
  const slugs = vehicles.map((vehicle) => vehicle.slug);
  let count = 0;

  for (const vehicle of vehicles) {
    const data = {
      name: vehicle.name,
      category: vehicle.category,
      categories: vehicle.categories,
      year: vehicle.year ?? null,
      seats: vehicle.seats ?? null,
      doors: vehicle.doors ?? null,
      imageUrls: [vehicle.image],
      dailyAED: vehicle.daily,
      weeklyAED: vehicle.weekly ?? null,
      monthlyAED: vehicle.monthly ?? null,
      sortOrder: vehicle.popular,
      isDemo: false,
      isActive: true,
    };
    await prisma.vehicle.upsert({
      where: { slug: vehicle.slug },
      create: { slug: vehicle.slug, ...data },
      update: data,
    });
    count++;
  }

  const deactivated = await prisma.vehicle.updateMany({
    where: { slug: { notIn: slugs }, isActive: true },
    data: { isActive: false },
  });

  console.log(`Vehicles upserted: ${count}. Deactivated (no longer listed): ${deactivated.count}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
