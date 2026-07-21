/*
  Warnings:

  - A unique constraint covering the columns `[seatId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `seatId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('AVAILABLE', 'HELD', 'BOOKED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "SeatClass" AS ENUM ('ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BookingStatus" ADD VALUE 'CHECKED_IN';
ALTER TYPE "BookingStatus" ADD VALUE 'COMPLETED';

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_flightId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "seatId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Seat" (
    "id" TEXT NOT NULL,
    "seatNumber" TEXT NOT NULL,
    "class" "SeatClass" NOT NULL DEFAULT 'ECONOMY',
    "status" "SeatStatus" NOT NULL DEFAULT 'AVAILABLE',
    "flightId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Seat_flightId_seatNumber_key" ON "Seat"("flightId", "seatNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_seatId_key" ON "Booking"("seatId");

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
