import axiosInstance from "@/lib/axiosConfig";
import { BookingsDtoCreate } from "@/types/dto/booking.dto";
import { rangeISOToRangeDayJS } from "@/utils/dayjs";

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
    // try {
    // Extract data from FormData
    //Luu y nho them user id sau
    // const body: BookingsDtoCreate = {
    //   room_id: formData.get("roomId") as string,
    //   fullName: formData.get("fullName") as string,
    //   email: formData.get("email") as string,
    //   phoneNumber: formData.get("phoneNumber") as string,
    //   check_in_date: formData.get("checkInDate") as string,
    //   check_out_date: formData.get("checkOutDate") as string,
    // };
    // console.log(body);

    return (await this.api.post(`/`, data)).data;
    // } catch (error: any) {
    //   throw new Error(error.message);
    // }
  }

  // Remove One Booking from User
  async unBookingOne(bookingId: string, roomId: string) {
    return (await this.api.delete(`/${bookingId}?roomId=${roomId}`)).data;
  }
}

const bookingsService = new BookingsService();

export default bookingsService;
