import { prisma } from "@/lib/client";
import { HotelResultCardDto } from "@/types/dto/hotel.dto";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Hotel name, price range, rating,
  const { searchParams } = request.nextUrl;

  const hotelName = searchParams.get("hotelName");
  console.log(
    "priceRange",
    searchParams.get("ratingRange"),
    typeof searchParams.get("ratingRange")
  );

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
  let query = `
    SELECT 
      h.id as hotel_id, 
      h.name AS hotel_name,
      h.description AS hotel_description,
      h.address AS hotel_address,
      h.average_rating AS hotel_rating,
      ARRAY [MIN(rt.price), MAX(rt.price)] AS hotel_price,
    COALESCE(
      (
        SELECT JSONB_AGG(
          DISTINCT JSONB_BUILD_OBJECT(
            'public_id', i.public_id,
            'format', i.format
          )
        )
        FROM "Image" i
        WHERE i.hotel_id = h.id
      ),
      '[]'::JSONB
    ) AS hotel_images
    FROM 
      "Hotel" h 
    LEFT JOIN 
      "RoomType" rt ON h.id = rt.hotel_id
    LEFT JOIN 
      "Room" r ON r.room_type_id = rt.id
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
  GROUP BY h.id, h.name,h.description, h.address, h.average_rating
  HAVING COUNT(r.status_room) FILTER (WHERE r.status_room = 'AVAILABLE') > 0
  ORDER BY h.name`;

  // Add OFFSET and LIMIT

  const hotels: any[] = await prisma.$queryRawUnsafe(query, ...params);

  for (let x = 0; x < hotels.length; x++) {
    console.log(`hotelName${x} `, hotels[x].hotel_name);
    console.log(`hotel${x}: `, hotels);
    // console.log("imageLength: ", hotels[x].hotel_images.length);

    // for (
    //   let image_index = 0;
    //   image_index < hotels[x].hotel_images.length;
    //   image_index++
    // ) {
    //   console.log(`image[${image_index}]:`);
    //   console.log(hotels[x].hotel_images[image_index]);
    // }
  }

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

// COALESCE(
//   JSONB_AGG(
//     DISTINCT JSONB_BUILD_OBJECT(
//       'public_id', i.public_id,
//       'format', i.format
//     )
//   ) FILTER (WHERE i.public_id IS NOT NULL OR i.format IS NOT NULL),
//    '[]'::JSONB
// )  as hotel_images
