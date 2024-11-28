import SearchBar from "@/components/SearchBar";
import hotelsService from "@/services/hotels.service";
import HotelCard from "@/components/HotelCard";
import { Hotel } from "@/types/hotel.interface";

export default async function Home() {
  const hotels: Hotel[] = await hotelsService.getAll();

  if (hotels == undefined) return <div></div>;
  return (
    <div>
      {/* <SearchBar></SearchBar> */}
      <div className="flex space-x-4 py-3">
        {hotels.length > 0 ? (
          hotels.map((hotel: Hotel, index: number) => (
            <HotelCard key={index} hotel={hotel}></HotelCard>
          ))
        ) : (
          <div>No room available</div>
        )}
      </div>
    </div>
  );
}
