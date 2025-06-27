/*
  Warnings:

  - A unique constraint covering the columns `[guest_id,hotel_id]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Hotel" ALTER COLUMN "average_rating" SET DEFAULT 5;

-- AlterTable
ALTER TABLE "Rating" ALTER COLUMN "comment" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Maintainance" (
    "id" TEXT NOT NULL,
    "date_start" TIMESTAMP(3) NOT NULL,
    "date_expire" TIMESTAMP(3) NOT NULL,
    "hotel_id" TEXT,
    "room_id" TEXT,

    CONSTRAINT "Maintainance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Maintainance_id_key" ON "Maintainance"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_guest_id_hotel_id_key" ON "Rating"("guest_id", "hotel_id");

-- AddForeignKey
ALTER TABLE "Maintainance" ADD CONSTRAINT "Maintainance_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintainance" ADD CONSTRAINT "Maintainance_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
