import axiosInstance from "@/lib/axiosConfig";
import { HotelsDtoCreate } from "@/types/dto/hotelsCreate.dto";

class BookingsService {
  private api: any;
  constructor(baseUrl = "/api/bookings") {
    this.api = axiosInstance(baseUrl);
  }

  async getAll() {
    try {
      return (await this.api("/")).data;
    } catch (error) {
      console.log(error);
    }
  }

  //Create A Room
  async CreateOne(body: HotelsDtoCreate) {
    try {
      return (await this.api.post(`/`, body)).data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

const bookingsService = new BookingsService();

export default bookingsService;
