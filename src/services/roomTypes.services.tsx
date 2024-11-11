import axiosInstance from "@/lib/axiosConfig";
import { RoomTypeDtoCreate } from "@/types/dto/roomTypesCreate.dto";

class RoomTypesService {
  api: any;
  constructor(baseURL = "/api/roomTypes") {
    this.api = axiosInstance(baseURL);
  }

  //Get All
  async getAll() {
    try {
      return (await this.api.get("/")).data;
    } catch (error) {
      console.log(error);
    }
  }

  // Get All by Hotel
  async getAllByHotel(hotelId: string | null) {
    try {
      return (await this.api.get(`/hotel/${hotelId}`)).data;
    } catch (error) {
      console.log(error);
    }
  }

  // Get One By Id
  async getOneById(id: string) {
    try {
      return (await this.api.get(`/${id}`)).data;
    } catch (error) {
      console.log(error);
    }
  }

  //Create A RoomType
  async CreateOne(body: RoomTypeDtoCreate) {
    // try {
    return (await this.api.post(`/`, body)).data;
    // } catch (error: any) {
    //   throw new Error(error.message);
    // }
  }
}

const roomTypesServices = new RoomTypesService();

export default roomTypesServices;
