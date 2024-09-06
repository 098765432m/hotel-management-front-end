import axiosInstance from "@/lib/axiosConfig";
import { RoomsDtoCreate } from "@/types/dto/roomsCreate.dto";

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

  //Create A Room
  async CreateOne(body: RoomsDtoCreate) {
    try {
      return (await this.api.post(`/`, body)).data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

const roomsServices = new RoomsService();

export default roomsServices;
