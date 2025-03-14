import axiosInstance from "@/lib/axiosConfig";

class RatingsService {
  private api: any;
  constructor(baseUrl = "/api/ratings") {
    this.api = axiosInstance(baseUrl);
  }

  //Create A Rating
  async createOne(
    hotelId: string,
    data: {
      guestId: string;
      score: number;
      comment?: string | null;
    }
  ) {
    return (await this.api.post(`/hotel/${hotelId}`, data)).data;
  }

  // Xóa một Rating
  async RemoveOne(ratingId: string, hotelId: string) {
    await this.api.delete(`/${ratingId}?hotelId=${hotelId}`);
  }
}

const ratingsService = new RatingsService();

export default ratingsService;
