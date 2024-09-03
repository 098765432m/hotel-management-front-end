import axiosInstance from "@/lib/axiosConfig";
import { UserCreateDto } from "@/types/dto/usersCreate.dto";

class UsersService {
  private api: any;
  constructor(baseUrl = "/api/users") {
    this.api = axiosInstance(baseUrl);
  }

  async getAll() {
    try {
      return (await this.api("/")).data;
    } catch (error) {
      console.log(error);
    }
  }

  //Create A User
  async CreateOne(body: UserCreateDto) {
    try {
      return (await this.api.post(`/`, body)).data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

const usersService = new UsersService();

export default usersService;
