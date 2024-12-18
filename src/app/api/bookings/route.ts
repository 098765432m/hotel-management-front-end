import { Booking } from "@/types/booking.interface";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import { BookingsDtoCreate } from "@/types/dto/booking.dto";
import dayjs from "dayjs";
import { BookingState } from "@/components/customer/hotel-page/AvailableRooms";
import { log } from "node:console";

export async function GET() {
  const bookings = await prisma.booking.findMany({
    include: {
      room: true,
      user: true,
    },
  });
  return NextResponse.json(bookings);
}

// Customer Booking in Hotel Page
export async function POST(request: Request) {
  try {
    // Get body
    const data: BookingsDtoCreate = await request.json();
    console.log(data);

    // Create query whether customer booking with account or not
    let query = {};
    if (data.user_id != undefined) {
      query = { user_id: data.user_id };
    } else {
      query = {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
      };
    }

    // Transaction
    // Check RoomType and RoomAvailable
    // Booking Room and change Room's status
    const result = await prisma.$transaction(async (tx) => {
      const bookingResults = []; // contain result of transaction

      // 1. Check on all Room Type customer booking
      for (const bookingType of data.booking_type_list) {
        const roomTypeName = bookingType[0] as string;
        const roomType = await tx.roomTypes.findUnique({
          where: {
            hotel_id_name: {
              name: roomTypeName,
              hotel_id: data.hotel_id,
            },
          },
        });

        if (!roomType) {
          throw new Error("Không tồn tại loại phòng!");
        }

        // 2. Loop to check all Rooms available
        for (
          let index = 0;
          index < parseInt(bookingType[1] as string);
          index++
        ) {
          const room = await tx.room.findFirst({
            where: {
              room_type_id: roomType.id,
              status_room: "AVAILABLE",
            },
          });

          if (!room) {
            throw new Error("Phòng không khả dụng");
          }

          // 3. Update Room's status
          await tx.room.update({
            where: {
              id: room.id,
            },
            data: {
              status_room: "OCCUPIED",
            },
          });

          // 4. Create Booking with customer info
          const booking = await tx.booking.create({
            data: {
              ...query,
              check_in_date: dayjs(
                data.check_in_date,
                "MM-DD-YYYY"
              ).toISOString(),
              check_out_date: dayjs(
                data.check_out_date,
                "MM-DD-YYYY"
              ).toISOString(),
              status: "BOOKED",
              room_id: room.id,
            },
          });

          // add to result
          bookingResults.push(booking);
        }
      }

      return bookingResults;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}
