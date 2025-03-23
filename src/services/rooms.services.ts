import axiosInstance from "@/lib/axiosConfig";
import { RoomDtoCreate, RoomDtoUpdateRequest } from "@/types/dto/room.dto";

class RoomsService {
  api: any;
  constructor(baseURL = "/api/rooms") {
    this.api = axiosInstance(baseURL);
  }

  async getAll() {
    try {
      return (await this.api("/")).data;
    } catch (error) {
      console.log(error);
    }
  }

  async getOneById(id: string) {
    try {
      return (await this.api.get(`/${id}`)).data;
    } catch (error) {
      console.log(error);
    }
  }

  // Trả về số lượng phòng của khách sạn
  async getTotalHotelRooms(hotelId: string) {
    return (await this.api.get(`/hotel/${hotelId}`)).data;
  }

  //Create A Room
  async CreateOne(body: RoomDtoCreate) {
    return (await this.api.post(`/`, body)).data;
  }

  // Update A Room
  async UpdateOne(id: string, body: RoomDtoUpdateRequest) {
    return (await this.api.put(`/${id}`, body)).data;
  }

  async DeleteOne(id: string) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

const roomsServices = new RoomsService();

export default roomsServices;
