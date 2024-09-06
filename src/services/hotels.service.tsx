import axiosInstance from "@/lib/axiosConfig";
import { Address } from "@/types/address.interface";
import { HotelsDtoCreate } from "@/types/dto/hotelsCreate.dto";

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
  async CreateOne(body: HotelsDtoCreate) {
    const address: Address = {
      street: body.street,
      ward: body.ward,
      district: body.district,
      province: body.province,
    };
    try {
      return (
        await this.api.post(`/`, {
          name: body.name,
          address: address,
        })
      ).data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

const hotelsService = new HotelsService();

export default hotelsService;
