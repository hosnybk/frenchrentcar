-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "clientIpHash" TEXT,
ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'en';

-- CreateIndex
CREATE INDEX "Reservation_clientIpHash_createdAt_idx" ON "Reservation"("clientIpHash", "createdAt");

-- CreateIndex
CREATE INDEX "Reservation_phone_createdAt_idx" ON "Reservation"("phone", "createdAt");

