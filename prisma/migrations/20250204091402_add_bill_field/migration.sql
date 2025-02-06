/*
  Warnings:

  - You are about to drop the column `fullName` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `RoomTypes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,room_type_id]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `full_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_room_type_id_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_room_type_id_fkey";

-- DropForeignKey
ALTER TABLE "RoomTypes" DROP CONSTRAINT "RoomTypes_hotel_id_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "fullName",
DROP COLUMN "phoneNumber",
ADD COLUMN     "full_name" TEXT,
ADD COLUMN     "phone_number" TEXT;

-- AlterTable
ALTER TABLE "Hotel" ADD COLUMN     "average_rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "fullName",
DROP COLUMN "isActive",
DROP COLUMN "phoneNumber",
ADD COLUMN     "full_name" TEXT NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone_number" TEXT NOT NULL;

-- DropTable
DROP TABLE "RoomTypes";

-- CreateTable
CREATE TABLE "RoomType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "hotel_id" TEXT NOT NULL,

    CONSTRAINT "RoomType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bill" (
    "id" TEXT NOT NULL,
    "total_price" INTEGER NOT NULL,
    "check_in_date" TIMESTAMP(3) NOT NULL,
    "check_out_date" TIMESTAMP(3) NOT NULL,
    "guest_name" TEXT NOT NULL,
    "guest_phone" TEXT NOT NULL,
    "hotel_name" TEXT NOT NULL,
    "room_type_name" TEXT NOT NULL,
    "room_name" TEXT NOT NULL,
    "staff_billed_name" TEXT NOT NULL,
    "date_billed" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomType_id_key" ON "RoomType"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RoomType_hotel_id_name_key" ON "RoomType"("hotel_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Bill_id_key" ON "Bill"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_room_type_id_key" ON "Room"("name", "room_type_id");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "RoomType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomType" ADD CONSTRAINT "RoomType_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "RoomType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
