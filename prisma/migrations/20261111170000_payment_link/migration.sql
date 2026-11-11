-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "payToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_payToken_key" ON "Reservation"("payToken");

