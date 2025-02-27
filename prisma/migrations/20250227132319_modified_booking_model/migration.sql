/*
  Warnings:

  - You are about to drop the column `email` on the `Booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[current_booking_id]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `full_name` on table `Booking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone_number` on table `Booking` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "discount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "note" TEXT,
ALTER COLUMN "date_billed" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "email",
ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "full_name" SET NOT NULL,
ALTER COLUMN "phone_number" SET NOT NULL;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "current_booking_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Room_current_booking_id_key" ON "Room"("current_booking_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_number_key" ON "User"("phone_number");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_current_booking_id_fkey" FOREIGN KEY ("current_booking_id") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
