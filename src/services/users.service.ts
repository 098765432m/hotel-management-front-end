import axiosInstance from "@/lib/axiosConfig";
import { StaffDashboardUpdateDto } from "@/types/dto/user.dto";
import { StaffCreateDto, UserCreateDto } from "@/types/dto/usersCreate.dto";

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
    console.log(body);

    try {
      return await this.api.post(`/`, body);
    } catch (error: any) {
      console.log(error.message);

      throw new Error();
    }
  }

  // Update A User
  async UpdateOne(id: string, body: StaffDashboardUpdateDto) {
    return (await this.api.put(`/${id}`, body)).data;
  }

  // Delete A User
  async DeleteOne(id: string) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

const usersService = new UsersService();

export default usersService;
