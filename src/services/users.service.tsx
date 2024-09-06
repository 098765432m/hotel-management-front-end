import axiosInstance from "@/lib/axiosConfig";
import { UserCreateDto } from "@/types/dto/usersCreate.dto";

class UsersService {
  api: any;
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
      return await this.api.post(`/`, body);
    } catch (error: any) {
      console.log(error.message);

      throw new Error();
    }
  }
}

const usersService = new UsersService();

export default usersService;
