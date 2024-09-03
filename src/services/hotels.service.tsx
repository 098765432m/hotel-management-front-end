import axiosInstance from "@/lib/axiosConfig";
import { HotelsDtoCreate } from "@/types/dto/hotelsCreate.dto";

class HotelsService {
  private api: any;
  constructor(baseUrl = "/api/hotels") {
    this.api = axiosInstance(baseUrl);
  }

  async getAll() {
    try {
      return (await this.api("/")).data;
    } catch (error) {
      console.log(error);
    }
  }

  //Create A Hotel
  async CreateOne(body: HotelsDtoCreate) {
    try {
      return (await this.api.post(`/`, body)).data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

const hotelsService = new HotelsService();

export default hotelsService;
