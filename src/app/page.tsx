import SearchBar from "@/components/SearchBar";
import hotelsService from "@/services/hotels.service";
import HotelCard from "@/components/HotelCard";
import { Hotel } from "@/types/hotel.interface";
import EmptyData from "@/components/custom-component/EmptyData";
import CardDefault from "@/components/custom-component/CardDefault";
import { TextInput } from "@mantine/core";

export default async function Home() {
  const hotels: Hotel[] = await hotelsService.getAll();

  if (hotels == undefined) return <div></div>;
  return (
    <div>
      {/* <SearchBar></SearchBar> */}
      {/* This is Search Bar */}
      <div>
        <CardDefault>
          <div>
            <TextInput placeholder="Search"></TextInput>
          </div>
        </CardDefault>
      </div>
      <div className="flex flex-wrap gap-4">
        {hotels.length > 0 ? (
          hotels.map((hotel: Hotel, index: number) => (
            <HotelCard key={index} hotel={hotel}></HotelCard>
          ))
        ) : (
          <div>
            <EmptyData></EmptyData>
          </div>
        )}
      </div>
    </div>
  );
}
