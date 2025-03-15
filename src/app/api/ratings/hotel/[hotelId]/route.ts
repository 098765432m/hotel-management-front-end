import { prisma } from "@/lib/client";
import { handleNextApiError } from "@/lib/error-handler/errorHandler";
import CustomError from "@/lib/error-handler/errors";
import { ApiResponseClass } from "@/types/common/api-response";
import {
  RatingCreateDtoRequest,
  RatingHotelApiResponse,
} from "@/types/dto/rating.dto";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { hotelId: string } }
) {
  try {
    const hotelId = params.hotelId;

    const ratings = await prisma.rating.findMany({
      where: {
        hotel_id: hotelId,
        NOT: {
          comment: undefined,
        },
      },
      include: {
        guest: {
          select: {
            id: true,
            username: true,
            full_name: true,
          },
        },
      },
      orderBy: {
        updateAt: "desc",
      },
    });

    return NextResponse.json(
      new ApiResponseClass({
        success: true,
        data: {
          ratings,
        },
      }) as RatingHotelApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return handleNextApiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { hotelId: string } }
) {
  try {
    const hotelId = params.hotelId;
    const { score, guestId, comment }: RatingCreateDtoRequest =
      await request.json();

    if (!guestId || guestId === "null")
      throw new CustomError.AuthorizationError(
        "Cần đăng nhập tài khoản để thực hiện chức năng này!"
      );

    const guest = await prisma.user.findUnique({
      where: {
        id: guestId,
      },
    });

    if (!guest)
      throw new CustomError.AuthorizationError(
        `Không tìm thấy tài khoản với id là: ${guestId}!`
      );

    if (score <= 0 || score > 5) {
      throw new CustomError.ValidationError("Điểm đánh giá không hợp lệ");
    }

    const existingRating = await prisma.rating.findUnique({
      where: {
        guest_id_hotel_id: {
          guest_id: guestId,
          hotel_id: hotelId,
        },
      },
    });

    if (existingRating) {
      await prisma.$transaction(async (tx) => {
        await tx.rating.update({
          where: {
            id: existingRating.id,
          },
          data: {
            score: score,
            comment: comment ?? undefined,
          },
        });

        const newAverageRating = await tx.rating.aggregate({
          where: {
            hotel_id: hotelId,
          },
          _avg: {
            score: true,
          },
        });

        await tx.hotel.update({
          where: {
            id: hotelId,
          },
          data: {
            average_rating: newAverageRating._avg.score
              ? parseFloat(newAverageRating._avg.score.toFixed(1))
              : 0,
          },
        });
      });

      return NextResponse.json(
        new ApiResponseClass({
          success: true,
          message: "Cập nhật đánh giá thành công!",
        }),
        { status: 200 }
      );
    } else {
      await prisma.$transaction(async (tx) => {
        await tx.rating.create({
          data: {
            score: score,
            comment: comment ?? undefined,
            guest: {
              connect: {
                id: guest.id,
              },
            },
            hotel: {
              connect: {
                id: hotelId,
              },
            },
          },
        });

        const newAverageRating = await tx.rating.aggregate({
          where: {
            hotel_id: hotelId,
          },
          _avg: {
            score: true,
          },
        });

        await tx.hotel.update({
          where: {
            id: hotelId,
          },
          data: {
            average_rating: newAverageRating._avg.score
              ? parseFloat(newAverageRating._avg.score.toFixed(1))
              : 0,
          },
        });
      });

      return NextResponse.json(
        new ApiResponseClass({
          success: true,
          message: "Đánh giá thành công!",
        }),
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error(error);
    return handleNextApiError(error);
  }
}
