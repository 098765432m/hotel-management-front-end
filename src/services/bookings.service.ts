import axiosInstance from "@/lib/axiosConfig";
import { BookingsDtoCreate } from "@/types/dto/booking.dto";

class BookingsService {
  private api: any;
  constructor(baseUrl = "/api/bookings") {
    this.api = axiosInstance(baseUrl);
  }

  async getAll() {
    try {
      return (await this.api.get("/")).data;
    } catch (error) {
      console.log(error);
    }
  }

  //Create A Booking
  async CreateOne(data: BookingsDtoCreate) {
    return (await this.api.post(`/`, data)).data;
  }

  // Remove One Booking from User
  async unBookingOne(bookingId: string, roomId: string) {
    return (await this.api.delete(`/${bookingId}?roomId=${roomId}`)).data;
  }
}

const bookingsService = new BookingsService();

export default bookingsService;
