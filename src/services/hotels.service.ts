import axiosInstance from "@/lib/axiosConfig";
import { AddressType } from "@/types/address.interface";
import {
  HotelContactCreateDto,
  HotelCreateDto,
  HotelPutDto,
  HotelResultCardDto,
} from "@/types/dto/hotel.dto";

class HotelsService {
  private api: any;
  constructor(baseUrl = "/api/hotels") {
    this.api = axiosInstance(baseUrl);
  }

  async getOne(id: string) {
    return (await this.api.get(`/${id}`)).data;
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

  async searchHotel(
    hotelName: string,
    priceRange: [number, number] | [null, null],
    ratingRange: [number, number] | [null, null],
    provinceId: string | null
  ): Promise<HotelResultCardDto[]> {
    return (
      await this.api.get(
        `/search?hotelName=${hotelName}&priceRange=${
          priceRange && priceRange.length == 2
            ? `${priceRange[0]}-${priceRange[1]}`
            : ""
        }&ratingRange=${
          ratingRange && ratingRange.length == 2
            ? `${ratingRange[0]}-${ratingRange[1]}`
            : ""
        }&provinceId=${provinceId}`
      )
    ).data;
  }
}

const hotelsService = new HotelsService();

export default hotelsService;
