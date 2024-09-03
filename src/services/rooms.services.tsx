import axiosInstance from "@/lib/axiosConfig";

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
      return (await this.api(`/${id}`)).data;
    } catch (error) {
      console.log(error);
    }
  }
}

const roomsServices = new RoomsService();

export default roomsServices;
