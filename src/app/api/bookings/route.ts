import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import { BookingsDtoCreate } from "@/types/dto/booking.dto";
import dayjs from "dayjs";
import { handleNextApiError } from "@/lib/error-handler/errorHandler";
import CustomError from "@/lib/error-handler/errors";

export async function GET(request: NextRequest) {
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
  console.log("Create Booking");

  try {
    // Get body
    const data: BookingsDtoCreate = await request.json();

    // Transaction
    // Check RoomType and RoomAvailable
    // Booking Room and change Room's status
    const result = await prisma.$transaction(async (tx) => {
      const bookingResults = []; // contain result of transaction

      // 1. Check on all Room Type customer booking
      for (const bookingType of data.bookingTypeList) {
        const roomTypeName = bookingType[0] as string;
        const roomType = await tx.roomType.findUnique({
          where: {
            hotel_id_name: {
              name: roomTypeName,
              hotel_id: data.hotelId,
            },
          },
        });

        if (!roomType) {
          throw new CustomError.InternalServerError(
            "Không tồn tại loại phòng!"
          );
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
            throw new CustomError.InternalServerError("Phòng không khả dụng!");
          }

          // 3. Create Booking with customer info
          const booking = await tx.booking.create({
            data: {
              full_name: data.fullName,
              phone_number: data.phoneNumber,
              check_in_date: dayjs(
                data.checkInDate,
                "MM-DD-YYYY"
              ).toISOString(),
              check_out_date: dayjs(
                data.checkOutDate,
                "MM-DD-YYYY"
              ).toISOString(),
              status: "BOOKED",
              room: {
                connect: {
                  id: room.id,
                },
              },
              ...(data.userId && {
                user: {
                  connect: {
                    id: data.userId,
                  },
                },
              }),
            },
          });

          // Add to result
          bookingResults.push(booking);
        }
      }

      return bookingResults;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error(error);

    return handleNextApiError(error);
  }
}
