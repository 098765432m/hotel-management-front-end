import { prisma } from "@/lib/client";
import { HotelResultCardDto } from "@/types/dto/hotel.dto";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Hotel name, price range, rating,
  const { searchParams } = request.nextUrl;

  const hotelName = searchParams.get("hotelName") as string;
  const priceRange = searchParams
    .get("priceRange")
    ?.split("-")
    .map(Number) as number[];
  const ratingRange = searchParams
    .get("ratingRange")
    ?.split("-")
    .map(Number) as number[];

  const provinceId = searchParams.get("provinceId") as string;

  const params: any[] = [`%${hotelName}%`];
  let query = `
    SELECT 
      h.id as hotel_id, 
      h.name AS hotel_name,
      h.description AS hotel_description,
      h.address AS hotel_address,
      h.average_rating AS hotel_rating,
      ARRAY [MIN(rt.price), MAX(rt.price)] AS hotel_price,
      JSONB_AGG(
        JSONB_BUILD_OBJECT(
          'public_id', i.public_id,
          'format', i.format
        )
      ) as hotel_images
    FROM 
      "Hotel" h 
    LEFT JOIN 
      "RoomTypes" rt ON h.id = rt.hotel_id
    LEFT JOIN 
      "Room" r ON r.room_type_id = rt.id
    LEFT JOIN
      "Image" i ON h.id = i.hotel_id
    WHERE 
      h.name LIKE $1
    `;

  if (provinceId) {
    query += `AND h.address -> 'province' ->> 'id' = $${params.length + 1} `;
    params.push(provinceId);
  }

  if (priceRange && priceRange.length === 2) {
    query += `AND rt.price BETWEEN $${params.length + 1} AND $${
      params.length + 2
    } `;
    params.push(priceRange[0], priceRange[1]);
  }

  if (ratingRange && ratingRange.length === 2) {
    query += `AND h.average_rating BETWEEN $${params.length + 1} AND $${
      params.length + 2
    } `;
    params.push(ratingRange[0], ratingRange[1]);
  }

  query += `
  GROUP BY h.id, h.name, h.address, h.average_rating, i.public_id, i.format
  HAVING COUNT(r.status_room) FILTER (WHERE r.status_room = 'AVAILABLE') > 0
  ORDER BY h.name`;

  const hotels: any[] = await prisma.$queryRawUnsafe(query, ...params);

  const responseDto: HotelResultCardDto[] = hotels.map((hotel: any) => ({
    hotelId: hotel.hotel_id,
    hotelName: hotel.hotel_name,
    hotelDescription: hotel.hotel_description,
    hotelAddress: hotel.hotel_address,
    hotelRating: hotel.hotel_rating,
    hotelPrice: hotel.hotel_price,
    hotelImages: hotel.hotel_images,
  }));

  return NextResponse.json(responseDto);
}
