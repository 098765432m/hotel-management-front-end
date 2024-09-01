import RoomCard from "@/components/RoomCard";
import SearchBar from "@/components/SearchBar";
import roomsServices from "@/services/rooms.services";
import { Room } from "@/types/room.interface";
export default async function Home() {
  const rooms = await roomsServices.getAll();

  if (rooms == undefined) return <div></div>;
  return (
    <div>
      <SearchBar></SearchBar>
      <div className="flex space-x-4 py-3">
        {rooms.length > 0 ? (
          rooms.map((room: Room, index: number) => (
            <RoomCard key={index} Room={room}></RoomCard>
          ))
        ) : (
          <div>No room available</div>
        )}
      </div>
    </div>
  );
}
