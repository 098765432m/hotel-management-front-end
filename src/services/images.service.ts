import axiosInstance from "@/lib/axiosConfig";

class ImagesService {
  api: any;
  constructor(baseURL = "/api/images") {
    this.api = axiosInstance(baseURL);
  }

  async removeOne(imageId: string, body: { public_id: string }) {
    return (await this.api.delete(`/${imageId}`, body)).data;
  }
}

const imagesService = new ImagesService();

export default imagesService;
