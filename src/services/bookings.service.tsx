import axiosInstance from "@/lib/axiosConfig";

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
}

const bookingsService = new BookingsService();

export default bookingsService;
