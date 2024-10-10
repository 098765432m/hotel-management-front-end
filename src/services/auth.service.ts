import axiosInstance from "@/lib/axiosConfig";

class AuthService {
  private api: any;
  constructor(baseUrl = "/api/auth") {
    this.api = axiosInstance(baseUrl);
  }

  //Login Service
  async login(formData: FormData) {
    const username = formData.get("username");
    const password = formData.get("password");

    // Thành công sẽ chuyển tới trang chủ và tạo session
    const result = await this.api.post(`/login`, {
      username: username,
      password: password,
    });
    return result.data;
  }

  //Login Service
  async register(formData: FormData) {
    //Trích dữ liệu từ Form data
    const username = formData.get("username");
    const password = formData.get("password");
    const fullName = formData.get("fullName");
    const email = formData.get("email");

    const result = await this.api.post(`/register`, {
      username: username,
      password: password,
      fullName: fullName,
      email: email,
    });
    return result.data;
  }
}

const authService = new AuthService();

export default authService;
