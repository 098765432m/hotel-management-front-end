import { prisma } from "@/lib/client";
import { HotelResultCardDto } from "@/types/dto/hotel.dto";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Hotel name, price range, rating,
  const { searchParams } = request.nextUrl;

  const hotelName = searchParams.get("hotelName");

  const priceRange = searchParams
    .get("priceRange")
    ?.split("-")
    .map((price) => (price !== "null" ? Number(price) : null)) as
    | [number, number]
    | [null, null];
  const ratingRange = searchParams
    .get("ratingRange")
    ?.split("-")
    .map((rating) => (rating !== "null" ? Number(rating) : null)) as
    | [number, number]
    | [null, null];

  const provinceId = searchParams.get("provinceId") ?? "";

  console.log(hotelName, priceRange, ratingRange, provinceId);

  const params: any[] = [`%${hotelName}%`];
  // TODO We should consider replace left join join
  // Because we dont want to include hotels that do not have room type. Same for roomtype and room.
  let query = `
    SELECT 
      h.id as hotel_id, 
      h.name AS hotel_name,
      h.description AS hotel_description,
      h.address AS hotel_address,
      h.average_rating AS hotel_rating,
      MIN(rt.price) AS min_price,
      MAX(rt.price) AS max_price,
      i.public_id AS public_id,
      i.format AS format
    
    FROM 
      "Hotel" h 
    JOIN 
      "RoomType" rt ON h.id = rt.hotel_id
    JOIN 
      "Room" r ON r.room_type_id = rt.id
    LEFT JOIN LATERAL
      (
        SELECT public_id, format
        FROM "Image"
        WHERE h.id = hotel_id
        LIMIT 1
      ) i ON TRUE
    WHERE 
      h.name LIKE $1
    `;

  if (provinceId) {
    query += `AND h.address -> 'province' ->> 'id' = $${params.length + 1} `;
    params.push(provinceId);
  }

  if (priceRange && priceRange.length === 2 && priceRange[0]) {
    query += `AND rt.price BETWEEN $${params.length + 1} AND $${
      params.length + 2
    } `;
    params.push(priceRange[0], priceRange[1]);
  }

  if (ratingRange && ratingRange.length === 2 && ratingRange[0]) {
    query += `AND h.average_rating BETWEEN $${params.length + 1} AND $${
      params.length + 2
    } `;
    params.push(ratingRange[0], ratingRange[1]);
  }

  query += `
  GROUP BY h.id, h.name,h.description, h.address, h.average_rating, i.public_id, i.format
  HAVING COUNT(r.status_room) FILTER (WHERE r.status_room = 'AVAILABLE') > 0
  ORDER BY h.name`;

  // Add OFFSET and LIMIT

  const hotels: any[] = await prisma.$queryRawUnsafe(query, ...params);

  console.log(hotels);

  const responseDto: HotelResultCardDto[] = hotels.map((hotel: any) => ({
    hotelId: hotel.hotel_id,
    hotelName: hotel.hotel_name,
    hotelDescription: hotel.hotel_description,
    hotelAddress: hotel.hotel_address,
    hotelRating: hotel.hotel_rating,
    hotalMinPrice: hotel.min_price,
    hotalMaxPrice: hotel.max_price,
    imagePublicId: hotel.public_id,
    imageFormat: hotel.format,
  }));

  return NextResponse.json(responseDto);
}
