/*
  Warnings:

  - You are about to drop the `Maintainance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Maintainance" DROP CONSTRAINT "Maintainance_hotel_id_fkey";

-- DropForeignKey
ALTER TABLE "Maintainance" DROP CONSTRAINT "Maintainance_room_id_fkey";

-- DropTable
DROP TABLE "Maintainance";

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" TEXT NOT NULL,
    "date_start" TIMESTAMP(3) NOT NULL,
    "date_expire" TIMESTAMP(3) NOT NULL,
    "hotel_id" TEXT,
    "room_id" TEXT,

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Maintenance_id_key" ON "Maintenance"("id");

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
