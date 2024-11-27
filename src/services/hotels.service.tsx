import axiosInstance from "@/lib/axiosConfig";
import { AddressType } from "@/types/address.interface";
import {
  HotelContactCreateDto,
  HotelCreateDto,
  HotelPutDto,
} from "@/types/dto/hotel.dto";

class HotelsService {
  private api: any;
  constructor(baseUrl = "/api/hotels") {
    this.api = axiosInstance(baseUrl);
  }

  async getAll() {
    try {
      return (await this.api.get("/")).data;
    } catch (error) {
      console.log(error);
    }
  }

  //Create A Hotel
  async CreateOne(body: HotelCreateDto) {
    console.log(body);

    try {
      return (await this.api.post(`/`, body)).data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async createContact(body: HotelContactCreateDto) {
    return (await this.api.post("/contact", body)).data;
  }

  //update a Hotel
  async updateOne(hotelId: string, body: HotelPutDto) {
    console.log(hotelId);

    console.log(body);

    return await this.api.put(`/${hotelId}`, body);
  }
}

const hotelsService = new HotelsService();

export default hotelsService;
