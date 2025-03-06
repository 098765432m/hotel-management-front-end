import axiosInstance from "@/lib/axiosConfig";
import {
  BookingsDashboardDtoCreate,
  BookingsDashboardDtoUpdate,
  BookingsDtoCreate,
} from "@/types/dto/booking.dto";

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

  // Dashboard Create One
  async createOneDashboard(hotelId: string, data: BookingsDashboardDtoCreate) {
    return (await this.api.post(`/hotel/${hotelId}`, data)).data;
  }

  // Dashboard Thông tin Booking
  async updateOneDashboard(
    bookingId: string,
    data: BookingsDashboardDtoUpdate
  ) {
    try {
      return (await this.api.patch(`/${bookingId}`, data)).data;
    } catch (error) {
      console.error(error);
    }
  }

  // Remove One Booking from User
  async unBookingOne(bookingId: string, roomId: string) {
    return (await this.api.delete(`/${bookingId}?roomId=${roomId}`)).data;
  }

  // Dashboard Check In
  async checkInBooking(bookingId: string, roomId: string) {
    return (await this.api.patch(`/${bookingId}/checkIn?roomId=${roomId}`))
      .data;
  }
}

const bookingsService = new BookingsService();

export default bookingsService;
