import axiosInstance from "@/lib/axiosConfig";

class AuthService {
  private api: any;
  constructor(baseUrl = "/api/auth") {
    this.api = axiosInstance(baseUrl);
  }

  //Login Service
  async login(username: string, password: string) {
    // Thành công sẽ chuyển tới trang chủ và tạo session
    const result = await this.api.post(`/login`, {
      username: username,
      password: password,
    });
    return result.data;
  }

  //Login Service
  async register(
    username: string,
    password: string,
    fullName: string,
    email: string,
    phoneNumber: string
  ) {
    const result = await this.api.post(`/register`, {
      username: username,
      password: password,
      full_name: fullName,
      email: email,
      phone_number: phoneNumber,
    });
    return result.data;
  }
}

const authService = new AuthService();

export default authService;
