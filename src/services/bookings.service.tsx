class BookingsService {
  private api: string;
  constructor(baseUrl = "/api/bookings") {
    this.api = `${process.env.NEXT_PUBLIC_APP_URL}/${baseUrl}`;
  }

  async getAll() {
    const bookings = await fetch(this.api, {
      method: "GET",
      cache: "no-store",
    });

    return bookings.json();
  }
}

const bookingsService = new BookingsService();

export default bookingsService;
