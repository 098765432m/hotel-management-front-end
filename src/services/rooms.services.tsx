class RoomsService {
  api: string;
  constructor(baseURL = "/api/rooms") {
    this.api = `${process.env.NEXT_PUBLIC_APP_URL}/${baseURL}`;
  }

  async getAll() {
    try {
      const res = await fetch(this.api, {
        cache: "no-cache",
      });

      return await res.json();
    } catch (error) {
      console.log(error);
    }
  }

  async getOneById(id: string) {
    console.log("room_id: " + id);

    try {
      const res = await fetch(this.api + `/${id}`, {
        cache: "no-store",
      });

      return res.json();
    } catch (error) {
      console.log(error);
    }
  }
}

const roomsServices = new RoomsService();

export default roomsServices;
